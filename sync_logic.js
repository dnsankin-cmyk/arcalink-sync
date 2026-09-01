function sameSyncIdentity(left, right) {
  return (
    left.entryType === right.entryType &&
    left.contentHash === right.contentHash &&
    Number(left.sizeBytes || 0) === Number(right.sizeBytes || 0)
  );
}

function shouldDeferRemoteApply(baselineEntry, currentEntry, remoteEntry) {
  if (!currentEntry || !remoteEntry) {
    return false;
  }
  if (sameSyncIdentity(currentEntry, remoteEntry)) {
    return false;
  }
  if (!baselineEntry) {
    return true;
  }
  return !sameSyncIdentity(currentEntry, baselineEntry);
}

function pathDepth(path) {
  return String(path || "")
    .split("/")
    .filter(Boolean).length;
}

function generateClientOperationId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function buildConflictPath(path) {
  const normalizedPath = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  const parentPath = lastSlashIndex >= 0 ? normalizedPath.slice(0, lastSlashIndex) : "";
  const baseName = lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
  const suffix = `sync-conflict-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  return parentPath ? `${parentPath}/${baseName}.${suffix}` : `${baseName}.${suffix}`;
}

const DEFAULT_IGNORE_PATHS = [".obsidian/", ".trash/"];
const DEFAULT_IGNORE_PATH_SEGMENTS = [".obsidian", ".trash"];
const OBSIDIAN_CONFIG_DIR = ".obsidian";
const OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS = [
  ".obsidian/workspace.json",
  ".obsidian/workspace-mobile.json",
  ".obsidian/cache",
  ".obsidian/plugins/arcalink-sync",
];

function normalizePluginPath(path) {
  return String(path || "")
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .trim();
}

function hasIgnoredPathSegment(path, ignoredSegments) {
  const normalizedPath = normalizePluginPath(path);
  if (!normalizedPath) {
    return false;
  }
  const ignoredSegmentSet = new Set(
    (Array.isArray(ignoredSegments) ? ignoredSegments : [])
      .map((segment) => normalizePluginPath(segment))
      .filter(Boolean)
  );
  return normalizedPath
    .split("/")
    .some((segment) => ignoredSegmentSet.has(segment));
}

function isPathIgnoredByPattern(
  path,
  ignorePaths = DEFAULT_IGNORE_PATHS,
  ignoredSegments = DEFAULT_IGNORE_PATH_SEGMENTS,
  options = {}
) {
  const normalizedPath = normalizePluginPath(path);
  const syncObsidianConfig = options.syncObsidianConfig === true;
  const segments = normalizedPath.split("/");
  const rootObsidianConfig =
    normalizedPath === OBSIDIAN_CONFIG_DIR ||
    normalizedPath.startsWith(`${OBSIDIAN_CONFIG_DIR}/`);
  if (segments.slice(1).includes(OBSIDIAN_CONFIG_DIR)) {
    return true;
  }
  if (rootObsidianConfig) {
    if (!syncObsidianConfig) {
      return true;
    }
    if (
      OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS.some(
        (localPath) =>
          normalizedPath === localPath || normalizedPath.startsWith(`${localPath}/`)
      )
    ) {
      return true;
    }
  } else if (hasIgnoredPathSegment(normalizedPath, ignoredSegments)) {
    return true;
  }
  return (Array.isArray(ignorePaths) ? ignorePaths : []).some((pattern) => {
    const normalizedPattern = String(pattern || "").replace(/\\/g, "/").replace(/^\.?\//, "");
    if (!normalizedPattern) {
      return false;
    }
    if (syncObsidianConfig && normalizedPattern === `${OBSIDIAN_CONFIG_DIR}/`) {
      return false;
    }
    if (normalizedPattern.endsWith("/")) {
      const prefix = normalizedPattern.slice(0, -1);
      return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
    }
    return normalizedPath === normalizedPattern;
  });
}

function cloneEntries(entries) {
  return JSON.parse(JSON.stringify(entries || {}));
}

function pruneStateEntriesMissingFromRemoteIndex(
  entries,
  remoteEntries,
  localExistingPaths,
  options = {}
) {
  const shouldApplyRemotePath =
    typeof options.shouldApplyRemotePath === "function"
      ? options.shouldApplyRemotePath
      : () => true;
  const shouldIgnorePath =
    typeof options.shouldIgnorePath === "function"
      ? options.shouldIgnorePath
      : (path) => isPathIgnoredByPattern(path);
  const remotePaths = new Set(
    (Array.isArray(remoteEntries) ? remoteEntries : [])
      .filter((entry) => entry && entry.path && !entry.is_deleted && shouldApplyRemotePath(entry.path))
      .map((entry) => normalizePluginPath(entry.path))
  );
  const localExistingPathSet = new Set(
    (Array.isArray(localExistingPaths) ? localExistingPaths : Array.from(localExistingPaths || []))
      .map((path) => normalizePluginPath(path))
      .filter(Boolean)
  );
  const prunedEntries = {};
  for (const [path, entry] of Object.entries(entries || {})) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath || shouldIgnorePath(normalizedPath)) {
      continue;
    }
    if (remotePaths.has(normalizedPath) || localExistingPathSet.has(normalizedPath)) {
      prunedEntries[normalizedPath] = entry;
    }
  }
  return prunedEntries;
}

function planLocalChanges(previousEntries, currentSnapshot, renameHints) {
  const consumedPrevious = new Set();
  const consumedCurrent = new Set();
  const moves = [];
  const fileDeletes = [];
  const directoryDeletes = [];
  const directoryCreates = [];
  const fileUpserts = [];
  const upsertBasePaths = {};

  const normalizedRenameHints = renameHints || {};
  const sortedRenameTargets = Object.keys(normalizedRenameHints).sort();
  for (const targetPath of sortedRenameTargets) {
    const sourcePath = normalizedRenameHints[targetPath];
    if (!sourcePath || sourcePath === targetPath) {
      continue;
    }
    if (consumedPrevious.has(sourcePath) || consumedCurrent.has(targetPath)) {
      continue;
    }

    const previousEntry = previousEntries[sourcePath];
    const currentEntry = currentSnapshot[targetPath];
    if (!previousEntry || !currentEntry) {
      continue;
    }

    if (previousEntry.entryType === "directory" && currentEntry.entryType === "directory") {
      moves.push({
        path: sourcePath,
        targetPath,
        entryType: "directory",
      });
      consumedPrevious.add(sourcePath);
      consumedCurrent.add(targetPath);

      const sourcePrefix = sourcePath + "/";
      const targetPrefix = targetPath + "/";
      for (const prevPath of Object.keys(previousEntries)) {
        if (prevPath.startsWith(sourcePrefix)) {
          const relative = prevPath.slice(sourcePrefix.length);
          const projectedPath = targetPrefix + relative;
          const prevEntry = previousEntries[prevPath];
          const currEntry = currentSnapshot[projectedPath];

          consumedPrevious.add(prevPath);
          if (currEntry && currEntry.entryType === prevEntry.entryType) {
            consumedCurrent.add(projectedPath);
            if (prevEntry.entryType === "file" && !sameSyncIdentity(prevEntry, currEntry)) {
              fileUpserts.push(projectedPath);
              upsertBasePaths[projectedPath] = prevPath;
            }
          }
        }
      }
      continue;
    }

    if (previousEntry.entryType !== "file" || currentEntry.entryType !== "file") {
      continue;
    }

    moves.push({
      path: sourcePath,
      targetPath,
      entryType: "file",
    });
    consumedPrevious.add(sourcePath);
    consumedCurrent.add(targetPath);

    if (!sameSyncIdentity(previousEntry, currentEntry)) {
      fileUpserts.push(targetPath);
      upsertBasePaths[targetPath] = sourcePath;
    }
  }

  const deletedFilesByIdentity = new Map();
  const createdFilesByIdentity = new Map();
  const allPaths = Array.from(
    new Set([...Object.keys(previousEntries), ...Object.keys(currentSnapshot)])
  ).sort();

  for (const path of allPaths) {
    if (consumedPrevious.has(path) || consumedCurrent.has(path)) {
      continue;
    }
    const previousEntry = previousEntries[path];
    const currentEntry = currentSnapshot[path];
    if (previousEntry && !currentEntry && previousEntry.entryType === "file") {
      const identityKey = fileIdentityKey(previousEntry);
      if (identityKey) {
        if (!deletedFilesByIdentity.has(identityKey)) {
          deletedFilesByIdentity.set(identityKey, []);
        }
        deletedFilesByIdentity.get(identityKey).push(path);
      }
    }
    if (!previousEntry && currentEntry && currentEntry.entryType === "file") {
      const identityKey = fileIdentityKey(currentEntry);
      if (identityKey) {
        if (!createdFilesByIdentity.has(identityKey)) {
          createdFilesByIdentity.set(identityKey, []);
        }
        createdFilesByIdentity.get(identityKey).push(path);
      }
    }
  }

  for (const [identityKey, createdPaths] of createdFilesByIdentity.entries()) {
    const deletedPaths = deletedFilesByIdentity.get(identityKey) || [];
    while (createdPaths.length > 0 && deletedPaths.length > 0) {
      const targetPath = createdPaths.shift();
      const sourcePath = deletedPaths.shift();
      if (sourcePath === targetPath) {
        continue;
      }
      moves.push({
        path: sourcePath,
        targetPath,
        entryType: "file",
      });
      consumedPrevious.add(sourcePath);
      consumedCurrent.add(targetPath);
    }
  }

  for (const path of allPaths) {
    const previousEntry = previousEntries[path];
    const currentEntry = currentSnapshot[path];

    const previousConsumed = previousEntry ? consumedPrevious.has(path) : false;
    const currentConsumed = currentEntry ? consumedCurrent.has(path) : false;
    if (previousConsumed || currentConsumed) {
      continue;
    }

    if (previousEntry && currentEntry) {
      if (previousEntry.entryType !== currentEntry.entryType) {
        if (previousEntry.entryType === "file") {
          fileDeletes.push(path);
        } else {
          directoryDeletes.push(path);
        }
        if (currentEntry.entryType === "directory") {
          directoryCreates.push(path);
        } else {
          fileUpserts.push(path);
        }
        continue;
      }

      if (currentEntry.entryType === "file" && !sameSyncIdentity(previousEntry, currentEntry)) {
        fileUpserts.push(path);
      }
      continue;
    }

    if (!previousEntry && currentEntry) {
      if (currentEntry.entryType === "directory") {
        directoryCreates.push(path);
      } else {
        fileUpserts.push(path);
      }
      continue;
    }

    if (previousEntry && !currentEntry) {
      if (previousEntry.entryType === "file") {
        fileDeletes.push(path);
      } else {
        directoryDeletes.push(path);
      }
    }
  }

  return {
    moves: moves.sort((left, right) => {
      if (pathDepth(left.targetPath) !== pathDepth(right.targetPath)) {
        return pathDepth(left.targetPath) - pathDepth(right.targetPath);
      }
      return left.targetPath.localeCompare(right.targetPath);
    }),
    fileDeletes: fileDeletes.sort((left, right) => pathDepth(right) - pathDepth(left)),
    directoryDeletes: directoryDeletes.sort(
      (left, right) => pathDepth(right) - pathDepth(left)
    ),
    directoryCreates: directoryCreates.sort(
      (left, right) => pathDepth(left) - pathDepth(right)
    ),
    fileUpserts: fileUpserts.sort(),
    upsertBasePaths,
  };
}

function fileIdentityKey(entry) {
  if (!entry || entry.entryType !== "file" || !entry.contentHash) {
    return null;
  }
  return `${entry.contentHash}:${Number(entry.sizeBytes || 0)}`;
}

module.exports = {
  buildConflictPath,
  cloneEntries,
  hasIgnoredPathSegment,
  isPathIgnoredByPattern,
  generateClientOperationId,
  pathDepth,
  planLocalChanges,
  pruneStateEntriesMissingFromRemoteIndex,
  sameSyncIdentity,
  shouldDeferRemoteApply,
};
