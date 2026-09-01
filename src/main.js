const {
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Platform,
  requestUrl,
  setIcon,
  Setting,
  TFile,
  TFolder,
  normalizePath,
} = require("obsidian");
const Y = require("yjs");

const PLUGIN_ID = "arcalink-sync";
const LEGACY_PLUGIN_IDS = ["obsidian-http-sync"];
const PLUGIN_VERSION = "0.1.41";
const PLUGIN_BUILD_ID = "2026-08-27T19:37:22Z";
const PLUGIN_UPDATE_LATEST_ARCHIVE_PATH = "/downloads/obsidian-http-sync-latest.zip";
const PLUGIN_UPDATE_FALLBACK_ARCHIVE_PATH = `/downloads/obsidian-http-sync-${PLUGIN_VERSION}.zip`;
const PLUGIN_UPDATE_PUBLIC_BASE_URL = "https://arcalink.ru";
const PLUGIN_UPDATE_FILES = ["manifest.json", "main.js", "sync_logic.js"];
const PLUGIN_UPDATE_WRITE_ORDER = ["main.js", "sync_logic.js", "manifest.json"];
const EVENT_SYNC_DEBOUNCE_MS = 1200;
const AUTO_SYNC_FAILURE_BACKOFF_MS = 60_000;
const SUPPRESSED_EVENT_TTL_MS = 4000;
const CRDT_LOCAL_DEBOUNCE_MS = 500;
const CRDT_POLL_INTERVAL_MS = 1500;
const CRDT_LEASE_TTL_SECONDS = 30;
const CRDT_LEASE_RENEW_INTERVAL_MS = 10000;
const CRDT_LEASE_NOTICE_INTERVAL_MS = 15000;
const NOTE_LEASE_TTL_SECONDS = 30;
const NOTE_LEASE_RENEW_INTERVAL_MS = 10000;
const NOTE_LEASE_NOTICE_INTERVAL_MS = 15000;
const CONFLICT_FETCH_LIMIT = 5000;
const DELETE_QUARANTINE_GRACE_MS = 60 * 1000;
const DELETE_QUARANTINE_MAX_BATCH_COUNT = 20;
const DELETE_QUARANTINE_MAX_BATCH_RATIO = 0.25;
const REQUIRED_CRDT_CAPABILITIES = [
  "crdt_updates",
  "crdt_snapshots",
  "crdt_update_base_sequence",
];
const DEFAULT_IGNORE_PATHS = [".obsidian/", ".trash/"];
const DEFAULT_IGNORE_PATH_SEGMENTS = [".obsidian", ".trash"];
const OBSIDIAN_CONFIG_DIR = ".obsidian";
const OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS = [
  `${OBSIDIAN_CONFIG_DIR}/workspace.json`,
  `${OBSIDIAN_CONFIG_DIR}/workspace-mobile.json`,
  `${OBSIDIAN_CONFIG_DIR}/cache`,
  `${OBSIDIAN_CONFIG_DIR}/plugins/${PLUGIN_ID}`,
];
const DEFAULT_AUTH_STATE = {
  status: "unknown",
  reason: "",
  lastChecked: null,
};
const AUTH_STATUS = {
  UNKNOWN: "unknown",
  AUTHENTICATED: "authenticated",
  MISSING_TOKEN: "missing_token",
  REFRESH_FAILED: "refresh_failed",
  SESSION_EXPIRED: "session_expired",
  SESSION_REVOKED: "session_revoked",
  BILLING_BLOCKED: "billing_blocked",
  ERROR: "error",
};
const SYNC_BLOCK_REASON = {
  NONE: "none",
  NOT_CONFIGURED: "not_configured",
  MISSING_TOKEN: "missing_token",
  SESSION_EXPIRED: "session_expired",
  SESSION_REVOKED: "session_revoked",
  REFRESH_FAILED: "refresh_failed",
  BILLING_BLOCKED: "billing_blocked",
  NETWORK_ERROR: "network_error",
  SERVER_ERROR: "server_error",
};
const STATUS_LAMP_COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#f59e0b",
};
const COLLABORATION_BLOCK_REASON = {
  NONE: "none",
  BILLING_BLOCKED: "billing_blocked_collaboration",
  NOT_IN_PLAN: "collaboration_not_in_plan",
  MEMBER_LIMIT: "member_limit_exceeded",
};
const DEFAULT_SETTINGS = {
  baseUrl: "http://45.144.65.18",
  userEmail: "",
  userId: "",
  vaultId: "",
  deviceId: "",
  deviceInstanceId: "",
  accessToken: "",
  refreshToken: "",
  language: "ru",
  authLoginCode: "",
  authLoginRequestId: "",
  authLoginExpiresAt: "",
  deviceName: "Устройство Obsidian",
  platform: detectPlatform(),
  appVersion: `obsidian-plugin/${PLUGIN_VERSION}`,
  autoSync: false,
  syncObsidianConfig: false,
  obsidianConfigBootstrapPending: false,
  syncIntervalSeconds: 5,
  crdtMarkdownEnabled: false,
  crdtEditLeaseEnabled: true,
  crdtPollIntervalMs: CRDT_POLL_INTERVAL_MS,
  telegramDefaultInboxFolder: "Inbox/Telegram",
  telegramLastLinkCode: "",
  telegramLastLinkExpiresAt: "",
  ignorePaths: DEFAULT_IGNORE_PATHS.slice(),
  syncFolderPaths: [""],
  lastSyncAt: null,
  lastError: "",
  lastSyncWarning: "",
  syncBlockReason: SYNC_BLOCK_REASON.NONE,
  collaborationBlockReason: COLLABORATION_BLOCK_REASON.NONE,
  authState: { ...DEFAULT_AUTH_STATE },
  state: {
    entries: {},
  },
  crdtState: {
    files: {},
  },
  conflicts: {
    items: {},
    lastFetchedAt: null,
    lastError: "",
  },
  pendingRenameHints: {},
  pendingDeletes: {},
  pendingLocalPaths: {},
  snapshotState: {
    revision: null,
    vaultFingerprint: "",
    crdtHeadsFingerprint: "",
    lastFullAuditAt: null,
  },
};

module.exports = class ObsidianHttpSyncPlugin extends Plugin {
  async onload() {
    this.syncInFlight = false;
    this.syncProgress = null;
    this.lastSyncProgress = { completedFiles: 0, totalFiles: 0 };
    this.intervalHandle = null;
    this.pendingSyncTimeout = null;
    this.pendingChangesDuringSync = false;
    this.localDirtyGeneration = Date.now();
    this.dirtyJournalSaveHandle = null;
    this.autoSyncRetryNotBefore = 0;
    this.renameHints = {};
    this.pendingExplicitDeletes = new Set();
    this.deletePollingHandle = null;
    this.suppressedPaths = new Map();
    this.crdtDocs = new Map();
    this.crdtLocalDebounce = new Map();
    this.crdtPollingHandle = null;
    this.crdtApplyingRemotePaths = new Set();
    this.crdtSyncQueues = new Map();
    this.crdtLeases = new Map();
    this.crdtLeaseNoticeTimestamps = new Map();
    this.crdtProtocolSupported = null;
    this.crdtProtocolUnsupportedNoticeShown = false;
    this.activeNoteLease = null;
    this.localDiffNoteLocks = new Map();
    this.noteLeaseEditorGuards = new WeakMap();
    this.noteLeaseNoticeTimestamps = new Map();
    this.remoteEditorUpdateDepth = 0;
    this.noteLeaseRoutes = {
      claim: "",
      release: "",
    };
    this.noteLeaseSupport = null;
    this.noteLeaseReadSupport = null;
    this.syncRibbonIconEl = null;
    this.syncStatusBarItemEl = null;
    this.activeNoteTakeoverButtonEl = null;
    this.activeNoteTakeoverButtonPath = "";
    this.activeNoteTakeoverButtonHostEl = null;
    await this.loadSettings();
    const syncedFileCount = Object.values(this.settings.state.entries || {}).filter(
      (entry) => entry && entry.entryType === "file"
    ).length;
    this.lastSyncProgress = {
      completedFiles: syncedFileCount,
      totalFiles: syncedFileCount,
    };

    this.installSyncRibbonIcon();
    this.installSyncStatusBarItem();
    this.registerRibbonRecovery();

    this.addCommand({
      id: "register-device",
      name: this.t("command.registerDevice"),
      callback: async () => {
        await this.registerCurrentDevice({ notify: true });
      },
    });

    this.addCommand({
      id: "sync-now",
      name: this.t("command.syncVaultNow"),
      callback: async () => {
        await this.runManualSyncFromUi();
      },
    });

    this.addCommand({
      id: "reset-local-state",
      name: this.t("command.resetLocalState"),
      callback: async () => {
        this.settings.state = { entries: {} };
        this.resetCrdtLocalState();
        this.resetSnapshotTracking();
        await this.saveSettings();
        new Notice(this.t("notice.localStateReset"));
      },
    });

    this.addCommand({
      id: "takeover-active-note-lock",
      name: this.t("command.takeoverActiveNoteLock"),
      callback: async () => {
        await this.takeOverActiveNoteLock();
      },
    });

    this.addSettingTab(new ObsidianHttpSyncSettingTab(this.app, this));
    this.registerVaultObservers();
    this.scheduleAutoSync();
    this.scheduleCrdtPolling();
    this.enqueueAutoSync("startup", 0);
  }

  onunload() {
    this.releaseActiveNoteLease().catch((error) => {
      console.warn("[obsidian-http-sync] note lease release during unload failed", error);
    });
    this.removeActiveNoteTakeoverButton();
    this.stopAutoSync();
    this.stopCrdtPolling();
    this.stopDeletePolling();
    if (this.dirtyJournalSaveHandle !== null) {
      window.clearTimeout(this.dirtyJournalSaveHandle);
      this.dirtyJournalSaveHandle = null;
      this.saveData(this.settings).catch(() => {});
    }
  }

  installSyncRibbonIcon() {
    if (this.syncRibbonIconEl && this.syncRibbonIconEl.isConnected) {
      return;
    }
    this.syncRibbonIconEl = this.addRibbonIcon("refresh-cw", this.t("command.syncNow"), async () => {
      await this.runManualSyncFromUi();
    });
  }

  installSyncStatusBarItem() {
    if (typeof this.addStatusBarItem !== "function") {
      return;
    }
    this.syncStatusBarItemEl = this.addStatusBarItem();
    this.updateSyncStatusBarItem();
    this.syncStatusBarItemEl.addEventListener("click", async () => {
      await this.runManualSyncFromUi();
    });
  }

  registerRibbonRecovery() {
    if (this.app && this.app.workspace && typeof this.app.workspace.on === "function") {
      this.registerEvent(
        this.app.workspace.on("layout-ready", () => {
          this.installSyncRibbonIcon();
        })
      );
    }
    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
      window.setTimeout(() => this.installSyncRibbonIcon(), 1000);
    }
  }

  async runManualSyncFromUi() {
    try {
      await this.syncNow({ notify: true, forceFullAudit: true });
    } catch (error) {
      console.error("[obsidian-http-sync] manual sync failed", error);
    }
  }

  async loadSettings() {
    let loaded = (await this.loadData()) || {};
    if (!hasRequiredConfig(loaded)) {
      const fallbackLoaded = await this.readSettingsFromVaultFile();
      if (hasRequiredConfig(fallbackLoaded)) {
        loaded = fallbackLoaded;
      }
    }
    const loadedDeviceInstanceId = String(loaded.deviceInstanceId || "").trim();
    const deviceInstanceId = loadedDeviceInstanceId || generateDeviceInstanceId();
    const hasLegacySharedDeviceIdentity =
      !loadedDeviceInstanceId &&
      Boolean(loaded.deviceId) &&
      isLegacyDefaultDeviceName(loaded.deviceName);
    const normalizedLoaded = {
      ...loaded,
      deviceInstanceId,
      deviceName: normalizeDeviceNameForInstance(loaded.deviceName, deviceInstanceId),
    };
    if (hasLegacySharedDeviceIdentity) {
      normalizedLoaded.deviceId = "";
      normalizedLoaded.accessToken = "";
      normalizedLoaded.refreshToken = "";
      normalizedLoaded.authLoginCode = "";
      normalizedLoaded.authLoginRequestId = "";
      normalizedLoaded.authLoginExpiresAt = "";
      normalizedLoaded.state = { entries: {} };
    }
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...normalizedLoaded,
      ignorePaths: mergeIgnorePaths(normalizedLoaded.ignorePaths),
      syncFolderPaths: normalizeSyncFolderPathList(normalizedLoaded.syncFolderPaths),
      syncBlockReason: normalizedLoaded.syncBlockReason || SYNC_BLOCK_REASON.NONE,
      collaborationBlockReason: normalizedLoaded.collaborationBlockReason || COLLABORATION_BLOCK_REASON.NONE,
      authState:
        normalizedLoaded.authState && typeof normalizedLoaded.authState === "object"
          ? {
              status: normalizedLoaded.authState.status || DEFAULT_AUTH_STATE.status,
              reason: normalizedLoaded.authState.reason || DEFAULT_AUTH_STATE.reason,
              lastChecked:
                normalizedLoaded.authState.lastChecked || DEFAULT_AUTH_STATE.lastChecked,
            }
          : { ...DEFAULT_AUTH_STATE },
      crdtMarkdownEnabled:
        normalizedLoaded.crdtMarkdownEnabled === undefined
          ? DEFAULT_SETTINGS.crdtMarkdownEnabled
          : Boolean(normalizedLoaded.crdtMarkdownEnabled),
      syncObsidianConfig:
        normalizedLoaded.syncObsidianConfig === undefined
          ? DEFAULT_SETTINGS.syncObsidianConfig
          : Boolean(normalizedLoaded.syncObsidianConfig),
      obsidianConfigBootstrapPending:
        normalizedLoaded.obsidianConfigBootstrapPending === undefined
          ? DEFAULT_SETTINGS.obsidianConfigBootstrapPending
          : Boolean(normalizedLoaded.obsidianConfigBootstrapPending),
      crdtEditLeaseEnabled:
        normalizedLoaded.crdtEditLeaseEnabled === undefined
          ? DEFAULT_SETTINGS.crdtEditLeaseEnabled
          : Boolean(normalizedLoaded.crdtEditLeaseEnabled),
      crdtPollIntervalMs: Math.max(
        1000,
        Number(normalizedLoaded.crdtPollIntervalMs) ||
          DEFAULT_SETTINGS.crdtPollIntervalMs
      ),
      state: {
        entries:
          normalizedLoaded.state && normalizedLoaded.state.entries
            ? { ...normalizedLoaded.state.entries }
            : {},
      },
      crdtState: {
        files:
          normalizedLoaded.crdtState && normalizedLoaded.crdtState.files
            ? { ...normalizedLoaded.crdtState.files }
            : {},
      },
      pendingRenameHints:
        normalizedLoaded.pendingRenameHints &&
        typeof normalizedLoaded.pendingRenameHints === "object"
          ? { ...normalizedLoaded.pendingRenameHints }
          : {},
      pendingDeletes:
        normalizedLoaded.pendingDeletes && typeof normalizedLoaded.pendingDeletes === "object"
          ? normalizePendingDeletes(normalizedLoaded.pendingDeletes)
          : {},
      pendingLocalPaths:
        normalizedLoaded.pendingLocalPaths && typeof normalizedLoaded.pendingLocalPaths === "object"
          ? { ...normalizedLoaded.pendingLocalPaths }
          : {},
      snapshotState:
        normalizedLoaded.snapshotState && typeof normalizedLoaded.snapshotState === "object"
          ? {
              revision:
                normalizedLoaded.snapshotState.revision !== null &&
                normalizedLoaded.snapshotState.revision !== undefined &&
                Number.isFinite(Number(normalizedLoaded.snapshotState.revision))
                ? Number(normalizedLoaded.snapshotState.revision)
                : null,
              vaultFingerprint: String(normalizedLoaded.snapshotState.vaultFingerprint || ""),
              crdtHeadsFingerprint: String(normalizedLoaded.snapshotState.crdtHeadsFingerprint || ""),
              lastFullAuditAt: normalizedLoaded.snapshotState.lastFullAuditAt || null,
            }
          : { ...DEFAULT_SETTINGS.snapshotState },
    };
    const entryCountBeforePrune = Object.keys(this.settings.state.entries || {}).length;
    this.settings.state.entries = this.filterSyncableStateEntries(
      this.settings.state.entries
    );
    const stateWasPruned =
      Object.keys(this.settings.state.entries || {}).length !== entryCountBeforePrune;
    if (!loadedDeviceInstanceId || hasLegacySharedDeviceIdentity || stateWasPruned) {
      await this.saveData(this.settings);
    }
  }

  async readSettingsFromVaultFile() {
    const configDir =
      this.app && this.app.vault && this.app.vault.configDir
        ? this.app.vault.configDir
        : ".obsidian";
    const settingsPath = normalizePath(`${configDir}/plugins/${PLUGIN_ID}/data.json`);
    try {
      const raw = await this.app.vault.adapter.read(settingsPath);
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.scheduleAutoSync();
    this.scheduleDeletePolling();
    this.updateSyncStatusBarItem();
  }

  stopAutoSync() {
    if (this.intervalHandle !== null) {
      window.clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.clearPendingAutoSync();
  }

  clearPendingAutoSync() {
    if (this.pendingSyncTimeout !== null) {
      window.clearTimeout(this.pendingSyncTimeout);
      this.pendingSyncTimeout = null;
    }
  }

  async waitForSyncIdleBeforeManualAction(timeoutMs = 15000) {
    const startedAt = Date.now();
    while (this.syncInFlight && Date.now() - startedAt < timeoutMs) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    if (this.syncInFlight) {
      throw new Error(this.t("notice.syncAlreadyRunning"));
    }
    this.clearPendingAutoSync();
  }

  stopDeletePolling() {
    if (this.deletePollingHandle !== null) {
      window.clearInterval(this.deletePollingHandle);
      this.deletePollingHandle = null;
    }
  }

  stopCrdtPolling() {
    if (this.crdtPollingHandle !== null) {
      window.clearInterval(this.crdtPollingHandle);
      this.crdtPollingHandle = null;
    }
    for (const timeoutHandle of this.crdtLocalDebounce.values()) {
      window.clearTimeout(timeoutHandle);
    }
    this.crdtLocalDebounce.clear();
    this.crdtLeases.clear();
    this.crdtLeaseNoticeTimestamps.clear();
    this.crdtSyncQueues.clear();
    this.releaseActiveNoteLease().catch((error) => {
      console.warn("[obsidian-http-sync] note lease release during stop failed", error);
    });
  }

  scheduleCrdtPolling() {
    this.stopCrdtPolling();
    if (!this.isConfigured()) {
      return;
    }
    const intervalMs = Math.max(
      1000,
      Number(this.settings.crdtPollIntervalMs) || CRDT_POLL_INTERVAL_MS
    );
    this.pollActiveCrdtFile().catch((error) => {
      console.error("[obsidian-http-sync] CRDT polling failed", error);
    });
    this.crdtPollingHandle = window.setInterval(() => {
      this.pollActiveCrdtFile().catch((error) => {
        console.error("[obsidian-http-sync] CRDT polling failed", error);
      });
    }, intervalMs);
  }

  scheduleAutoSync() {
    this.stopAutoSync();
    if (!this.settings.autoSync) {
      this.pendingChangesDuringSync = false;
      return;
    }
    const intervalMs = Math.max(2, Number(this.settings.syncIntervalSeconds) || 5) * 1000;
    this.intervalHandle = window.setInterval(() => {
      this.enqueueAutoSync("interval-poll", 0);
    }, intervalMs);
  }

  scheduleDeletePolling() {
    this.stopDeletePolling();
    if (!this.isConfigured()) {
      return;
    }
    this.deletePollingHandle = window.setInterval(() => {
      this.pollKnownDeletedDirectories().catch((error) => {
        console.error("[obsidian-http-sync] delete polling failed", error);
      });
    }, 1000);
  }

  registerVaultObservers() {
    this.registerEvent(
      this.app.vault.on("create", (abstractFile) => {
        this.handleVaultEvent("create", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] create handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (abstractFile) => {
        this.handleVaultEvent("modify", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] modify handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (abstractFile) => {
        this.handleVaultEvent("delete", abstractFile).catch((error) => {
          console.error("[obsidian-http-sync] delete handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (abstractFile, oldPath) => {
        this.handleVaultEvent("rename", abstractFile, oldPath).catch((error) => {
          console.error("[obsidian-http-sync] rename handler failed", error);
        });
      })
    );
    this.registerEvent(
      this.app.vault.on("raw", (path) => {
        const normalizedPath = normalizePath(String(path || ""));
        if (
          this.settings.syncObsidianConfig === true &&
          isRootObsidianConfigPath(normalizedPath) &&
          !this.isPathIgnoredByPattern(normalizedPath) &&
          !this.shouldSuppressEventPath(normalizedPath)
        ) {
          this.markLocalDirtyPath(normalizedPath);
          this.enqueueAutoSync("raw-config", EVENT_SYNC_DEBOUNCE_MS);
        }
      })
    );
    if (this.app.workspace && typeof this.app.workspace.on === "function") {
      this.registerEvent(
        this.app.workspace.on("file-open", () => {
          this.pollActiveCrdtFile().catch((error) => {
            console.error("[obsidian-http-sync] active note polling failed", error);
          });
        })
      );
      this.registerEvent(
        this.app.workspace.on("editor-change", (editor, info) => {
          this.handleEditorChange(editor, info).catch((error) => {
            console.error("[obsidian-http-sync] editor change handler failed", error);
          });
        })
      );
      this.registerEvent(
        this.app.workspace.on("layout-change", () => {
          this.updateActiveNoteTakeoverButton();
        })
      );
    }
  }

  async pollKnownDeletedDirectories() {
    const entries = Object.entries(
      this.settings && this.settings.state && this.settings.state.entries
        ? this.settings.state.entries
        : {}
    )
      .filter(
        ([path, entry]) =>
          entry &&
          entry.entryType === "directory" &&
          path &&
          !this.shouldIgnorePath(path)
      )
      .sort((left, right) => pathDepth(left[0]) - pathDepth(right[0]));
    for (const [path] of entries) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.hasPendingExplicitDeleteAncestor(normalizedPath)) {
        continue;
      }
      if (!(await this.app.vault.adapter.exists(normalizedPath))) {
        this.markPendingExplicitDeletePath(normalizedPath);
        this.markLocalDirtyPath(normalizedPath);
      }
    }
  }

  resetSnapshotTracking() {
    this.settings.pendingLocalPaths = {};
    this.settings.snapshotState = { ...DEFAULT_SETTINGS.snapshotState };
  }

  async setSyncObsidianConfig(value) {
    const enabled = Boolean(value);
    const wasEnabled = this.settings.syncObsidianConfig === true;
    this.settings.syncObsidianConfig = enabled;
    this.settings.obsidianConfigBootstrapPending = enabled && !wasEnabled;
    this.settings.state.entries = this.filterSyncableStateEntries(
      this.settings.state.entries || {}
    );
    this.settings.pendingLocalPaths = filterPathKeyedMap(
      this.settings.pendingLocalPaths,
      (path) => !this.shouldIgnorePath(path)
    );
    this.settings.pendingDeletes = filterPathKeyedMap(
      this.settings.pendingDeletes,
      (path) => !this.shouldIgnorePath(path)
    );
    this.settings.snapshotState = { ...DEFAULT_SETTINGS.snapshotState };
    await this.saveSettings();
    this.enqueueAutoSync("obsidian-config-setting", 0);
  }

  markLocalDirtyPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
      return;
    }
    this.localDirtyGeneration = Math.max(
      Number(this.localDirtyGeneration || 0) + 1,
      Date.now()
    );
    this.settings.pendingLocalPaths = this.settings.pendingLocalPaths || {};
    this.settings.pendingLocalPaths[normalizedPath] = this.localDirtyGeneration;
    this.scheduleDirtyJournalSave();
  }

  scheduleDirtyJournalSave() {
    if (this.dirtyJournalSaveHandle !== null) {
      window.clearTimeout(this.dirtyJournalSaveHandle);
    }
    this.dirtyJournalSaveHandle = window.setTimeout(() => {
      this.dirtyJournalSaveHandle = null;
      this.saveData(this.settings).catch((error) => {
        console.warn("[obsidian-http-sync] failed to persist dirty journal", error);
      });
    }, 500);
  }

  getPendingLocalPathSnapshot() {
    return { ...(this.settings.pendingLocalPaths || {}) };
  }

  clearProcessedLocalPaths(processedPaths) {
    this.settings.pendingLocalPaths = this.settings.pendingLocalPaths || {};
    for (const [path, generation] of Object.entries(processedPaths || {})) {
      if (this.settings.pendingLocalPaths[path] === generation) {
        delete this.settings.pendingLocalPaths[path];
      }
    }
  }

  async handleEditorChange(editor, info = {}) {
    if (this.remoteEditorUpdateDepth > 0) {
      return;
    }
    const infoFile = info && info.file && info.file.path ? info.file : null;
    const activeFile =
      this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
        ? this.app.workspace.getActiveFile()
        : null;
    const filePath =
      (infoFile && infoFile.path) ||
      (info && info.path) ||
      (activeFile && activeFile.path) ||
      "";
    const path = normalizePath(String(filePath || ""));
    if (!path || this.shouldIgnorePath(path) || !this.shouldTrackNoteLeaseForPath(path)) {
      return;
    }
    if (!(await this.claimLocalDiffNoteEditLock(path, { structural: false }))) {
      this.applyActiveNoteLeaseEditorGuard();
    }
  }

  async handleVaultEvent(eventType, abstractFile, oldPath = null) {
    const currentPath =
      abstractFile && abstractFile.path ? normalizePath(abstractFile.path) : "";
    const normalizedOldPath =
      oldPath !== null && oldPath !== undefined ? normalizePath(oldPath) : null;

    const relevantPaths = [currentPath, normalizedOldPath].filter(Boolean);
    if (
      relevantPaths.length === 0 ||
      relevantPaths.every((path) => this.shouldIgnorePath(path))
    ) {
      return;
    }
    const shouldSuppressVaultEvent =
      eventType === "rename"
        ? relevantPaths.length > 0 &&
          relevantPaths.every((path) => this.shouldSuppressEventPath(path))
        : relevantPaths.some((path) => this.shouldSuppressEventPath(path));
    if (shouldSuppressVaultEvent) {
      return;
    }

    if (eventType === "rename") {
      const blockedRenamePath = [currentPath, normalizedOldPath].find(
        (path) => path && this.isNoteChangeBlockedByOtherLease(path)
      );
      if (blockedRenamePath) {
        this.showNoteLeaseBlockedNotice(blockedRenamePath, {
          structural: true,
        });
        this.applyActiveNoteLeaseEditorGuard();
        return;
      }
    }

    if (eventType === "create" || eventType === "modify") {
      if (
        currentPath &&
        this.shouldTrackNoteLeaseForPath(currentPath) &&
        !(await this.claimLocalDiffNoteEditLock(currentPath, {
          structural: false,
        }))
      ) {
        return;
      }
    }

    if (eventType === "rename") {
      for (const notePath of [currentPath, normalizedOldPath]) {
        if (
          notePath &&
          this.shouldTrackNoteLeaseForPath(notePath) &&
          !(await this.claimLocalDiffNoteEditLock(notePath, { structural: true }))
        ) {
          return;
        }
      }
    }

    if (
      (eventType === "create" || eventType === "modify") &&
      currentPath &&
      this.shouldUseCrdtForPath(currentPath) &&
      !this.renameHints.hasOwnProperty(currentPath)
    ) {
      this.enqueueCrdtLocalChange(currentPath);
    }
    if ((eventType === "create" || eventType === "modify") && currentPath) {
      this.clearPendingExplicitDeletePath(currentPath);
    }
    if (
      currentPath &&
      (eventType === "modify" || eventType === "delete") &&
      this.isNoteChangeBlockedByOtherLease(currentPath)
    ) {
      this.showNoteLeaseBlockedNotice(currentPath, {
        structural: eventType === "delete",
      });
      this.applyActiveNoteLeaseEditorGuard();
    }
    if (eventType === "delete" && currentPath) {
      const clearedRenameHint = this.clearPendingRenameHintForPath(currentPath);
      this.markPendingExplicitDeletePath(currentPath);
      if (this.shouldUseCrdtForPath(currentPath)) {
        this.clearCrdtFileState(currentPath);
      } else if (abstractFile instanceof TFolder) {
        this.clearCrdtFolderState(currentPath);
      }
      if (clearedRenameHint) {
        await this.saveSettings();
      }
    }

    if (
      eventType === "rename" &&
      (abstractFile instanceof TFile || abstractFile instanceof TFolder) &&
      currentPath &&
      normalizedOldPath &&
      !this.shouldIgnorePath(currentPath) &&
      !this.shouldIgnorePath(normalizedOldPath) &&
      currentPath !== normalizedOldPath
    ) {
      this.clearPendingExplicitDeletePath(currentPath);
      this.clearPendingExplicitDeletePath(normalizedOldPath);
      this.renameHints[currentPath] = normalizedOldPath;
      // Persist rename hint so it survives plugin restarts.
      this.settings.pendingRenameHints = this.settings.pendingRenameHints || {};
      this.settings.pendingRenameHints[currentPath] = normalizedOldPath;
      await this.saveSettings();

      // Clear CRDT state for the old path so it does not conflict with the move.
      if (abstractFile instanceof TFile) {
        this.clearCrdtFileState(normalizedOldPath);
      } else if (abstractFile instanceof TFolder) {
        this.clearCrdtFolderState(normalizedOldPath);
      }
    }

    for (const path of relevantPaths) {
      this.markLocalDirtyPath(path);
    }
    this.enqueueAutoSync(eventType, EVENT_SYNC_DEBOUNCE_MS);
  }

  enqueueAutoSync(reason, delayMs = EVENT_SYNC_DEBOUNCE_MS) {
    if (!this.settings.autoSync) {
      return;
    }
    if (Date.now() < Number(this.autoSyncRetryNotBefore || 0)) {
      return;
    }
    if (this.syncInFlight) {
      if (reason !== "interval-poll") {
        this.pendingChangesDuringSync = true;
      }
      return;
    }
    if (this.pendingSyncTimeout !== null) {
      window.clearTimeout(this.pendingSyncTimeout);
      this.pendingSyncTimeout = null;
    }
    this.pendingSyncTimeout = window.setTimeout(() => {
      this.pendingSyncTimeout = null;
      this.syncNow({
        notify: false,
        forceFullAudit: reason === "startup",
      }).catch((error) => {
        console.error(`[obsidian-http-sync] auto-sync failed after ${reason}`, error);
      });
    }, Math.max(0, Number(delayMs) || 0));
  }

  isConfigured() {
    return Boolean(
      this.settings.baseUrl &&
        (this.settings.userEmail || this.settings.userId) &&
        this.settings.vaultId &&
        this.settings.deviceId &&
        (this.settings.accessToken || this.settings.refreshToken)
    );
  }

  t(key, params = {}) {
    return translate(this.settings && this.settings.language, key, params);
  }

  async ensureUserReference() {
    if (this.settings.accessToken) {
      try {
        const context = await this.refreshCurrentAuthContext();
        if (context && context.user) {
          return context.user;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] authenticated user refresh failed", error);
      }
    }

    const normalizedEmail = String(this.settings.userEmail || "").trim().toLowerCase();
    if (normalizedEmail) {
      const payload = await this.requestJson(
        "GET",
        `/users/lookup?email=${encodeURIComponent(normalizedEmail)}`
      );
      const resolvedUser = payload && payload.user ? payload.user : null;
      const resolvedId =
        resolvedUser && resolvedUser.id ? String(resolvedUser.id).trim() : "";
      if (!resolvedId) {
        throw new Error(this.t("error.resolveUser"));
      }
      let changed = false;
      if (this.settings.userId !== resolvedId) {
        this.settings.userId = resolvedId;
        changed = true;
      }
      if (!this.settings.userEmail && resolvedUser.email) {
        this.settings.userEmail = String(resolvedUser.email).trim().toLowerCase();
        changed = true;
      }
      if (changed) {
        await this.saveSettings();
      }
      return resolvedUser;
    }

    const normalizedUserId = String(this.settings.userId || "").trim();
    if (normalizedUserId) {
      return { id: normalizedUserId, email: "" };
    }

    throw new Error(this.t("error.userEmailRequired"));
  }

  async requestLoginCode(options = {}) {
    if (!this.settings.baseUrl || !this.settings.userEmail) {
      throw new Error(this.t("error.backendAndEmailRequired"));
    }

    const payload = await this.requestJson("POST", "/auth/login-requests", {
      email: this.settings.userEmail,
      device_name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion,
    });
    const loginRequest = payload.auth_login_request || {};
    this.settings.authLoginRequestId = loginRequest.id || "";
    this.settings.authLoginCode = loginRequest.one_time_code || "";
    this.settings.authLoginExpiresAt = loginRequest.expires_at || "";
    await this.saveSettings();
    if (options.notify !== false) {
      new Notice(
        this.settings.authLoginCode
          ? this.t("notice.loginCode", { code: this.settings.authLoginCode })
          : this.t("notice.loginCodeRequested")
      );
    }
    return loginRequest;
  }

  async completeLoginWithCode(oneTimeCode, options = {}) {
    const code = String(oneTimeCode || this.settings.authLoginCode || "").trim();
    if (!this.settings.baseUrl || !this.settings.userEmail || !code) {
      throw new Error(this.t("error.loginCodeRequired"));
    }

    const payload = await this.requestJson("POST", "/auth/login-requests/consume", {
      email: this.settings.userEmail,
      one_time_code: code,
      device_id: this.settings.deviceId || undefined,
      device_name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion,
    });
    await this.applyAuthSessionBundle(payload);
    await this.saveSettings();

    if (options.notify !== false) {
      new Notice(this.t("notice.loginCompleted"));
    }
    return payload;
  }

  async applyAuthSessionBundle(payload) {
    const user = payload && payload.user ? payload.user : {};
    const device = payload && payload.device ? payload.device : {};
    if (user.id) {
      this.settings.userId = String(user.id).trim();
    }
    if (user.email) {
      this.settings.userEmail = String(user.email).trim().toLowerCase();
    }
    if (device.id) {
      this.settings.deviceId = String(device.id).trim();
    }
    if (device.platform) {
      this.settings.platform = String(device.platform).trim().toLowerCase();
    }
    if (payload && payload.access_token) {
      this.settings.accessToken = payload.access_token;
    }
    if (payload && payload.refresh_token) {
      this.settings.refreshToken = payload.refresh_token;
    }
    this.settings.authLoginCode = "";
    this.settings.authLoginRequestId = "";
    this.settings.authLoginExpiresAt = "";
    this.settings.authState = {
      status: AUTH_STATUS.AUTHENTICATED,
      reason: "",
      lastChecked: new Date().toISOString(),
    };
    this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
    this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
    await this.saveSettings();
  }
  async refreshCurrentAuthContext() {
    if (!this.settings.accessToken) {
      throw new Error(this.t("error.accessTokenRequired"));
    }
    const payload = await this.requestJson("GET", "/auth/me");
    const user = payload && payload.user ? payload.user : {};
    const device = payload && payload.device ? payload.device : {};
    let changed = false;
    if (user.id && this.settings.userId !== String(user.id).trim()) {
      this.settings.userId = String(user.id).trim();
      changed = true;
    }
    if (
      user.email &&
      this.settings.userEmail !== String(user.email).trim().toLowerCase()
    ) {
      this.settings.userEmail = String(user.email).trim().toLowerCase();
      changed = true;
    }
    if (device.id && this.settings.deviceId !== String(device.id).trim()) {
      this.settings.deviceId = String(device.id).trim();
      changed = true;
    }
    if (
      device.platform &&
      this.settings.platform !== String(device.platform).trim().toLowerCase()
    ) {
      this.settings.platform = String(device.platform).trim().toLowerCase();
      changed = true;
    }
    this.settings.authState = {
      status: AUTH_STATUS.AUTHENTICATED,
      reason: "",
      lastChecked: new Date().toISOString(),
    };
    this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
    this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
    changed = true;
    if (changed) {
      await this.saveSettings();
    }
    return payload;
  }

  async listAccessibleVaults() {
    if (!this.settings.userId) {
      await this.refreshCurrentAuthContext();
    }
    if (!this.settings.userId) {
      throw new Error(this.t("error.userIdRequired"));
    }
    const payload = await this.requestJson(
      "GET",
      `/users/${encodeURIComponent(this.settings.userId)}/vaults`
    );
    return Array.isArray(payload.vaults) ? payload.vaults : [];
  }

  getAccessibleVaultSyncFolderPaths(accessibleVault) {
    const syncScope = accessibleVault && accessibleVault.sync_scope
      ? accessibleVault.sync_scope
      : null;
    if (syncScope && Array.isArray(syncScope.sync_folder_paths)) {
      return normalizeSyncFolderPathList(syncScope.sync_folder_paths);
    }
    const membership =
      accessibleVault && accessibleVault.membership ? accessibleVault.membership : null;
    if (membership && Array.isArray(membership.sync_folder_paths)) {
      return normalizeSyncFolderPathList(membership.sync_folder_paths);
    }
    return normalizeSyncFolderPathList(
      []
    );
  }

  hasEmbeddedAccessibleVaultSyncFolderPaths(accessibleVault) {
    const syncScope = accessibleVault && accessibleVault.sync_scope
      ? accessibleVault.sync_scope
      : null;
    const membership =
      accessibleVault && accessibleVault.membership ? accessibleVault.membership : null;
    return Boolean(
      (syncScope && Array.isArray(syncScope.sync_folder_paths)) ||
        (membership && Array.isArray(membership.sync_folder_paths))
    );
  }

  async loadVaultSyncScope(vaultId) {
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(vaultId)}/sync-scope`
    );
    return payload && payload.sync_scope ? payload.sync_scope : null;
  }

  async updateVaultSyncScope(paths) {
    const vaultId = String(this.settings.vaultId || "").trim();
    if (!vaultId) {
      throw new Error(this.t("error.sharingConfigRequired"));
    }
    const payload = await this.requestJson(
      "PUT",
      `/vaults/${encodeURIComponent(vaultId)}/sync-scope`,
      {
        sync_folder_paths: normalizeSyncFolderPathList(paths),
      }
    );
    const syncScope = payload && payload.sync_scope ? payload.sync_scope : {};
    this.settings.syncFolderPaths = normalizeSyncFolderPathList(
      Array.isArray(syncScope.sync_folder_paths) ? syncScope.sync_folder_paths : paths
    );
    await this.saveSettings();
    return syncScope;
  }

  async selectAccessibleVault(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const vaultId = vault.id ? String(vault.id).trim() : "";
    if (!vaultId) {
      await this.setVaultId("");
      return;
    }

    let syncFolderPaths = this.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (!this.hasEmbeddedAccessibleVaultSyncFolderPaths(accessibleVault)) {
      const syncScope = await this.loadVaultSyncScope(vaultId);
      syncFolderPaths = normalizeSyncFolderPathList(
        syncScope && Array.isArray(syncScope.sync_folder_paths)
          ? syncScope.sync_folder_paths
          : []
      );
    }

    await this.setVaultId(vaultId, { syncFolderPaths });
  }

  async connectCurrentVaultToAccessibleVault(accessibleVault, syncFolderPaths, options = {}) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const vaultId = vault.id ? String(vault.id).trim() : "";
    if (!vaultId) {
      throw new Error(this.t("error.serverVaultRequired"));
    }

    let nextSyncFolderPaths = normalizeSyncFolderPathList(syncFolderPaths);
    const serverSyncFolderPaths = this.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (JSON.stringify(nextSyncFolderPaths) !== JSON.stringify(serverSyncFolderPaths)) {
      if (accessibleVault && accessibleVault.sync_scope) {
        const payload = await this.requestJson(
          "PUT",
          `/vaults/${encodeURIComponent(vaultId)}/sync-scope`,
          {
            sync_folder_paths: nextSyncFolderPaths,
          }
        );
        const syncScope = payload && payload.sync_scope ? payload.sync_scope : {};
        nextSyncFolderPaths = normalizeSyncFolderPathList(
          Array.isArray(syncScope.sync_folder_paths)
            ? syncScope.sync_folder_paths
            : nextSyncFolderPaths
        );
      } else {
        nextSyncFolderPaths = serverSyncFolderPaths;
      }
    }

    await this.setVaultId(vaultId, {
      syncFolderPaths: nextSyncFolderPaths,
      pauseAutoSync: true,
    });
    if (options.notify !== false) {
      new Notice(this.t("notice.localVaultConnected"));
    }
  }

  getCurrentObsidianVaultName() {
    if (this.app && this.app.vault && typeof this.app.vault.getName === "function") {
      return String(this.app.vault.getName() || "").trim();
    }
    return "";
  }

  async publishCurrentVaultToServer(options = {}) {
    if (!this.settings.baseUrl || (!this.settings.userEmail && !this.settings.userId)) {
      throw new Error(this.t("error.publishVaultNeedsAccount"));
    }
    const currentUser = await this.ensureUserReference();
    const vaultName = this.getCurrentObsidianVaultName() || "Obsidian Vault";
    const payload = await this.requestJson("POST", "/vaults", {
      owner_user_id: currentUser && currentUser.id ? currentUser.id : this.settings.userId,
      owner_email: this.settings.userEmail || undefined,
      name: vaultName,
      local_vault_name: vaultName,
      sync_folder_paths: this.getSyncFolderPaths(),
    });
    const vault = payload && payload.vault ? payload.vault : {};
    if (!vault.id) {
      throw new Error(this.t("error.publishVaultMissingId"));
    }
    await this.setVaultId(vault.id);
    if (options.registerDevice !== false && !this.settings.deviceId) {
      await this.registerCurrentDevice({ notify: false });
    }
    if (options.notify !== false) {
      new Notice(this.t("notice.currentVaultPublished", { name: vault.name || vaultName }));
    }
    return vault;
  }

  async setVaultId(vaultId, options = {}) {
    const nextVaultId = String(vaultId || "").trim();
    const hasServerScope = Array.isArray(options.syncFolderPaths);
    const nextSyncFolderPaths = hasServerScope
      ? normalizeSyncFolderPathList(options.syncFolderPaths)
      : this.settings.syncFolderPaths;
    const vaultChanged = this.settings.vaultId !== nextVaultId;
    const scopeChanged =
      hasServerScope &&
      JSON.stringify(normalizeSyncFolderPathList(this.settings.syncFolderPaths)) !==
        JSON.stringify(nextSyncFolderPaths);
    if (vaultChanged || scopeChanged) {
      this.settings.vaultId = nextVaultId;
      if (hasServerScope) {
        this.settings.syncFolderPaths = nextSyncFolderPaths;
      }
      if (options.pauseAutoSync !== false && this.settings.autoSync) {
        this.settings.autoSync = false;
      }
      this.settings.state = { entries: {} };
      this.resetCrdtLocalState();
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      this.settings.pendingDeletes = {};
      this.resetSnapshotTracking();
      this.suppressedPaths.clear();
      if (vaultChanged) {
        this.settings.conflicts = {
          items: {},
          lastFetchedAt: null,
          lastError: "",
        };
      }
    }
    await this.saveSettings();
  }

  async setSyncFolderPaths(paths, options = {}) {
    const nextPaths = normalizeSyncFolderPathList(paths);
    const previousValue = JSON.stringify(this.settings.syncFolderPaths || []);
    const nextValue = JSON.stringify(nextPaths);
    this.settings.syncFolderPaths = nextPaths;
    if (previousValue !== nextValue) {
      if (options.pauseAutoSync !== false && this.settings.autoSync) {
        this.settings.autoSync = false;
      }
      this.settings.state = { entries: {} };
      this.resetCrdtLocalState();
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      this.settings.pendingDeletes = {};
      this.resetSnapshotTracking();
      this.suppressedPaths.clear();
    }
    await this.saveSettings();
    if (options.updateServer) {
      await this.updateVaultSyncScope(nextPaths);
    }
  }

  async registerCurrentDevice(options = {}) {
    if (!this.settings.baseUrl || (!this.settings.userEmail && !this.settings.userId)) {
      throw new Error(this.t("error.deviceRegistrationNeedsAccount"));
    }

    const payload = await this.requestJson("POST", "/devices", {
      user_email: this.settings.userEmail || undefined,
      user_id: this.settings.userId,
      name: this.settings.deviceName || DEFAULT_SETTINGS.deviceName,
      platform: this.settings.platform || detectPlatform(),
      app_version: this.settings.appVersion || DEFAULT_SETTINGS.appVersion,
    });
    if (payload && payload.device && payload.device.user_id) {
      this.settings.userId = String(payload.device.user_id).trim();
    }
    this.settings.deviceId = payload.device.id;
    await this.saveSettings();
    if (options.notify !== false) {
      new Notice(this.t("notice.deviceRegistered", { deviceId: this.settings.deviceId }));
    }
    return payload.device;
  }

  async listVaultMemberships() {
    this.requireSharingConfig();
    const currentUser = await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else if (currentUser && currentUser.id) {
      query.set("actor_user_id", String(currentUser.id));
    }
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/memberships?${query.toString()}`
    );
    return Array.isArray(payload.memberships) ? payload.memberships : [];
  }

  async listVaultMembershipInvites() {
    this.requireSharingConfig();
    const currentUser = await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else if (currentUser && currentUser.id) {
      query.set("actor_user_id", String(currentUser.id));
    }
    const payload = await this.requestJson(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/membership-invites?${query.toString()}`
    );
    return Array.isArray(payload.membership_invites) ? payload.membership_invites : [];
  }

  async grantVaultAccess(targetUserEmail, role, syncFolderPaths = []) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedTargetUserEmail = String(targetUserEmail || "").trim().toLowerCase();
    const normalizedRole = String(role || "").trim().toLowerCase();
    if (!normalizedTargetUserEmail) {
      throw new Error(this.t("error.targetEmailRequired"));
    }
    return this.requestJson(
      "POST",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/membership-invites`,
      {
        actor_user_email: this.settings.userEmail || undefined,
        user_email: normalizedTargetUserEmail,
        role: normalizedRole || "editor",
        sync_folder_paths: normalizeSharedFolderScopeForApi(syncFolderPaths),
      }
    );
  }

  async revokeVaultAccess(targetUserId) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedTargetUserId = String(targetUserId || "").trim();
    if (!normalizedTargetUserId) {
      throw new Error(this.t("error.targetUserIdRequired"));
    }
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else {
      query.set("actor_user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/memberships/${encodeURIComponent(
        normalizedTargetUserId
      )}?${query.toString()}`
    );
  }

  async revokeVaultInvite(inviteId) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedInviteId = String(inviteId || "").trim();
    if (!normalizedInviteId) {
      throw new Error(this.t("error.inviteIdRequired"));
    }
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("actor_user_email", this.settings.userEmail);
    } else {
      query.set("actor_user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/membership-invites/${encodeURIComponent(normalizedInviteId)}?${query.toString()}`
    );
  }

  async createTelegramLinkRequest(defaultInboxFolder) {
    this.requireSharingConfig();
    await this.ensureUserReference();
    const normalizedFolder =
      String(defaultInboxFolder || this.settings.telegramDefaultInboxFolder || "").trim() ||
      "Inbox/Telegram";
    const timezone =
      typeof Intl !== "undefined" &&
      Intl.DateTimeFormat &&
      Intl.DateTimeFormat().resolvedOptions
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        : "UTC";
    const payload = await this.requestJson(
      "POST",
      `/users/${encodeURIComponent(this.settings.userId)}/telegram-link-requests`,
      {
        default_vault_id: this.settings.vaultId,
        default_inbox_folder: normalizedFolder,
        timezone_name: timezone,
      }
    );
    const linkRequest = payload.telegram_link_request || {};
    this.settings.telegramDefaultInboxFolder = normalizedFolder;
    this.settings.telegramLastLinkCode = linkRequest.one_time_code || "";
    this.settings.telegramLastLinkExpiresAt = linkRequest.expires_at || "";
    await this.saveSettings();
    return payload;
  }

  async listTelegramLinks() {
    if (!this.settings.baseUrl || (!this.settings.userEmail && !this.settings.userId)) {
      throw new Error(this.t("error.telegramLinksNeedAccount"));
    }
    await this.ensureUserReference();
    const payload = await this.requestJson(
      "GET",
      `/users/${encodeURIComponent(this.settings.userId)}/telegram-links`
    );
    return Array.isArray(payload.telegram_links) ? payload.telegram_links : [];
  }

  async revokeTelegramLink(linkId) {
    if (!this.settings.baseUrl || (!this.settings.userEmail && !this.settings.userId)) {
      throw new Error(this.t("error.telegramLinksNeedAccount"));
    }
    await this.ensureUserReference();
    const query = new URLSearchParams();
    if (this.settings.userEmail) {
      query.set("user_email", this.settings.userEmail);
    } else {
      query.set("user_id", this.settings.userId);
    }
    return this.requestJson(
      "DELETE",
      `/telegram-links/${encodeURIComponent(linkId)}?${query.toString()}`
    );
  }

  requireSharingConfig() {
    if (
      !this.settings.baseUrl ||
      (!this.settings.userEmail && !this.settings.userId) ||
      !this.settings.vaultId
    ) {
      throw new Error(this.t("error.sharingConfigRequired"));
    }
  }

  async fetchVaultSyncSnapshot() {
    const snapshotState = this.settings.snapshotState || DEFAULT_SETTINGS.snapshotState;
    const clientVaultFingerprint = await computeVaultSnapshotFingerprint(
      this.filterSyncableStateEntries(this.settings.state.entries || {}),
      { includeObsidianConfig: this.settings.syncObsidianConfig === true }
    );
    const clientCrdtHeadsFingerprint = await computeCrdtHeadsFingerprint(
      this.settings.crdtState && this.settings.crdtState.files
        ? this.settings.crdtState.files
        : {},
      this.settings.state && this.settings.state.entries
        ? this.settings.state.entries
        : {}
    );
    const body = {
      client_vault_snapshot_fingerprint: clientVaultFingerprint,
      client_crdt_heads_fingerprint: clientCrdtHeadsFingerprint,
      include_obsidian_config: this.settings.syncObsidianConfig === true,
      include_crdt_heads: this.settings.crdtMarkdownEnabled === true,
    };
    if (
      snapshotState.revision !== null &&
      snapshotState.revision !== undefined &&
      Number.isFinite(Number(snapshotState.revision))
    ) {
      body.since_revision = Number(snapshotState.revision);
    }
    return this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/sync-snapshot`,
      body
    );
  }

  applyVaultSyncSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") {
      return;
    }
    this.settings.snapshotState = this.settings.snapshotState || {
      ...DEFAULT_SETTINGS.snapshotState,
    };
    if (Number.isFinite(Number(snapshot.revision))) {
      this.settings.snapshotState.revision = Number(snapshot.revision);
    }
    this.settings.snapshotState.vaultFingerprint = String(
      snapshot.vault_snapshot_fingerprint || ""
    );
    this.settings.snapshotState.crdtHeadsFingerprint = String(
      snapshot.crdt_heads_fingerprint || ""
    );
  }

  snapshotDeltaPaths(snapshot, pendingLocalPaths) {
    return Array.from(
      new Set([
        ...(Array.isArray(snapshot && snapshot.changed_paths)
          ? snapshot.changed_paths
          : []),
        ...Object.keys(pendingLocalPaths || {}),
      ].map((path) => normalizePath(String(path || ""))).filter(Boolean))
    );
  }

  snapshotDeltaCrdtPaths(snapshot, pendingLocalPaths) {
    return Array.from(
      new Set([
        ...(Array.isArray(snapshot && snapshot.changed_crdt_heads)
          ? snapshot.changed_crdt_heads.map((head) => head && head.path)
          : []),
        ...Object.keys(pendingLocalPaths || {}).filter((path) =>
          this.shouldUseCrdtForPath(path)
        ),
      ].map((path) => normalizePath(String(path || ""))).filter(Boolean))
    );
  }

  async syncNow(options = {}) {
    if (this.syncInFlight) {
      this.pendingChangesDuringSync = true;
      if (options.notify !== false) {
        new Notice(this.t("notice.syncAlreadyRunning"));
      }
      return null;
    }
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }

    this.syncInFlight = true;
    const pendingLocalPathsAtStart = this.getPendingLocalPathSnapshot();
    const report = this.createSyncReport();
    let snapshotComparison = null;
    let fullAudit = options.forceFullAudit === true;
    let deltaPaths = Object.keys(pendingLocalPathsAtStart);
    let deltaCrdtPaths = deltaPaths.filter((path) => this.shouldUseCrdtForPath(path));
    let sessionId = null;
    let remoteEntriesBeforePush = null;
    let finalStatus = "completed";
    let finalErrorMessage = null;
    try {
      this.currentSyncStage = "check-crdt-collaboration";
      await this.disableCrdtMarkdownIfCollaborationBlocked();

      this.currentSyncStage = "compare-vault-snapshot";
      try {
        snapshotComparison = await this.fetchVaultSyncSnapshot();
        fullAudit = fullAudit || snapshotComparison.reset_required === true;
        deltaPaths = this.snapshotDeltaPaths(snapshotComparison, pendingLocalPathsAtStart);
        deltaCrdtPaths = this.snapshotDeltaCrdtPaths(
          snapshotComparison,
          pendingLocalPathsAtStart
        );
      } catch (error) {
        if (![404, 405].includes(Number(error && error.statusCode))) {
          throw error;
        }
        fullAudit = true;
      }

      const hasPendingLocalPathsAtStart =
        Object.keys(pendingLocalPathsAtStart).length > 0;
      if (
        !fullAudit &&
        snapshotComparison &&
        snapshotComparison.unchanged !== true &&
        snapshotComparison.fingerprints_match === false &&
        deltaPaths.length === 0 &&
        deltaCrdtPaths.length === 0 &&
        !hasPendingLocalPathsAtStart &&
        this.settings.lastSyncWarning === "vault_snapshot_fingerprint_mismatch"
      ) {
        this.applyVaultSyncSnapshot(snapshotComparison);
        this.settings.lastSyncAt = new Date().toISOString();
        this.settings.lastError = "";
        this.settings.lastSyncWarning = "vault_snapshot_fingerprint_mismatch";
        await this.saveSettings();
        return report;
      }

      this.beginSyncProgress(
        options.onProgress,
        fullAudit ? [] : deltaPaths,
        fullAudit ? null : deltaPaths
      );
      if (
        !fullAudit &&
        snapshotComparison &&
        snapshotComparison.unchanged === true &&
        !hasPendingLocalPathsAtStart &&
        !this.hasPersistedPendingDeletes()
      ) {
        this.applyVaultSyncSnapshot(snapshotComparison);
        this.settings.lastSyncAt = new Date().toISOString();
        this.settings.lastError = "";
        if (snapshotComparison.fingerprints_match === true) {
          this.settings.lastSyncWarning = "";
        }
        await this.saveSettings();
        return report;
      }

      this.currentSyncStage = "create-session";
      if (this.hasPersistedPendingDeletes()) {
        remoteEntriesBeforePush = await this.fetchRemoteFileIndex();
        this.clearPendingDeletesMissingFromRemoteIndex(remoteEntriesBeforePush);
      }
      const clientSnapshotEntries = this.withPendingDeleteBaselinesForFingerprint(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const sendsWholeVaultSnapshot = this.getSyncFolderPaths().includes("");
      const clientSnapshotFingerprint = sendsWholeVaultSnapshot
        ? await computeVaultSnapshotFingerprint(
            clientSnapshotEntries,
            { includeObsidianConfig: this.settings.syncObsidianConfig === true }
          )
        : "";
      const sessionRequestBody = {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional",
        include_obsidian_config: this.settings.syncObsidianConfig === true,
      };
      if (clientSnapshotFingerprint) {
        sessionRequestBody.client_snapshot_fingerprint =
          clientSnapshotFingerprint;
      }
      const sessionPayload = await this.requestJson(
        "POST",
        "/sync-sessions",
        sessionRequestBody
      );
      sessionId = sessionPayload.sync_session.id;

      const responseWarning =
        typeof sessionPayload.divergence_warning === "string" &&
        sessionPayload.divergence_warning
          ? sessionPayload.divergence_warning
          : null;
      const serverSnapshotFingerprint =
        typeof sessionPayload.vault_snapshot_fingerprint === "string"
          ? sessionPayload.vault_snapshot_fingerprint
          : "";
      if (responseWarning) {
        report.divergenceWarning = responseWarning;
      } else if (
        serverSnapshotFingerprint &&
        clientSnapshotFingerprint &&
        serverSnapshotFingerprint !== clientSnapshotFingerprint
      ) {
        report.divergenceWarning = "vault_snapshot_fingerprint_mismatch";
      }

      if (Object.keys(this.settings.state.entries || {}).length === 0) {
        this.currentSyncStage = "bootstrap-from-remote";
        await this.maybeBootstrapFromRemote(report);
      }

      this.settings.state.entries = this.filterSyncableStateEntries(
        this.settings.state.entries
      );
      this.currentSyncStage = "reconcile-local-state-with-remote-index";
      remoteEntriesBeforePush = remoteEntriesBeforePush || (await this.fetchRemoteFileIndex());
      for (const remoteEntry of remoteEntriesBeforePush) {
        const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
        if (
          snapshotEntry &&
          snapshotEntry.entryType === "file" &&
          this.shouldApplyRemotePath(remoteEntry.path)
        ) {
          this.trackSyncFile?.(remoteEntry.path);
        }
      }
      this.settings.state.entries = await this.pruneStateEntriesMissingFromRemoteIndex(
        this.settings.state.entries,
        remoteEntriesBeforePush
      );
      if (this.settings.obsidianConfigBootstrapPending === true) {
        this.currentSyncStage = "bootstrap-obsidian-config";
        await this.bootstrapObsidianConfigFromRemote(remoteEntriesBeforePush, report);
      }
      const previousEntries = cloneEntries(this.settings.state.entries);
      const baselineEntries = cloneEntries(this.settings.state.entries);
      this.currentSyncStage = "scan-local-before-push";
      const currentSnapshot = await this.scanVault(previousEntries);
      this.applyPendingExplicitDeletes(
        previousEntries,
        currentSnapshot,
        remoteEntriesBeforePush
      );
      this.applyImplicitDirectoryDeletes(
        previousEntries,
        currentSnapshot,
        remoteEntriesBeforePush
      );

      this.currentSyncStage = "push-local-changes";
      await this.pushLocalChanges(sessionId, previousEntries, currentSnapshot, report);

      this.currentSyncStage = "sync-crdt-markdown";
      await this.syncCrdtMarkdownFiles(report, {
        paths: fullAudit ? null : deltaCrdtPaths,
        remoteEntries: remoteEntriesBeforePush,
      });

      this.currentSyncStage = "pull-remote-changes";
      await this.pullRemoteChanges(baselineEntries, report);
      this.currentSyncStage = "reconcile-remote-index";
      await this.reconcileRemoteFileIndex(baselineEntries, report);

      this.currentSyncStage = "scan-local-after-pull";
      const finalEntries = await this.scanVault(this.settings.state.entries);
      const acceptedPushAwareEntries = this.preserveAcceptedPushBaselines(
        finalEntries,
        report
      );
      const conflictAwareEntries = await this.preserveOpenConflictUnsyncedBaselines(
        acceptedPushAwareEntries,
        previousEntries,
        report
      );
      const locallyStableEntries = this.preserveLocalChangesDuringSyncBaselines(
        conflictAwareEntries,
        currentSnapshot,
        report
      );
      this.settings.state.entries = await this.preserveActiveEditLeaseUnsyncedBaseline(
        locallyStableEntries,
        currentSnapshot
      );
      this.completeSyncFiles?.(
        Object.entries(this.settings.state.entries)
          .filter(([, entry]) => entry && entry.entryType === "file")
          .map(([path]) => path)
      );
      await this.clearCompletedPendingExplicitDeletes();
      this.clearProcessedLocalPaths(pendingLocalPathsAtStart);
      if (fullAudit) {
        this.settings.snapshotState = this.settings.snapshotState || {
          ...DEFAULT_SETTINGS.snapshotState,
        };
        this.settings.snapshotState.lastFullAuditAt = new Date().toISOString();
      }
      try {
        const finalSnapshot = await this.fetchVaultSyncSnapshot();
        this.applyVaultSyncSnapshot(finalSnapshot);
        const finalVaultFingerprint = await computeVaultSnapshotFingerprint(
          this.filterSyncableStateEntries(this.settings.state.entries || {}),
          { includeObsidianConfig: this.settings.syncObsidianConfig === true }
        );
        const finalCrdtFingerprint = await computeCrdtHeadsFingerprint(
          this.settings.crdtState.files || {},
          this.settings.state.entries || {}
        );
        const crdtFingerprintMatches =
          this.settings.crdtMarkdownEnabled !== true ||
          finalCrdtFingerprint === String(finalSnapshot.crdt_heads_fingerprint || "");
        if (
          finalVaultFingerprint === String(finalSnapshot.vault_snapshot_fingerprint || "") &&
          crdtFingerprintMatches
        ) {
          report.divergenceWarning = null;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] failed to refresh sync snapshot", error);
      }
      this.settings.lastSyncAt = new Date().toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.divergenceWarning || "";
      this.settings.obsidianConfigBootstrapPending = false;
      this.renameHints = {};
      this.settings.pendingRenameHints = {};
      await this.saveSettings();

      let openConflicts = [];
      try {
        openConflicts = await this.syncConflictState();
      } catch (error) {
        console.error("[obsidian-http-sync] Failed to refresh conflict state", error);
      }
      report.conflicts = openConflicts.length;

      if (options.notify !== false) {
        const hasWarnings = Boolean(report.divergenceWarning) || report.conflicts > 0;
        new Notice(
          this.t(hasWarnings ? "notice.syncDoneWithWarning" : "notice.syncDone", {
            pushed: report.pushedOperations,
            pulled: report.pulledOperations,
            conflicts: report.conflicts,
          })
        );
      }
      return report;
    } catch (error) {
      finalStatus = "failed";
      classifyAndUpdateAuthState(this, error);
      finalErrorMessage = formatErrorWithContext(
        this.settings.language,
        this.currentSyncStage,
        error
      );
      this.settings.lastError = finalErrorMessage;
      await this.saveSettings();
      if (options.notify !== false) {
        const authNotification = buildAuthFailureNotice(this, error);
        new Notice(
          authNotification || this.t("notice.syncFailed", { message: finalErrorMessage })
        );
      }
      throw error;
    } finally {
      this.currentSyncStage = null;
      if (sessionId !== null) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: finalStatus,
            error_message: finalErrorMessage,
          });
        } catch (error) {
          console.error("[obsidian-http-sync] failed to close session", error);
        }
      }
      this.syncInFlight = false;
      this.syncProgress = null;
      if (finalStatus !== "completed") {
        this.pendingChangesDuringSync = false;
        this.autoSyncRetryNotBefore = Date.now() + AUTO_SYNC_FAILURE_BACKOFF_MS;
      } else {
        this.autoSyncRetryNotBefore = 0;
        if (this.settings.autoSync && this.pendingChangesDuringSync) {
          this.pendingChangesDuringSync = false;
          this.enqueueAutoSync("follow-up", EVENT_SYNC_DEBOUNCE_MS);
        }
      }
      this.updateSyncStatusBarItem();
    }
  }

  async pushLocalChanges(sessionId, previousEntries, currentSnapshot, report, options = {}) {
    const operationGuard = {
      operationSource: options.operationSource || "sync_diff",
      manualOverride: options.manualOverride === true,
    };
    // Merge persisted rename hints with runtime hints so renames survive restarts.
    const mergedRenameHints = {
      ...(this.settings.pendingRenameHints || {}),
      ...this.renameHints,
    };
    const plan = planLocalChanges(
      previousEntries,
      currentSnapshot,
      this.filterRenameHintsTargetingPendingDeletes(mergedRenameHints)
    );
    for (const path of plan.fileDeletes) {
      this.trackSyncFile?.(path);
    }
    for (const move of plan.moves) {
      const previousEntry = previousEntries[move.path];
      if (previousEntry && previousEntry.entryType === "file") {
        this.trackSyncFile?.(move.targetPath || move.path);
      }
    }
    for (const path of plan.fileUpserts) {
      if (!this.shouldUseCrdtForPath(path)) {
        this.trackSyncFile?.(path);
      }
    }
    this.clearPendingDeletesForCurrentSnapshot(currentSnapshot, previousEntries);
    const directoryDeletes = this.partitionDirectoryDeletes(
      plan.directoryDeletes,
      plan.moves
    );
    const plannedDeleteCount =
      plan.fileDeletes.length +
      directoryDeletes.beforeMoves.length +
      directoryDeletes.afterMoves.length;
    const baselineEntryCount = Object.keys(previousEntries || {}).length;
    const deleteBatchBlockReason = this.deleteBatchBlockReason(
      plannedDeleteCount,
      baselineEntryCount,
      report
    );
    const noteLeaseBlockCache = new Map();
    const shouldBlockNoteChange = async (path) => {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath) {
        return false;
      }
      if (noteLeaseBlockCache.has(normalizedPath)) {
        return noteLeaseBlockCache.get(normalizedPath);
      }
      const blocked = await this.isNoteChangeBlockedByOtherLeaseFresh(normalizedPath);
      noteLeaseBlockCache.set(normalizedPath, blocked);
      return blocked;
    };
    const shouldClaimNoteChange = async (path, options = {}) => {
      if (
        operationGuard.operationSource !== "sync_diff" ||
        operationGuard.manualOverride === true
      ) {
        return true;
      }
      return this.claimLocalDiffNoteEditLock(path, options);
    };

    for (const path of plan.fileDeletes) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      // A missing file has already survived the delete quarantine, and the
      // remote lease check below protects other editors. Stage the delete
      // before that check so a temporary lock cannot make the event vanish.
      const previousEntry = previousEntries[path];
      if (
        !this.shouldSendDeleteOperation(
          path,
          previousEntry,
          currentSnapshot,
          report,
          deleteBatchBlockReason
        )
      ) {
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const deletePayload = {
        client_operation_id: generateClientOperationId(),
        operation_type: "delete",
        entry_type: "file",
        path,
        storage_delta_bytes: -previousEntry.sizeBytes,
        base_content_hash: previousEntry.contentHash || null,
      };
      const conflict = await this.recordGuardedOperation(
        sessionId,
        deletePayload,
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
        this.completeSyncFile?.(path);
      }
    }

    for (const path of directoryDeletes.beforeMoves) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const previousEntry = previousEntries[path];
      if (
        !this.shouldSendDeleteOperation(
          path,
          previousEntry,
          currentSnapshot,
          report,
          deleteBatchBlockReason
        )
      ) {
        continue;
      }
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "rmdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0,
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
      }
    }

    for (const path of plan.directoryCreates) {
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "mkdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0,
        },
        report,
        operationGuard
      );
    }

    for (const move of plan.moves) {
      if (this.isPathOpenConflict(move.path, report) || this.isPathOpenConflict(move.targetPath, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if ((await shouldBlockNoteChange(move.path)) || (await shouldBlockNoteChange(move.targetPath))) {
        this.showNoteLeaseBlockedNotice(move.path || move.targetPath, {
          structural: true,
        });
        continue;
      }
      if (
        !(await shouldClaimNoteChange(move.path, { structural: true })) ||
        !(await shouldClaimNoteChange(move.targetPath, { structural: true }))
      ) {
        continue;
      }
      const previousEntry = previousEntries[move.path];
      if (!previousEntry) {
        continue;
      }
      if (previousEntry.entryType === "directory") {
        await this.ensureParentDirectories(move.targetPath);
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "move",
            entry_type: "directory",
            path: move.path,
            target_path: move.targetPath,
            storage_delta_bytes: 0,
          },
          report,
          operationGuard
        );
        continue;
      }
      if (previousEntry.entryType !== "file") {
        continue;
      }

      await this.ensureParentDirectories(move.targetPath);
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "move",
          entry_type: "file",
          path: move.path,
          target_path: move.targetPath,
          storage_delta_bytes: 0,
          base_content_hash: previousEntry.contentHash || null,
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.completeSyncFile?.(move.targetPath || move.path);
      }
    }

    for (const path of directoryDeletes.afterMoves) {
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: true });
        continue;
      }
      const previousEntry = previousEntries[path];
      if (
        !this.shouldSendDeleteOperation(
          path,
          previousEntry,
          currentSnapshot,
          report,
          deleteBatchBlockReason
        )
      ) {
        continue;
      }
      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "rmdir",
          entry_type: "directory",
          path,
          storage_delta_bytes: 0,
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.clearPendingDeletePath(path);
      }
    }

    for (const path of plan.fileUpserts) {
      if (this.shouldUseCrdtForPath(path)) {
        continue;
      }
      if (this.isPathOpenConflict(path, report)) {
        this.pendingChangesDuringSync = true;
        continue;
      }
      if (await shouldBlockNoteChange(path)) {
        this.showNoteLeaseBlockedNotice(path, { structural: false });
        continue;
      }
      if (!(await shouldClaimNoteChange(path, { structural: false }))) {
        continue;
      }
      const basePath = plan.upsertBasePaths[path] || path;
      const previousBaseEntry = previousEntries[basePath];
      const currentEntry = await this.readCurrentEntry(path, previousBaseEntry);
      if (!currentEntry || currentEntry.entryType !== "file") {
        continue;
      }

      const binaryPayload = await this.readFileBinary(path);
      const uploadPayload = await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/objects`,
        null,
        toArrayBuffer(binaryPayload),
        {
          "Content-Type": "application/octet-stream",
        }
      );

      if (uploadPayload.already_present) {
        report.reusedObjects += 1;
      } else {
        report.uploadedObjects += 1;
      }

      const previousEntry = previousBaseEntry;
      const previousSize =
        previousEntry && previousEntry.entryType === "file"
          ? previousEntry.sizeBytes
          : 0;
      const baseContentHash =
        previousEntry && previousEntry.entryType === "file"
          ? previousEntry.contentHash || null
          : null;

      const conflict = await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "upsert",
          entry_type: "file",
          path,
          storage_delta_bytes: currentEntry.sizeBytes - previousSize,
          content_hash: uploadPayload.object.content_hash,
          base_content_hash: baseContentHash,
        },
        report,
        operationGuard
      );
      if (!conflict) {
        this.rememberAcceptedPushBaseline(report, path, {
          entryType: "file",
          contentHash: uploadPayload.object.content_hash,
          sizeBytes: binaryPayload.byteLength,
          mtimeMs: currentEntry.mtimeMs,
        });
        this.clearPendingDeletePath(path);
        this.completeSyncFile?.(path);
      }
    }
  }

  async maybeBootstrapFromRemote(report) {
    const baselineEntries = {};
    await this.reconcileRemoteFileIndex(baselineEntries, report);
    // Drain any feed operations that landed after the index snapshot before
    // we treat bootstrap as complete.
    await this.pullRemoteChanges(baselineEntries, report);
    this.settings.state.entries = baselineEntries;
    return Object.keys(baselineEntries).length > 0 || report.pulledOperations > 0;
  }

  async advanceRemoteCursorToLatestFeedSequence() {
    const bootstrapReport = { pulledOperations: 0 };
    await this.pullRemoteChanges({}, bootstrapReport);
    return bootstrapReport.pulledOperations > 0;
  }

  async pullRemoteChanges(baselineEntries, report) {
    while (true) {
      const feedPayload = await this.requestJson(
        "GET",
        `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/feed?limit=100`
      );
      const operations = Array.isArray(feedPayload.operations)
        ? feedPayload.operations
        : [];
      if (operations.length === 0) {
        return;
      }

      for (const operation of operations) {
        if (!this.shouldApplyRemoteOperation(operation)) {
          continue;
        }
        const syncFilePath = this.getRemoteOperationSyncFilePath(operation);
        if (syncFilePath) {
          this.trackSyncFile?.(syncFilePath);
        }
      }

      let lastAppliedSequenceNumber = 0;
      for (const operation of operations) {
        const operationSequenceNumber = Number(operation.sequence_number || 0);
        if (!this.shouldApplyRemoteOperation(operation)) {
          lastAppliedSequenceNumber = Math.max(lastAppliedSequenceNumber, operationSequenceNumber);
          continue;
        }
        const syncFilePath = this.getRemoteOperationSyncFilePath(operation);
        const applyResult = await this.applyRemoteOperation(operation, baselineEntries, report);
        if (applyResult && applyResult.deferred) {
          if (lastAppliedSequenceNumber > 0) {
            await this.requestJson(
              "PATCH",
              `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/cursor`,
              {
                last_applied_sequence_number: lastAppliedSequenceNumber,
              }
            );
          }
          return;
        }
        if (syncFilePath && (!applyResult || applyResult.applied !== false)) {
          this.completeSyncFile?.(syncFilePath);
        }
        lastAppliedSequenceNumber = Math.max(lastAppliedSequenceNumber, operationSequenceNumber);
      }

      if (lastAppliedSequenceNumber > 0) {
        await this.requestJson(
          "PATCH",
          `/devices/${this.settings.deviceId}/vaults/${this.settings.vaultId}/cursor`,
          {
            last_applied_sequence_number: lastAppliedSequenceNumber,
          }
        );
      }
    }
  }

  getRemoteOperationSyncFilePath(operation) {
    if (!operation || String(operation.entry_type || "") !== "file") {
      return "";
    }
    const operationType = String(operation.operation_type || "");
    if (!["upsert", "delete", "move"].includes(operationType)) {
      return "";
    }
    return normalizePath(
      String(operationType === "move" ? operation.target_path || operation.path || "" : operation.path || "")
    );
  }

  shouldApplyRemoteOperation(operation) {
    const candidatePaths = [];
    if (operation && operation.path !== null && operation.path !== undefined) {
      candidatePaths.push(normalizePath(String(operation.path)));
    }
    if (operation && operation.target_path !== null && operation.target_path !== undefined) {
      candidatePaths.push(normalizePath(String(operation.target_path)));
    }
    return candidatePaths.some(
      (path) => this.shouldApplyRemotePath(path)
    );
  }

  shouldApplyRemotePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (
      this.isPathIgnoredByPattern(normalizedPath) ||
      isConflictArtifactPath(normalizedPath)
    ) {
      return false;
    }
    return this.isPathInSyncScope(normalizedPath) || this.isPathAncestorOfSyncScope(normalizedPath);
  }

  filterSyncableStateEntries(entries) {
    const filteredEntries = {};
    for (const [path, entry] of Object.entries(entries || {})) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      filteredEntries[normalizedPath] = entry;
    }
    return filteredEntries;
  }

  hasPersistedPendingDeletes() {
    return Boolean(
      this.settings &&
        this.settings.pendingDeletes &&
        typeof this.settings.pendingDeletes === "object" &&
        Object.keys(this.settings.pendingDeletes).length > 0
    );
  }

  withPendingDeleteBaselinesForFingerprint(entries) {
    const fingerprintEntries = { ...(entries || {}) };
    const pendingDeletes =
      this.settings &&
      this.settings.pendingDeletes &&
      typeof this.settings.pendingDeletes === "object"
        ? this.settings.pendingDeletes
        : {};
    for (const [path, pendingEntry] of Object.entries(pendingDeletes)) {
      const normalizedPath = normalizePath(String(path || ""));
      if (
        !normalizedPath ||
        fingerprintEntries[normalizedPath] ||
        !pendingEntry ||
        !this.shouldApplyRemotePath(normalizedPath)
      ) {
        continue;
      }
      const entryType = String(pendingEntry.entryType || "").trim().toLowerCase();
      if (entryType !== "file" && entryType !== "directory") {
        continue;
      }
      fingerprintEntries[normalizedPath] = {
        entryType,
        contentHash: entryType === "file" ? pendingEntry.contentHash || null : null,
        sizeBytes: entryType === "file" ? Number(pendingEntry.sizeBytes || 0) : 0,
        mtimeMs: null,
      };
    }
    return fingerprintEntries;
  }

  clearPendingDeletesMissingFromRemoteIndex(remoteEntries) {
    if (!this.hasPersistedPendingDeletes()) {
      return false;
    }
    const remotePaths = new Set(
      (remoteEntries || [])
        .filter((entry) => entry && entry.path && !entry.is_deleted)
        .map((entry) => normalizePath(String(entry.path || "")))
        .filter(Boolean)
    );
    let changed = false;
    for (const path of Object.keys(this.settings.pendingDeletes)) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || !remotePaths.has(normalizedPath)) {
        delete this.settings.pendingDeletes[path];
        changed = true;
      }
    }
    return changed;
  }

  async reconcileRemoteFileIndex(baselineEntries, report) {
    const syncableEntries = (await this.fetchRemoteFileIndex())
      .filter((entry) => entry.path && !entry.is_deleted && this.shouldApplyRemotePath(entry.path))
      .sort((left, right) => {
        if (left.entry_type !== right.entry_type) {
          return left.entry_type === "directory" ? -1 : 1;
        }
        const depthDelta = pathDepth(left.path) - pathDepth(right.path);
        return depthDelta || left.path.localeCompare(right.path);
      });

    for (const remoteEntry of syncableEntries) {
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry && snapshotEntry.entryType === "file") {
        this.trackSyncFile?.(remoteEntry.path);
      }
    }

    for (const remoteEntry of syncableEntries) {
      const path = remoteEntry.path;
      if (
        typeof this.isPendingRenameSourcePath === "function" &&
        this.isPendingRenameSourcePath(path)
      ) {
        continue;
      }
      if (
        typeof this.isPendingLocalDeletePath === "function" &&
        this.isPendingLocalDeletePath(path)
      ) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (!snapshotEntry) {
        continue;
      }
      const tracksFileProgress = snapshotEntry.entryType === "file";
      if (tracksFileProgress) {
        this.trackSyncFile?.(path);
      }
      const sameChecksumBaseline = await this.adoptRemoteBaselineIfSameChecksum(
        path,
        snapshotEntry,
        baselineEntries
      );
      if (sameChecksumBaseline.matched) {
        if (tracksFileProgress) {
          this.completeSyncFile?.(path);
        }
        continue;
      }
      let currentEntry = sameChecksumBaseline.currentEntry;
      if (this.shouldUseCrdtForPath(path)) {
        await this.ensureCrdtDoc(path);
        const crdtBaseline = await this.adoptRemoteBaselineIfSameChecksum(
          path,
          snapshotEntry,
          baselineEntries
        );
        if (crdtBaseline.matched) {
          if (tracksFileProgress) {
            this.completeSyncFile?.(path);
          }
          continue;
        }
        currentEntry = crdtBaseline.currentEntry;
      }
      if (
        typeof this.shouldDeferRemoteApplyForNoteLease === "function"
          ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries)
          : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" &&
              this.shouldDeferRemoteApplyForActiveEditLease(path)
      ) {
        continue;
      }
      if (
        typeof this.shouldDeferRemoteApplyForOpenConflict === "function" &&
        this.shouldDeferRemoteApplyForOpenConflict(path, report)
      ) {
        continue;
      }

      // If the note changed again after this sync cycle started, keep the
      // fresher local file and let the next sync publish it instead of
      // reapplying the older remote snapshot over the user's active edits.
      if (shouldDeferRemoteApply(baselineEntries[path] || null, currentEntry, snapshotEntry)) {
        continue;
      }

      this.markSuppressedPath(path);
      if (await this.hasUnsyncedLocalChange(path, baselineEntries)) {
        await this.captureConflictCopy(path);
      }

      if (snapshotEntry.entryType === "directory") {
        if (currentEntry && currentEntry.entryType !== "directory") {
          await this.removePath(path);
        }
        await this.ensureDirectory(path);
      } else {
        if (currentEntry && currentEntry.entryType === "directory") {
          await this.removePath(path);
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "bootstrap-from-remote",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        if (
          (typeof this.shouldDeferRemoteApplyForNoteLease === "function"
            ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries)
            : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" &&
                this.shouldDeferRemoteApplyForActiveEditLease(path)) ||
          (typeof this.shouldDeferRemoteApplyForOpenConflict === "function" &&
            this.shouldDeferRemoteApplyForOpenConflict(path, report)) ||
          (await this.hasUnsyncedLocalChange(path, baselineEntries))
        ) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
        this.markClassicMarkdownForCrdtBridge(path);
      }

      await this.refreshBaselineEntry(baselineEntries, path);
      this.addReportRemoteAppliedPath(report, path, baselineEntries[path] || null);
      report.pulledOperations += 1;
      if (tracksFileProgress) {
        this.completeSyncFile?.(path);
      }
    }
  }

  isPendingRenameSourcePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const renameHints = {
      ...(this.settings && this.settings.pendingRenameHints
        ? this.settings.pendingRenameHints
        : {}),
      ...(this.renameHints || {}),
    };
    return Object.values(renameHints).some((sourcePath) => {
      const normalizedSourcePath = normalizePath(String(sourcePath || ""));
      return (
        normalizedSourcePath &&
        (normalizedPath === normalizedSourcePath ||
          normalizedPath.startsWith(`${normalizedSourcePath}/`))
      );
    });
  }

  isPendingRenameTargetPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const renameHints = {
      ...(this.settings && this.settings.pendingRenameHints
        ? this.settings.pendingRenameHints
        : {}),
      ...(this.renameHints || {}),
    };
    return Object.keys(renameHints).some((targetPath) => {
      const normalizedTargetPath = normalizePath(String(targetPath || ""));
      return (
        normalizedTargetPath &&
        (normalizedPath === normalizedTargetPath ||
          normalizedPath.startsWith(`${normalizedTargetPath}/`))
      );
    });
  }

  async adoptRemoteBaselineIfSameChecksum(path, snapshotEntry, baselineEntries) {
    const currentEntry = await this.readCurrentEntry(path, baselineEntries[path]);
    if (currentEntry && sameSyncIdentity(currentEntry, snapshotEntry)) {
      baselineEntries[path] = currentEntry;
      return { matched: true, currentEntry };
    }
    return { matched: false, currentEntry };
  }

  async fetchRemoteFileIndex() {
    const pageSize = 1000;
    const files = [];
    const seenPageSignatures = new Set();
    for (let offset = 0; ; offset += pageSize) {
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=${pageSize}&offset=${offset}`
      );
      const page = Array.isArray(payload.files) ? payload.files : [];
      const firstEntry = page[0] || {};
      const lastEntry = page[page.length - 1] || {};
      const pageSignature = [
        page.length,
        firstEntry.id || firstEntry.path || "",
        lastEntry.id || lastEntry.path || "",
      ].join(":");
      if (page.length > 0 && seenPageSignatures.has(pageSignature)) {
        throw new Error("remote_file_index_pagination_unsupported");
      }
      seenPageSignatures.add(pageSignature);
      files.push(...page);
      if (page.length < pageSize) {
        break;
      }
    }
    return files.map((entry) => ({
      ...entry,
      path: normalizePath(String(entry.path || "")),
      entry_type: String(entry.entry_type || ""),
    }));
  }

  async pruneStateEntriesMissingFromRemoteIndex(entries, remoteEntries) {
    const remotePaths = new Set(
      remoteEntries
        .filter((entry) => entry.path && !entry.is_deleted && this.shouldApplyRemotePath(entry.path))
        .map((entry) => entry.path)
    );
    const prunedEntries = {};
    for (const [path, entry] of Object.entries(entries || {})) {
      const normalizedPath = normalizePath(String(path || ""));
      if (!normalizedPath || this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      if (remotePaths.has(normalizedPath)) {
        prunedEntries[normalizedPath] = entry;
        continue;
      }
      if (await this.app.vault.adapter.exists(normalizedPath)) {
        prunedEntries[normalizedPath] = entry;
      }
    }
    return prunedEntries;
  }

  remoteFileEntryToSnapshotEntry(remoteEntry) {
    const entryType = String(remoteEntry.entry_type || "");
    if (entryType === "directory") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: null,
      };
    }
    if (entryType !== "file" || !remoteEntry.current_content_hash) {
      return null;
    }
    return {
      entryType: "file",
      contentHash: String(remoteEntry.current_content_hash),
      sizeBytes: Number(remoteEntry.current_size_bytes || 0),
      mtimeMs: null,
    };
  }

  async bootstrapObsidianConfigFromRemote(remoteEntries, report) {
    const configEntries = (Array.isArray(remoteEntries) ? remoteEntries : [])
      .filter(
        (entry) =>
          entry &&
          entry.path &&
          !entry.is_deleted &&
          isRootObsidianConfigPath(entry.path) &&
          this.shouldApplyRemotePath(entry.path)
      )
      .sort((left, right) => {
        if (left.entry_type !== right.entry_type) {
          return left.entry_type === "directory" ? -1 : 1;
        }
        return pathDepth(left.path) - pathDepth(right.path) ||
          left.path.localeCompare(right.path);
      });

    for (const remoteEntry of configEntries) {
      const path = normalizePath(String(remoteEntry.path || ""));
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (!snapshotEntry) {
        continue;
      }
      this.markSuppressedPath(path);
      if (snapshotEntry.entryType === "directory") {
        await this.ensureDirectory(path);
      } else {
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "bootstrap-obsidian-config",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
      }
      const currentEntry = await this.readCurrentEntry(path, snapshotEntry);
      this.settings.state.entries[path] = currentEntry || snapshotEntry;
      this.addReportRemoteAppliedPath(
        report,
        path,
        this.settings.state.entries[path]
      );
    }
  }

  remoteOperationToSnapshotEntry(operation) {
    return remoteOperationToSnapshotEntry(operation);
  }

  buildRemoteSyncScopeIndex(remoteEntries) {
    const remoteSnapshot = {};
    const remoteEntryByPath = {};
    for (const remoteEntry of remoteEntries || []) {
      const remotePath = normalizePath(String(remoteEntry.path || ""));
      if (
        !remotePath ||
        remoteEntry.is_deleted ||
        !this.shouldApplyRemotePath(remotePath) ||
        !this.isPathInSyncScope(remotePath)
      ) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry) {
        remoteSnapshot[remotePath] = snapshotEntry;
        remoteEntryByPath[remotePath] = remoteEntry;
      }
    }
    return { snapshot: remoteSnapshot, entries: remoteEntryByPath };
  }

  buildRemoteSyncScopeSnapshot(remoteEntries) {
    return this.buildRemoteSyncScopeIndex(remoteEntries).snapshot;
  }

  buildVaultDivergenceDetails(paths, localSnapshot, remoteSnapshot, remoteEntryByPath) {
    const details = {};
    for (const path of paths) {
      details[path] = {
        local: localSnapshot[path]
          ? buildVaultDivergenceLocalDetail(localSnapshot[path])
          : null,
        server: remoteSnapshot[path]
          ? buildVaultDivergenceServerDetail(remoteSnapshot[path], remoteEntryByPath[path])
          : null,
      };
    }
    return details;
  }

  createSyncReport() {
    return {
      uploadedObjects: 0,
      reusedObjects: 0,
      pushedOperations: 0,
      pulledOperations: 0,
      conflicts: 0,
      crdtPushed: 0,
      crdtPulled: 0,
      missingRemoteObjectContent: 0,
      divergenceWarning: null,
      deferredDeletes: 0,
      deferredNoteLocks: 0,
      conflictedPaths: new Set(),
      acceptedPushEntries: {},
      remotelyAppliedPaths: new Set(),
      remotelyAppliedEntries: {},
    };
  }

  async buildVaultDivergenceReport() {
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }
    const remoteEntries = await this.fetchRemoteFileIndex();
    const remoteIndex = this.buildRemoteSyncScopeIndex(remoteEntries);
    const remoteSnapshot = remoteIndex.snapshot;

    const previousEntries = cloneEntries(
      this.filterSyncableStateEntries(this.settings.state.entries || {})
    );
    const localSnapshot = this.filterSyncableStateEntries(
      await this.scanVault(previousEntries)
    );
    const localPaths = Object.keys(localSnapshot).sort();
    const remotePaths = Object.keys(remoteSnapshot).sort();
    const localPathSet = new Set(localPaths);
    const remotePathSet = new Set(remotePaths);
    const localOnly = localPaths.filter((path) => !remotePathSet.has(path));
    const remoteOnly = remotePaths.filter((path) => !localPathSet.has(path));
    const changed = localPaths.filter(
      (path) =>
        remotePathSet.has(path) &&
        snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
    );
    const detailPaths = Array.from(
      new Set(localOnly.concat(remoteOnly, changed))
    ).sort();

    return {
      checkedAt: new Date().toISOString(),
      localCount: localPaths.length,
      remoteCount: remotePaths.length,
      localOnly,
      remoteOnly,
      changed,
      details: this.buildVaultDivergenceDetails(
        detailPaths,
        localSnapshot,
        remoteSnapshot,
        remoteIndex.entries
      ),
    };
  }

  async acceptServerVaultState() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }

    this.syncInFlight = true;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const remoteSnapshot = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const previousEntries = cloneEntries(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const localSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const localPaths = Object.keys(localSnapshot).sort();
      const remotePaths = Object.keys(remoteSnapshot).sort();
      const localPathSet = new Set(localPaths);
      const remotePathSet = new Set(remotePaths);
      const changed = localPaths.filter(
        (path) =>
          remotePathSet.has(path) &&
          snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
      );
      const localOnly = localPaths
        .filter((path) => !remotePathSet.has(path))
        .sort((left, right) => pathDepth(right) - pathDepth(left) || right.localeCompare(left));
      const pathsToApply = remotePaths
        .filter((path) => changed.includes(path) || !localPathSet.has(path))
        .sort((left, right) => {
          const leftEntry = remoteSnapshot[left];
          const rightEntry = remoteSnapshot[right];
          if (leftEntry.entryType !== rightEntry.entryType) {
            return leftEntry.entryType === "directory" ? -1 : 1;
          }
          return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
        });
      let preservedLocalCopies = 0;
      let removedLocalOnly = 0;
      let appliedRemote = 0;
      const report = this.createSyncReport();

      for (const path of localOnly) {
        if (await this.app.vault.adapter.exists(path)) {
          await this.captureConflictCopy(path);
          preservedLocalCopies += 1;
          this.markSuppressedPath(path);
          await this.removePath(path);
          removedLocalOnly += 1;
        }
        delete this.settings.state.entries[path];
        if (localSnapshot[path] && localSnapshot[path].entryType === "directory") {
          this.clearCrdtFolderState(path);
        } else {
          this.clearCrdtFileState(path);
        }
      }

      for (const path of pathsToApply) {
        const snapshotEntry = remoteSnapshot[path];
        const currentEntry = await this.readCurrentEntry(path, previousEntries[path]);
        if (currentEntry && !sameSyncIdentity(currentEntry, snapshotEntry)) {
          await this.captureConflictCopy(path);
          preservedLocalCopies += 1;
        }
        this.markSuppressedPath(path);
        if (snapshotEntry.entryType === "directory") {
          if (currentEntry && currentEntry.entryType !== "directory") {
            await this.removePath(path);
          }
          await this.ensureDirectory(path);
        } else {
          if (currentEntry && currentEntry.entryType === "directory") {
            await this.removePath(path);
          }
          const binaryResponse = await this.downloadRemoteContentForSync(
            snapshotEntry.contentHash,
            "accept-server-vault-state",
            path,
            report
          );
          if (!binaryResponse) {
            continue;
          }
          await this.writeBinaryFile(path, binaryResponse);
        }
        appliedRemote += 1;
      }

      const finalEntries = await this.scanVault(this.settings.state.entries);
      this.settings.state.entries = this.filterSyncableStateEntries(finalEntries);
      this.settings.lastSyncAt = new Date().toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.divergenceWarning || "";
      await this.saveSettings();

      return {
        appliedRemote,
        removedLocalOnly,
        preservedLocalCopies,
      };
    } finally {
      this.syncInFlight = false;
    }
  }

  async publishLocalVaultStateAsSource() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }

    this.syncInFlight = true;
    let sessionId = null;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const previousEntries = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const currentSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional",
      });
      sessionId = sessionPayload.sync_session.id;
      const report = this.createSyncReport();

      await this.pushLocalChanges(sessionId, previousEntries, currentSnapshot, report, {
        operationSource: "publish_source",
        manualOverride: true,
      });

      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed",
      });
      sessionId = null;

      this.settings.state.entries = currentSnapshot;
      this.settings.lastSyncAt = new Date().toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning = report.conflicts > 0 ? "sync_conflicts_open" : "";
      await this.saveSettings();

      return report;
    } catch (error) {
      if (sessionId) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500),
          });
        } catch (_e) {
          // best-effort cleanup
        }
      }
      throw error;
    } finally {
      this.syncInFlight = false;
    }
  }

  async mergeVaultDivergenceFileSets() {
    await this.waitForSyncIdleBeforeManualAction();
    if (!this.isConfigured()) {
      throw new Error(this.t("error.pluginNotConfigured"));
    }

    this.syncInFlight = true;
    let sessionId = null;
    try {
      const remoteEntries = await this.fetchRemoteFileIndex();
      const remoteSnapshot = this.buildRemoteSyncScopeSnapshot(remoteEntries);
      const previousEntries = cloneEntries(
        this.filterSyncableStateEntries(this.settings.state.entries || {})
      );
      const localSnapshot = this.filterSyncableStateEntries(
        await this.scanVault(previousEntries)
      );
      const localPaths = Object.keys(localSnapshot).sort();
      const remotePaths = Object.keys(remoteSnapshot).sort();
      const localPathSet = new Set(localPaths);
      const remotePathSet = new Set(remotePaths);
      const localOnly = localPaths
        .filter((path) => !remotePathSet.has(path))
        .sort((left, right) => {
          const leftEntry = localSnapshot[left];
          const rightEntry = localSnapshot[right];
          if (leftEntry.entryType !== rightEntry.entryType) {
            return leftEntry.entryType === "directory" ? -1 : 1;
          }
          return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
        });
      const remoteOnly = remotePaths
        .filter((path) => !localPathSet.has(path))
        .sort((left, right) => {
          const leftEntry = remoteSnapshot[left];
          const rightEntry = remoteSnapshot[right];
          if (leftEntry.entryType !== rightEntry.entryType) {
            return leftEntry.entryType === "directory" ? -1 : 1;
          }
          return pathDepth(left) - pathDepth(right) || left.localeCompare(right);
        });
      const changed = localPaths.filter(
        (path) =>
          remotePathSet.has(path) &&
          snapshotEntryIdentity(localSnapshot[path]) !== snapshotEntryIdentity(remoteSnapshot[path])
      );
      const report = this.createSyncReport();
      let downloadedRemoteOnly = 0;
      let uploadedLocalOnly = 0;
      let createdRemoteDirectories = 0;

      for (const path of remoteOnly) {
        const snapshotEntry = remoteSnapshot[path];
        this.markSuppressedPath(path);
        if (snapshotEntry.entryType === "directory") {
          await this.ensureDirectory(path);
          downloadedRemoteOnly += 1;
          continue;
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          snapshotEntry.contentHash,
          "merge-vault-divergence-file-sets",
          path,
          report
        );
        if (!binaryResponse) {
          continue;
        }
        await this.writeBinaryFile(path, binaryResponse);
        downloadedRemoteOnly += 1;
      }

      if (localOnly.length > 0) {
        const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
          vault_id: this.settings.vaultId,
          device_id: this.settings.deviceId,
          direction: "bidirectional",
        });
        sessionId = sessionPayload.sync_session.id;

        for (const path of localOnly) {
          const localEntry = localSnapshot[path];
          if (!localEntry) {
            continue;
          }
          if (localEntry.entryType === "directory") {
            const conflict = await this.recordGuardedOperation(
              sessionId,
              {
                client_operation_id: generateClientOperationId(),
                operation_type: "mkdir",
                entry_type: "directory",
                path,
                storage_delta_bytes: 0,
              },
              report,
              {
                operationSource: "merge_divergence",
                manualOverride: true,
              }
            );
            if (!conflict) {
              createdRemoteDirectories += 1;
            }
            continue;
          }
          if (localEntry.entryType !== "file") {
            continue;
          }
          const binaryPayload = await this.readFileBinary(path);
          const uploadPayload = await this.requestJson(
            "POST",
            `/sync-sessions/${sessionId}/objects`,
            null,
            toArrayBuffer(binaryPayload),
            { "Content-Type": "application/octet-stream" }
          );
          if (uploadPayload.already_present) {
            report.reusedObjects += 1;
          } else {
            report.uploadedObjects += 1;
          }
          const conflict = await this.recordGuardedOperation(
            sessionId,
            {
              client_operation_id: generateClientOperationId(),
              operation_type: "upsert",
              entry_type: "file",
              path,
              storage_delta_bytes: Number(localEntry.sizeBytes || 0),
              content_hash: uploadPayload.object.content_hash,
              base_content_hash: null,
            },
            report,
            {
              operationSource: "merge_divergence",
              manualOverride: true,
            }
          );
          if (!conflict) {
            uploadedLocalOnly += 1;
          }
        }

        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "completed",
        });
        sessionId = null;
      }

      const finalEntries = await this.scanVault(this.settings.state.entries);
      this.settings.state.entries = this.filterSyncableStateEntries(finalEntries);
      this.settings.lastSyncAt = new Date().toISOString();
      this.settings.lastError = "";
      this.settings.lastSyncWarning =
        report.divergenceWarning || (report.conflicts > 0 ? "sync_conflicts_open" : "");
      await this.saveSettings();

      return {
        downloadedRemoteOnly,
        uploadedLocalOnly,
        createdRemoteDirectories,
        skippedChanged: changed.length,
        conflicts: report.conflicts,
        missingRemoteObjectContent: report.missingRemoteObjectContent,
      };
    } catch (error) {
      if (sessionId) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500),
          });
        } catch (_e) {
          // best-effort cleanup
        }
      }
      throw error;
    } finally {
      this.syncInFlight = false;
    }
  }

  async applyRemoteOperation(operation, baselineEntries, report) {
    const operationType = String(operation.operation_type);
    const path = String(operation.path);
    const targetPath =
      operation.target_path !== null && operation.target_path !== undefined
        ? String(operation.target_path)
        : null;
    const contentHash =
      operation.content_hash !== null && operation.content_hash !== undefined
        ? String(operation.content_hash)
        : null;

    try {
      const touchedPaths = [path];
      if (targetPath) {
        touchedPaths.push(targetPath);
      }

      if (
        operationType !== "delete" &&
        operationType !== "rmdir" &&
        typeof this.isPendingLocalDeletePath === "function" &&
        touchedPaths.some((touchedPath) => this.isPendingLocalDeletePath(touchedPath))
      ) {
        return { deferred: true };
      }

      if (operationType === "upsert") {
        const snapshotEntry = remoteOperationToSnapshotEntry(operation);
        if (
          snapshotEntry &&
          typeof this.adoptRemoteBaselineIfSameChecksum === "function"
        ) {
          const sameChecksumBaseline = await this.adoptRemoteBaselineIfSameChecksum(
            path,
            snapshotEntry,
            baselineEntries
          );
          if (sameChecksumBaseline.matched) {
            this.markClassicMarkdownForCrdtBridge(path);
            report.pulledOperations += 1;
            return { deferred: false, applied: true };
          }
        }
      }

      if (operationType !== "mkdir" && operationType !== "metadata_update") {
        for (const touchedPath of touchedPaths) {
          if (
            typeof this.shouldDeferRemoteApplyForNoteLease === "function"
              ? await this.shouldDeferRemoteApplyForNoteLease(touchedPath, baselineEntries)
              : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" &&
                  this.shouldDeferRemoteApplyForActiveEditLease(touchedPath)
          ) {
            return { deferred: true };
          }
          if (
            typeof this.shouldDeferRemoteApplyForOpenConflict === "function" &&
            this.shouldDeferRemoteApplyForOpenConflict(touchedPath, report)
          ) {
            return { deferred: true };
          }
          if (await this.hasUnsyncedLocalChange(touchedPath, baselineEntries)) {
            return { deferred: true };
          }
        }
      }

      for (const touchedPath of touchedPaths) {
        this.markSuppressedPath(touchedPath);
      }
      for (const touchedPath of touchedPaths) {
        if (await this.hasUnsyncedLocalChange(touchedPath, baselineEntries)) {
          await this.captureConflictCopy(touchedPath);
        }
      }

      if (operationType === "mkdir") {
        await this.ensureDirectory(path);
      } else if (operationType === "upsert") {
        if (!contentHash) {
          throw new Error(this.t("error.remoteUpsertMissingHash"));
        }
        const binaryResponse = await this.downloadRemoteContentForSync(
          contentHash,
          "applyRemoteOperation upsert",
          path,
          report
        );
        if (!binaryResponse) {
          return { deferred: false, applied: false };
        }
        if (
          (typeof this.shouldDeferRemoteApplyForNoteLease === "function"
            ? await this.shouldDeferRemoteApplyForNoteLease(path, baselineEntries)
            : typeof this.shouldDeferRemoteApplyForActiveEditLease === "function" &&
                this.shouldDeferRemoteApplyForActiveEditLease(path)) ||
          (typeof this.shouldDeferRemoteApplyForOpenConflict === "function" &&
            this.shouldDeferRemoteApplyForOpenConflict(path, report)) ||
          (await this.hasUnsyncedLocalChange(path, baselineEntries))
        ) {
          return { deferred: true };
        }
        await this.writeBinaryFile(path, binaryResponse);
        this.markClassicMarkdownForCrdtBridge(path);
      } else if (operationType === "delete" || operationType === "rmdir") {
        if (await this.app.vault.adapter.exists(path)) {
          await this.captureConflictCopy(path);
        }
        await this.removePath(path);
        if (operationType === "delete") {
          this.clearPendingDeletePath(path);
          this.clearCrdtFileState(path);
        } else {
          this.clearCrdtFolderState(path);
        }
      } else if (operationType === "move") {
        const moveApplied = await this.applyRemoteMove(
          path,
          targetPath,
          contentHash,
          String(operation.entry_type),
          report
        );
        if (!moveApplied) {
          return { deferred: false, applied: false };
        }
      } else if (operationType === "metadata_update") {
        // Reserved for future metadata sync.
      } else {
        throw new Error(this.t("error.unsupportedRemoteOperation", { operationType }));
      }

      await this.refreshBaselineEntry(baselineEntries, path);
      this.addReportRemoteAppliedPath(report, path, baselineEntries[path] || null);
      if (targetPath) {
        await this.refreshBaselineEntry(baselineEntries, targetPath);
        this.addReportRemoteAppliedPath(report, targetPath, baselineEntries[targetPath] || null);
      }
      report.pulledOperations += 1;
      return { deferred: false, applied: true };
    } catch (error) {
      throw annotateError(
        error,
        `applyRemoteOperation ${operationType} ${path}${targetPath ? ` -> ${targetPath}` : ""}`
      );
    }
  }

  async applyRemoteMove(path, targetPath, contentHash, entryType, report = null) {
    if (!targetPath) {
      throw new Error(this.t("error.remoteMoveMissingTarget"));
    }

    const movedMarkdownLeaves = this.getOpenMarkdownLeavesForPath(path);
    const isDirectory = entryType === "directory";
    const sourceExists = await this.app.vault.adapter.exists(path);
    if (sourceExists) {
      if (await this.app.vault.adapter.exists(targetPath)) {
        await this.removePath(targetPath);
      }
      await this.ensureParentDirectories(targetPath);
      await this.renameVaultPath(path, targetPath);
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
      return true;
    }

    if (isDirectory) {
      if (await this.app.vault.adapter.exists(targetPath)) {
        await this.removePath(targetPath);
      }
      await this.ensureDirectory(targetPath);
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      return true;
    }

    if (await this.app.vault.adapter.exists(targetPath)) {
      this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
      await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
      return true;
    }
    if (!contentHash) {
      return false;
    }
    const binaryResponse = await this.downloadRemoteContentForSync(
      contentHash,
      "applyRemoteMove",
      targetPath,
      report
    );
    if (!binaryResponse) {
      return false;
    }
    await this.writeBinaryFile(targetPath, binaryResponse);
    this.updateActiveNoteLeasePathAfterRemoteMove(path, targetPath);
    await this.reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath);
    return true;
  }

  async recordGuardedOperation(sessionId, payload, report, options = {}) {
    const operationType = String(payload && payload.operation_type ? payload.operation_type : "")
      .trim()
      .toLowerCase();
    const entryType = String(payload && payload.entry_type ? payload.entry_type : "file")
      .trim()
      .toLowerCase();
    const normalizedPath = normalizePath(String(payload && payload.path ? payload.path : ""));
    const operationSource = normalizeOperationSource(options.operationSource || "sync_diff");
    const manualOverride = options.manualOverride === true;
    const guardedPayload = {
      ...payload,
      operation_source: operationSource,
      manual_override: manualOverride,
    };

    if (operationType === "delete" || operationType === "rmdir") {
      if (operationSource !== "sync_diff" && !manualOverride) {
        throw new Error(
          `Manual destructive operation requires manual_override for ${normalizedPath || "(empty path)"}`
        );
      }
      const allowedPaths = Array.isArray(options.allowedPaths)
        ? options.allowedPaths.map((path) => normalizePath(String(path || ""))).filter(Boolean)
        : [];
      if (
        allowedPaths.length > 0 &&
        !allowedPaths.some(
          (allowedPath) =>
            normalizedPath === allowedPath || normalizedPath.startsWith(`${allowedPath}/`)
        )
      ) {
        throw new Error(`Destructive operation path is outside the allowed scope: ${normalizedPath}`);
      }
      if (
        manualOverride &&
        operationType === "delete" &&
        entryType === "file" &&
        !String(payload.base_content_hash || "").trim()
      ) {
        throw new Error(`Manual file delete requires base_content_hash for ${normalizedPath}`);
      }
    }

    return this.recordOperation(sessionId, guardedPayload, report || this.createSyncReport());
  }

  async recordOperation(sessionId, payload, report) {
    try {
      await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/operations`,
        payload
      );
      report.pushedOperations += 1;
      return null;
    } catch (error) {
      if (isRecordOperationNoteLockError(error)) {
        const lockState = extractOperationNoteLock(error);
        report.deferredNoteLocks = Number(report.deferredNoteLocks || 0) + 1;
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(lockState.path || payload.path, {
          structural: payload.operation_type !== "upsert",
        });
        return lockState;
      }
      if (isRecordOperationConflictError(error, payload)) {
        const conflict = extractOperationConflict(error);
        if (await this.isAlreadyAppliedOperationConflict(payload, conflict)) {
          try {
            await this.resolveConflict(conflict, "keep_local");
            report.pushedOperations += 1;
            return null;
          } catch (resolveError) {
            console.warn(
              "[obsidian-http-sync] failed to auto-resolve already applied operation conflict",
              resolveError
            );
          }
        }
        report.conflicts += 1;
        this.addReportConflictPath(report, payload.path);
        this.addReportConflictPath(report, payload.target_path);
        this.addReportConflictPath(report, conflict.path);
        this.addReportConflictPath(report, conflict.target_path);
        return conflict;
      }
      if (
        payload.operation_type === "mkdir" &&
        (isAlreadyExistsError(error) || (await this.remoteDirectoryExists(payload.path)))
      ) {
        return;
      }
      if (payload.operation_type === "rmdir" && isAlreadyMissingDirectoryError(error)) {
        return;
      }
      throw annotateError(
        error,
        `recordOperation ${payload.operation_type} ${payload.entry_type} ${payload.path}${
          payload.target_path ? ` -> ${payload.target_path}` : ""
        }`
      );
    }
  }

  async isAlreadyAppliedOperationConflict(payload, conflict) {
    if (!isAlreadyAppliedOperationConflictCandidate(payload, conflict)) {
      return false;
    }
    const operationType = String(payload && payload.operation_type ? payload.operation_type : "");
    if (operationType !== "delete") {
      return true;
    }
    try {
      return !(await this.getRemoteFileEntry(payload.path));
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] failed to verify already applied delete conflict",
        error
      );
      return false;
    }
  }

  async buildDeleteConflictRetryPayload(payload, conflict) {
    if (
      !conflict ||
      String(payload && payload.operation_type ? payload.operation_type : "") !== "delete" ||
      String(conflict.reason || "") !== "base_content_hash_mismatch"
    ) {
      return null;
    }
    const actualContentHash = String(conflict.actual_content_hash || "").trim();
    if (!actualContentHash) {
      return null;
    }
    if (actualContentHash === String(payload.base_content_hash || "").trim()) {
      return null;
    }
    const remoteEntry = await this.getRemoteFileEntry(payload.path);
    if (!remoteEntry) {
      return null;
    }
    return {
      ...payload,
      client_operation_id: generateClientOperationId(),
      base_content_hash: actualContentHash,
      storage_delta_bytes: -Number(remoteEntry.current_size_bytes || 0),
    };
  }

  async getRemoteFileEntry(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    const entry = await this.fetchRemoteFileEntry(normalizedPath);
    if (
      !entry ||
      entry.is_deleted ||
      String(entry.entry_type || "") !== "file"
    ) {
      return null;
    }
    return entry;
  }

  async disableCrdtMarkdownIfCollaborationBlocked() {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    if (!this.settings.accessToken) {
      if (!this.settings.refreshToken) {
        return false;
      }
      const baseUrl = String(this.settings.baseUrl || "").replace(/\/+$/, "");
      const refreshed = await this.tryRefreshAuthSession(baseUrl);
      if (!refreshed || !this.settings.accessToken) {
        return false;
      }
    }

    if (!this.settings.accessToken) {
      return false;
    }

    let accountStatus = null;
    try {
      let userId = String(this.settings.userId || "").trim();
      if (!userId) {
        const authPayload = await this.requestJson("GET", "/auth/me");
        userId =
          authPayload && authPayload.user && authPayload.user.id
            ? String(authPayload.user.id).trim()
            : "";
      }
      if (!userId) {
        return false;
      }
      const payload = await this.requestJson(
        "GET",
        `/users/${encodeURIComponent(userId)}/account-status`
      );
      accountStatus =
        payload && payload.account_status && typeof payload.account_status === "object"
          ? payload.account_status
          : null;
    } catch (_) {
      return false;
    }
    if (!accountStatus || accountStatus.collaboration_blocked !== true) {
      return false;
    }

    this.settings.crdtMarkdownEnabled = false;
    this.settings.collaborationBlockReason =
      getCollaborationBlockReasonFromAccountStatus(accountStatus);
    this.resetCrdtLocalState();
    await this.saveSettings();
    new Notice(
      this.t("notice.crdtMarkdownBlocked", {
        reason: this.t(
          `collaborationBlock.reason.${this.settings.collaborationBlockReason}`
        ),
      })
    );
    return true;
  }

  async remoteDirectoryExists(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    try {
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=1000`
      );
      const files = Array.isArray(payload.files) ? payload.files : [];
      return files.some(
        (file) =>
          normalizePath(String(file.path || "")) === normalizedPath &&
          String(file.entry_type || "") === "directory" &&
          !file.is_deleted
      );
    } catch (error) {
      return false;
    }
  }

  resetCrdtLocalState() {
    this.settings.crdtState = { files: {} };
    this.crdtDocs.clear();
    this.crdtLeases.clear();
    this.crdtLeaseNoticeTimestamps.clear();
  }

  clearCrdtFileState(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    this.crdtDocs.delete(normalizedPath);
    this.crdtLeases.delete(normalizedPath);
    this.crdtLeaseNoticeTimestamps.delete(normalizedPath);
    if (this.settings.crdtState && this.settings.crdtState.files) {
      delete this.settings.crdtState.files[normalizedPath];
    }
  }

  markClassicMarkdownForCrdtBridge(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldUseCrdtForPath(normalizedPath)) {
      return false;
    }
    this.clearCrdtFileState(normalizedPath);
    this.setCrdtDirty(normalizedPath, true);
    this.markLocalDirtyPath(normalizedPath);
    this.pendingChangesDuringSync = true;
    return true;
  }

  clearCrdtFolderState(folderPath) {
    const normalizedFolderPath = normalizePath(String(folderPath || ""));
    if (!normalizedFolderPath) {
      return;
    }
    const prefix = normalizedFolderPath + "/";
    for (const docPath of this.crdtDocs.keys()) {
      if (docPath === normalizedFolderPath || docPath.startsWith(prefix)) {
        this.crdtDocs.delete(docPath);
      }
    }
    for (const leasePath of this.crdtLeases.keys()) {
      if (leasePath === normalizedFolderPath || leasePath.startsWith(prefix)) {
        this.crdtLeases.delete(leasePath);
      }
    }
    for (const noticePath of this.crdtLeaseNoticeTimestamps.keys()) {
      if (noticePath === normalizedFolderPath || noticePath.startsWith(prefix)) {
        this.crdtLeaseNoticeTimestamps.delete(noticePath);
      }
    }
    if (this.settings.crdtState && this.settings.crdtState.files) {
      for (const statePath of Object.keys(this.settings.crdtState.files)) {
        if (statePath === normalizedFolderPath || statePath.startsWith(prefix)) {
          delete this.settings.crdtState.files[statePath];
        }
      }
    }
  }

  enqueueCrdtLocalChange(path) {
    if (!this.isConfigured() || !this.shouldUseCrdtForPath(path)) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    this.setCrdtDirty(normalizedPath, true);
    if (this.crdtLocalDebounce.has(normalizedPath)) {
      window.clearTimeout(this.crdtLocalDebounce.get(normalizedPath));
    }
    const timeoutHandle = window.setTimeout(() => {
      this.crdtLocalDebounce.delete(normalizedPath);
      this.syncCrdtFile(normalizedPath, null, { mode: "push" }).catch((error) => {
        console.error("[obsidian-http-sync] CRDT local push failed", error);
      });
    }, CRDT_LOCAL_DEBOUNCE_MS);
    this.crdtLocalDebounce.set(normalizedPath, timeoutHandle);
  }

  async pollActiveCrdtFile() {
    const activeFile =
      this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
        ? this.app.workspace.getActiveFile()
        : null;
    await this.pollActiveNoteLease(activeFile);
    if (!this.isConfigured() || !this.settings.crdtMarkdownEnabled) {
      return;
    }
    if (!activeFile || !activeFile.path || !this.shouldUseCrdtForPath(activeFile.path)) {
      return;
    }
    if (this.isCrdtDirty(activeFile.path)) {
      return;
    }
    await this.syncCrdtFile(activeFile.path, null, { mode: "pull" });
  }

  async syncCrdtMarkdownFiles(report, options = {}) {
    if (!this.isConfigured() || !this.settings.crdtMarkdownEnabled) {
      return;
    }
    const markdownFiles = Array.isArray(options.paths)
      ? Array.from(
          new Set(
            options.paths
              .map((path) => normalizePath(String(path || "")))
              .filter(
                (path) =>
                  path &&
                  this.shouldUseCrdtForPath(path) &&
                  !this.isPendingLocalDeletePath(path) &&
                  !this.isPendingRenameSourcePath(path) &&
                  !this.isPendingRenameTargetPath(path)
              )
          )
        ).sort()
      : await this.listCrdtMarkdownFiles("");
    for (const path of markdownFiles) {
      this.trackSyncFile?.(path);
    }
    const remoteEntriesByPath = new Map(
      (Array.isArray(options.remoteEntries)
        ? options.remoteEntries
        : await this.fetchRemoteFileIndex()
      )
        .filter((entry) => entry && entry.path && !entry.is_deleted)
        .map((entry) => [normalizePath(String(entry.path)), entry])
    );
    for (const path of markdownFiles) {
      await this.syncCrdtFile(path, report, {
        mode: this.isCrdtDirty(path) ? "push" : "pull",
        remoteEntry: remoteEntriesByPath.get(path) || null,
      });
      this.completeSyncFile?.(path);
    }
  }

  async listCrdtMarkdownFiles(directoryPath) {
    const listing = await this.app.vault.adapter.list(directoryPath);
    const paths = [];
    for (const folderPath of listing.folders.slice().sort()) {
      const normalizedPath = normalizePath(folderPath);
      if (
        this.isPathIgnoredByPattern(normalizedPath) ||
        isConflictArtifactPath(normalizedPath)
      ) {
        continue;
      }
      if (!this.isPathInSyncScope(normalizedPath) && !this.isPathAncestorOfSyncScope(normalizedPath)) {
        continue;
      }
      paths.push(...(await this.listCrdtMarkdownFiles(normalizedPath)));
    }
    for (const filePath of listing.files.slice().sort()) {
      const normalizedPath = normalizePath(filePath);
      if (this.shouldUseCrdtForPath(normalizedPath)) {
        paths.push(normalizedPath);
      }
    }
    return paths;
  }

  async syncCrdtFile(path, report, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    return this.runExclusiveCrdtSync(normalizedPath, async () => {
      if (
        !this.shouldUseCrdtForPath(normalizedPath) ||
        this.isPendingLocalDeletePath(normalizedPath) ||
        this.isPendingRenameSourcePath(normalizedPath) ||
        this.isPendingRenameTargetPath(normalizedPath)
      ) {
        return;
      }
      const remoteEntryWasProvided = Object.prototype.hasOwnProperty.call(
        options,
        "remoteEntry"
      );
      let remoteEntry = remoteEntryWasProvided
        ? options.remoteEntry
        : await this.fetchRemoteFileEntry(normalizedPath);
      let mode = options.mode === "push" ? "push" : "pull";
      if (mode !== "push" && !remoteEntry && remoteEntryWasProvided) {
        remoteEntry = await this.fetchRemoteFileEntry(normalizedPath);
      }
      if (mode !== "push" && remoteEntry && remoteEntry.is_deleted) {
        await this.discardDeletedRemoteCrdtFile(normalizedPath);
        return;
      }
      if (mode !== "push" && !remoteEntry) {
        if (await this.app.vault.adapter.exists(normalizedPath)) {
          // No file history means this is a new local note, not a remote
          // deletion. Promote the poll to a push so it cannot erase the note
          // while the asynchronous create handler is still acquiring a lock.
          this.setCrdtDirty(normalizedPath, true);
          mode = "push";
        } else {
          await this.discardDeletedRemoteCrdtFile(normalizedPath);
          return;
        }
      }
      if (!(await this.ensureCrdtProtocolSupported())) {
        return;
      }
      if (mode === "push" && this.shouldUseCrdtLeases() && !options.leaseChecked) {
        if (this.isActiveCrdtPath(normalizedPath)) {
          const lease = await this.ensureActiveCrdtLease(normalizedPath);
          if (lease && lease.heldByOtherDevice) {
            this.showCrdtLeasePausedNotice(normalizedPath);
            return;
          }
        } else if (await this.isCrdtLeaseHeldByOther(normalizedPath)) {
          return;
        }
      }
      if (mode === "pull") {
        await this.pullCrdtRemoteUpdates(normalizedPath, report, {
          skipWriteWhenDirty: true,
        });
        return;
      }
      const pushed = await this.pushCrdtLocalFile(normalizedPath, report);
      if (pushed) {
        const state = await this.ensureCrdtDoc(normalizedPath);
        await this.publishCrdtSnapshot(normalizedPath, state);
      }
    });
  }

  async runExclusiveCrdtSync(path, callback) {
    const normalizedPath = normalizePath(String(path || ""));
    const previousQueue = this.crdtSyncQueues.get(normalizedPath) || Promise.resolve();
    let releaseQueue = null;
    const nextQueue = new Promise((resolve) => {
      releaseQueue = resolve;
    });
    const queueMarker = previousQueue.then(() => nextQueue);
    this.crdtSyncQueues.set(normalizedPath, queueMarker);
    await previousQueue;
    try {
      return await callback();
    } finally {
      releaseQueue();
      if (this.crdtSyncQueues.get(normalizedPath) === queueMarker) {
        this.crdtSyncQueues.delete(normalizedPath);
      }
    }
  }

  async discardDeletedRemoteCrdtFile(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    this.clearCrdtFileState(normalizedPath);
    if (
      this.settings &&
      this.settings.state &&
      this.settings.state.entries &&
      this.settings.state.entries[normalizedPath]
    ) {
      delete this.settings.state.entries[normalizedPath];
    }
    if (await this.app.vault.adapter.exists(normalizedPath)) {
      this.markSuppressedPath(normalizedPath);
      await this.captureConflictCopy(normalizedPath);
      await this.removePath(normalizedPath);
    }
  }

  markPendingExplicitDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    for (const existingPath of Array.from(this.pendingExplicitDeletes)) {
      if (
        existingPath === normalizedPath ||
        existingPath.startsWith(`${normalizedPath}/`)
      ) {
        this.pendingExplicitDeletes.delete(existingPath);
      }
      if (
        normalizedPath.startsWith(`${existingPath}/`) ||
        normalizedPath === existingPath
      ) {
        return;
      }
    }
    this.pendingExplicitDeletes.add(normalizedPath);
  }

  clearPendingExplicitDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return;
    }
    for (const existingPath of Array.from(this.pendingExplicitDeletes)) {
      if (
        existingPath === normalizedPath ||
        existingPath.startsWith(`${normalizedPath}/`)
      ) {
        this.pendingExplicitDeletes.delete(existingPath);
      }
    }
  }

  hasPendingExplicitDeleteAncestor(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    return Array.from(this.pendingExplicitDeletes).some(
      (pendingPath) =>
        pendingPath === normalizedPath || normalizedPath.startsWith(`${pendingPath}/`)
    );
  }

  isPendingLocalDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    if (this.hasPendingExplicitDeleteAncestor(normalizedPath)) {
      return true;
    }
    const pendingDeletes =
      this.settings && this.settings.pendingDeletes &&
      typeof this.settings.pendingDeletes === "object"
        ? this.settings.pendingDeletes
        : {};
    return Object.keys(pendingDeletes).some((pendingPath) => {
      const normalizedPendingPath = normalizePath(String(pendingPath || ""));
      return (
        normalizedPendingPath &&
        (normalizedPath === normalizedPendingPath ||
          normalizedPath.startsWith(`${normalizedPendingPath}/`))
      );
    });
  }

  filterRenameHintsTargetingPendingDeletes(renameHints) {
    const filteredHints = {};
    for (const [targetPath, sourcePath] of Object.entries(renameHints || {})) {
      const normalizedTargetPath = normalizePath(String(targetPath || ""));
      if (
        normalizedTargetPath &&
        typeof this.isPendingLocalDeletePath === "function" &&
        this.isPendingLocalDeletePath(normalizedTargetPath)
      ) {
        continue;
      }
      filteredHints[targetPath] = sourcePath;
    }
    return filteredHints;
  }

  applyPendingExplicitDeletes(previousEntries, currentSnapshot, remoteEntries) {
    const hasRuntimeDeletes =
      this.pendingExplicitDeletes && this.pendingExplicitDeletes.size > 0;
    const hasPersistedDeletes = Boolean(
      this.settings &&
        this.settings.pendingDeletes &&
        typeof this.settings.pendingDeletes === "object" &&
        Object.keys(this.settings.pendingDeletes).length > 0
    );
    if (!hasRuntimeDeletes && !hasPersistedDeletes) {
      return;
    }
    for (const remoteEntry of remoteEntries || []) {
      const remotePath = normalizePath(String(remoteEntry.path || ""));
      if (!remotePath || remoteEntry.is_deleted || !this.shouldApplyRemotePath(remotePath)) {
        continue;
      }
      const matchesPendingDelete =
        typeof this.isPendingLocalDeletePath === "function"
          ? this.isPendingLocalDeletePath(remotePath)
          : Array.from(this.pendingExplicitDeletes || []).some(
              (pendingPath) =>
                remotePath === pendingPath ||
                remotePath.startsWith(`${pendingPath}/`)
            );
      if (!matchesPendingDelete) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry(remoteEntry);
      if (snapshotEntry) {
        previousEntries[remotePath] = snapshotEntry;
      }
    }
  }

  applyImplicitDirectoryDeletes(previousEntries, currentSnapshot, remoteEntries) {
    if (!Object.keys(previousEntries || {}).length) {
      return;
    }
    const remoteDirectoryRoots = (remoteEntries || [])
      .filter(
        (entry) =>
          entry &&
          !entry.is_deleted &&
          String(entry.entry_type || "") === "directory" &&
          this.shouldApplyRemotePath(entry.path)
      )
      .map((entry) => normalizePath(String(entry.path || "")))
      .filter(Boolean)
      .sort((left, right) => pathDepth(left) - pathDepth(right));

    for (const rootPath of remoteDirectoryRoots) {
      if (previousEntries[rootPath] || currentSnapshot[rootPath]) {
        continue;
      }
      const snapshotEntry = this.remoteFileEntryToSnapshotEntry({
        path: rootPath,
        entry_type: "directory",
      });
      if (snapshotEntry) {
        previousEntries[rootPath] = snapshotEntry;
      }
      for (const remoteEntry of remoteEntries || []) {
        const remotePath = normalizePath(String(remoteEntry.path || ""));
        if (
          !remotePath ||
          remoteEntry.is_deleted ||
          !this.shouldApplyRemotePath(remotePath) ||
          currentSnapshot[remotePath] ||
          previousEntries[remotePath]
        ) {
          continue;
        }
        if (remotePath === rootPath || remotePath.startsWith(`${rootPath}/`)) {
          const descendantSnapshot = this.remoteFileEntryToSnapshotEntry(remoteEntry);
          if (descendantSnapshot) {
            previousEntries[remotePath] = descendantSnapshot;
          }
        }
      }
    }
  }

  async clearCompletedPendingExplicitDeletes() {
    for (const pendingPath of Array.from(this.pendingExplicitDeletes)) {
      if (!(await this.app.vault.adapter.exists(pendingPath))) {
        this.pendingExplicitDeletes.delete(pendingPath);
      }
    }
  }

  clearPendingDeletesForCurrentSnapshot(currentSnapshot, previousEntries = {}) {
    if (!this.settings.pendingDeletes || typeof this.settings.pendingDeletes !== "object") {
      this.settings.pendingDeletes = {};
      return;
    }
    for (const path of Object.keys(this.settings.pendingDeletes)) {
      const currentEntry = currentSnapshot && currentSnapshot[path];
      const previousEntry = previousEntries && previousEntries[path];
      if (
        currentEntry &&
        previousEntry &&
        sameSyncIdentity(previousEntry, currentEntry)
      ) {
        delete this.settings.pendingDeletes[path];
      }
    }
  }

  clearPendingDeletePath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.settings.pendingDeletes) {
      return;
    }
    delete this.settings.pendingDeletes[normalizedPath];
    this.queueReleaseLocalDiffNoteLock?.(normalizedPath);
  }

  clearPendingRenameHintForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const pathMatches = (candidatePath) => {
      const normalizedCandidatePath = normalizePath(String(candidatePath || ""));
      return (
        normalizedCandidatePath &&
        (normalizedCandidatePath === normalizedPath ||
          normalizedCandidatePath.startsWith(`${normalizedPath}/`) ||
          normalizedPath.startsWith(`${normalizedCandidatePath}/`))
      );
    };
    let changed = false;
    for (const [targetPath, sourcePath] of Object.entries(this.renameHints || {})) {
      if (pathMatches(targetPath) || pathMatches(sourcePath)) {
        delete this.renameHints[targetPath];
        changed = true;
      }
    }
    if (
      this.settings &&
      this.settings.pendingRenameHints &&
      typeof this.settings.pendingRenameHints === "object"
    ) {
      for (const [targetPath, sourcePath] of Object.entries(
        this.settings.pendingRenameHints
      )) {
        if (pathMatches(targetPath) || pathMatches(sourcePath)) {
          delete this.settings.pendingRenameHints[targetPath];
          changed = true;
        }
      }
    }
    return changed;
  }

  deleteBatchBlockReason(plannedDeleteCount, baselineEntryCount, report) {
    if (report && report.divergenceWarning) {
      return "vault_snapshot_fingerprint_mismatch";
    }
    if (plannedDeleteCount > DELETE_QUARANTINE_MAX_BATCH_COUNT) {
      return "mass_delete_count";
    }
    if (
      baselineEntryCount > 0 &&
      plannedDeleteCount / baselineEntryCount > DELETE_QUARANTINE_MAX_BATCH_RATIO
    ) {
      return "mass_delete_ratio";
    }
    return "";
  }

  shouldSendDeleteOperation(path, previousEntry, currentSnapshot, report, blockReason) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !previousEntry || currentSnapshot[normalizedPath]) {
      this.clearPendingDeletePath(normalizedPath);
      return false;
    }
    if (!this.settings.pendingDeletes || typeof this.settings.pendingDeletes !== "object") {
      this.settings.pendingDeletes = {};
    }
    const nowMs = Date.now();
    const previousIdentity = {
      entryType: previousEntry.entryType || "",
      contentHash: previousEntry.contentHash || null,
      sizeBytes: Number(previousEntry.sizeBytes || 0),
    };
    const existing = this.settings.pendingDeletes[normalizedPath] || null;
    const identityMatches =
      existing &&
      existing.entryType === previousIdentity.entryType &&
      (existing.contentHash || null) === previousIdentity.contentHash &&
      Number(existing.sizeBytes || 0) === previousIdentity.sizeBytes;
    const candidate = identityMatches
      ? {
          ...existing,
          lastSeenAt: nowMs,
        }
      : {
          ...previousIdentity,
          firstSeenAt: nowMs,
          lastSeenAt: nowMs,
        };
    this.settings.pendingDeletes[normalizedPath] = candidate;
    const mature =
      nowMs - Number(candidate.firstSeenAt || nowMs) >= DELETE_QUARANTINE_GRACE_MS;
    if (!mature || blockReason) {
      report.deferredDeletes = Number(report.deferredDeletes || 0) + 1;
      if (blockReason && !report.divergenceWarning) {
        report.divergenceWarning = `delete_safety_${blockReason}`;
      }
      if (!blockReason) {
        this.pendingChangesDuringSync = true;
      }
      return false;
    }
    return true;
  }

  shouldUseCrdtLeases() {
    return Boolean(this.settings && this.settings.crdtEditLeaseEnabled);
  }

  beginSyncProgress(onProgress, initialFilePaths = [], allowedFilePaths = null) {
    const allowedFiles = Array.isArray(allowedFilePaths)
      ? new Set(
          allowedFilePaths
            .map((path) => normalizePath(String(path || "")))
            .filter(Boolean)
        )
      : null;
    this.syncProgress = {
      trackedFiles: new Set(
        initialFilePaths
          .map((path) => normalizePath(String(path || "")))
          .filter((path) => Boolean(path) && (!allowedFiles || allowedFiles.has(path)))
      ),
      completedFiles: new Set(),
      allowedFiles,
      onProgress: typeof onProgress === "function" ? onProgress : null,
    };
    this.emitSyncProgress();
  }

  trackSyncFile(path) {
    if (!this.syncProgress) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (
      !normalizedPath ||
      (this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath)) ||
      this.syncProgress.trackedFiles.has(normalizedPath)
    ) {
      return;
    }
    this.syncProgress.trackedFiles.add(normalizedPath);
    this.emitSyncProgress();
  }

  completeSyncFile(path) {
    if (!this.syncProgress) {
      return;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (
      !normalizedPath ||
      (this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath)) ||
      this.syncProgress.completedFiles.has(normalizedPath)
    ) {
      return;
    }
    this.syncProgress.trackedFiles.add(normalizedPath);
    this.syncProgress.completedFiles.add(normalizedPath);
    this.emitSyncProgress();
  }

  completeSyncFiles(paths) {
    if (!this.syncProgress) {
      return;
    }
    let changed = false;
    for (const path of paths || []) {
      const normalizedPath = normalizePath(String(path || ""));
      if (
        !normalizedPath ||
        (this.syncProgress.allowedFiles && !this.syncProgress.allowedFiles.has(normalizedPath))
      ) {
        continue;
      }
      if (!this.syncProgress.trackedFiles.has(normalizedPath)) {
        this.syncProgress.trackedFiles.add(normalizedPath);
        changed = true;
      }
      if (!this.syncProgress.completedFiles.has(normalizedPath)) {
        this.syncProgress.completedFiles.add(normalizedPath);
        changed = true;
      }
    }
    if (changed) {
      this.emitSyncProgress();
    }
  }

  getSyncProgressSnapshot() {
    if (!this.syncProgress) {
      return this.lastSyncProgress
        ? { ...this.lastSyncProgress }
        : { completedFiles: 0, totalFiles: 0 };
    }
    return {
      completedFiles: this.syncProgress.completedFiles.size,
      totalFiles: this.syncProgress.trackedFiles.size,
    };
  }

  emitSyncProgress() {
    const progress = this.getSyncProgressSnapshot();
    if (this.syncProgress && progress.totalFiles > 0) {
      this.lastSyncProgress = { ...progress };
    }
    this.updateSyncStatusBarItem();
    if (!progress || !this.syncProgress.onProgress) {
      return;
    }
    try {
      this.syncProgress.onProgress(progress);
    } catch (error) {
      console.warn("[obsidian-http-sync] sync progress callback failed", error);
    }
  }

  updateSyncStatusBarItem() {
    if (!this.syncStatusBarItemEl) {
      return;
    }
    const brandLabel = this.t("statusBar.brand");
    const lampState = this.getSyncStatusLampState();
    const syncModeLabel = this.settings.autoSync
      ? this.t("statusBar.syncModeAuto")
      : this.t("statusBar.syncModeManual");
    const syncModeIcon = this.settings.autoSync
      ? "refresh-cw"
      : "mouse-pointer-click";
    const syncProgress = this.syncProgress ? this.getSyncProgressSnapshot() : null;
    const syncProgressLabel = syncProgress
      ? this.t("statusBar.syncProgress", {
          completed: syncProgress.completedFiles,
          total: syncProgress.totalFiles,
        })
      : "";
    const noteStatus = this.getNoteLeaseStatusBarSegment();
    const label = `${brandLabel} | ${lampState.tooltip} | ${syncModeLabel}${
      syncProgressLabel ? ` | ${syncProgressLabel}` : ""
    }${noteStatus.aria}`;
    if (typeof this.syncStatusBarItemEl.replaceChildren === "function") {
      this.syncStatusBarItemEl.replaceChildren();
    } else {
      this.syncStatusBarItemEl.textContent = "";
    }
    this.syncStatusBarItemEl.classList.add("arcalink-status-bar-item");
    this.syncStatusBarItemEl.style.display = "inline-flex";
    this.syncStatusBarItemEl.style.alignItems = "center";
    this.syncStatusBarItemEl.style.gap = "6px";
    this.syncStatusBarItemEl.style.whiteSpace = "nowrap";
    this.syncStatusBarItemEl.setAttribute("aria-label", label);
    this.syncStatusBarItemEl.setAttribute("title", label);

    const documentRef =
      this.syncStatusBarItemEl.ownerDocument ||
      (typeof document !== "undefined" ? document : null);
    if (!documentRef) {
      this.syncStatusBarItemEl.textContent = brandLabel;
      return;
    }
    const brandEl = documentRef.createElement("span");
    brandEl.className = "arcalink-status-bar-brand";
    brandEl.textContent = brandLabel;
    const openSettingsLabel = this.t("statusBar.openSettings");
    brandEl.setAttribute("role", "button");
    brandEl.setAttribute("tabindex", "0");
    brandEl.setAttribute("aria-label", openSettingsLabel);
    brandEl.setAttribute("title", openSettingsLabel);
    brandEl.style.cursor = "pointer";
    brandEl.addEventListener("click", () => this.openPluginSettings());
    brandEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      this.openPluginSettings();
    });
    this.syncStatusBarItemEl.appendChild(brandEl);

    const lampEl = documentRef.createElement("span");
    lampEl.className = `arcalink-status-bar-lamp arcalink-status-bar-lamp-${lampState.color}`;
    lampEl.setAttribute("role", "img");
    lampEl.setAttribute("aria-label", lampState.tooltip);
    lampEl.setAttribute("title", lampState.tooltip);
    lampEl.style.display = "inline-block";
    lampEl.style.width = "9px";
    lampEl.style.height = "9px";
    lampEl.style.borderRadius = "999px";
    lampEl.style.backgroundColor = STATUS_LAMP_COLORS[lampState.color];
    lampEl.style.boxShadow = `0 0 0 2px rgba(255, 255, 255, 0.18), 0 0 8px ${STATUS_LAMP_COLORS[lampState.color]}`;
    this.syncStatusBarItemEl.appendChild(lampEl);

    const modeEl = documentRef.createElement("span");
    modeEl.className = "arcalink-status-bar-sync-mode";
    modeEl.setAttribute("role", "img");
    modeEl.setAttribute("aria-label", syncModeLabel);
    modeEl.setAttribute("title", syncModeLabel);
    modeEl.style.display = "inline-flex";
    modeEl.style.alignItems = "center";
    modeEl.style.justifyContent = "center";
    modeEl.style.width = "14px";
    modeEl.style.height = "14px";
    if (typeof setIcon === "function") {
      setIcon(modeEl, syncModeIcon);
    } else {
      modeEl.textContent = this.settings.autoSync ? "↻" : "↥";
    }
    this.syncStatusBarItemEl.appendChild(modeEl);

    if (syncProgressLabel) {
      const progressEl = documentRef.createElement("span");
      progressEl.className = "arcalink-status-bar-progress";
      progressEl.textContent = `${syncProgress.completedFiles}/${syncProgress.totalFiles}`;
      progressEl.setAttribute("aria-label", syncProgressLabel);
      progressEl.setAttribute("title", syncProgressLabel);
      this.syncStatusBarItemEl.appendChild(progressEl);
    }

    if (noteStatus.text) {
      const noteEl = documentRef.createElement("span");
      noteEl.className = "arcalink-status-bar-note";
      noteEl.textContent = noteStatus.text.replace(/^\s*\|\s*/, "");
      noteEl.style.opacity = "0.82";
      this.syncStatusBarItemEl.appendChild(noteEl);
    }
  }

  openPluginSettings() {
    const setting = this.app && this.app.setting;
    if (!setting) {
      return;
    }
    if (typeof setting.open === "function") {
      setting.open();
    }
    if (typeof setting.openTabById === "function") {
      setting.openTabById(
        this.manifest && this.manifest.id ? this.manifest.id : PLUGIN_ID
      );
    }
  }

  getSyncStatusLampState() {
    const serverProblemTooltip = this.getStatusLampServerProblemTooltip();
    if (serverProblemTooltip) {
      return {
        color: "red",
        tooltip: serverProblemTooltip,
      };
    }
    if (this.settings.lastError) {
      return {
        color: "red",
        tooltip: this.t("statusBar.lampSyncError"),
      };
    }
    const conflictCount = this.getCachedOpenConflicts().length;
    if (conflictCount > 0) {
      return {
        color: "yellow",
        tooltip: this.t("statusBar.lampConflictCount", { count: conflictCount }),
      };
    }
    if (this.settings.lastSyncWarning === "sync_conflicts_open") {
      return {
        color: "yellow",
        tooltip: this.t("statusBar.lampConflict"),
      };
    }
    return {
      color: "green",
      tooltip: this.t("statusBar.lampOk"),
    };
  }

  getStatusLampServerProblemTooltip() {
    if (!this.isConfigured()) {
      return this.t("statusBar.lampNoConnection");
    }
    const authState = this.settings.authState || DEFAULT_AUTH_STATE;
    const syncBlockReason = String(this.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE);
    if (
      syncBlockReason === SYNC_BLOCK_REASON.BILLING_BLOCKED ||
      authState.status === AUTH_STATUS.BILLING_BLOCKED
    ) {
      return this.t("statusBar.lampBlocked");
    }
    if (syncBlockReason && syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      return this.t("statusBar.lampNoConnection");
    }
    if (authState.status !== AUTH_STATUS.AUTHENTICATED) {
      return this.t("statusBar.lampNoConnection");
    }
    return "";
  }

  getNoteLeaseStatusBarSegment() {
    const lease = this.activeNoteLease;
    if (!lease || !lease.path) {
      return { text: "", aria: "" };
    }
    const holders = this.getOtherNoteLeaseHolders(lease);
    const holderSummary = this.formatNoteLeaseHolderSummary(holders);
    const holderCount = holders.length;
    const isReadonly = Boolean(lease.path && this.isNoteLeaseReadOnly(lease.path));
    if (!isReadonly && holderCount === 0) {
      return { text: "", aria: "" };
    }

    let text = "";
    if (isReadonly) {
      text = ` | ${this.t("statusBar.noteReadonlyShort")}`;
    } else if (holderCount > 0) {
      text = ` | ${this.t("statusBar.notePresenceShort", { count: holderCount })}`;
    }

    const detailKey = isReadonly ? "statusBar.noteReadonly" : "statusBar.notePresence";
    const detail = this.t(detailKey, {
      path: lease.path,
      holders: holderSummary || this.t("statusBar.noteUnknownHolders"),
    });
    return { text, aria: ` | ${detail}` };
  }

  getServerConnectionStatusLabel() {
    const authState = this.settings.authState || DEFAULT_AUTH_STATE;
    const syncBlockReason = String(this.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE);
    if (!this.isConfigured()) {
      return this.t("statusBar.serverNotConfigured");
    }
    if (authState.status === AUTH_STATUS.UNKNOWN) {
      return this.t("statusBar.serverChecking");
    }
    if (authState.status === AUTH_STATUS.MISSING_TOKEN) {
      return this.t("statusBar.serverNotConnected");
    }
    if (syncBlockReason && syncBlockReason !== SYNC_BLOCK_REASON.NONE) {
      if (syncBlockReason === SYNC_BLOCK_REASON.BILLING_BLOCKED) {
        return this.t("statusBar.serverBlocked");
      }
      if (
        syncBlockReason === SYNC_BLOCK_REASON.NETWORK_ERROR ||
        syncBlockReason === SYNC_BLOCK_REASON.SERVER_ERROR ||
        syncBlockReason === SYNC_BLOCK_REASON.REFRESH_FAILED ||
        syncBlockReason === SYNC_BLOCK_REASON.SESSION_EXPIRED ||
        syncBlockReason === SYNC_BLOCK_REASON.SESSION_REVOKED
      ) {
        return this.t("statusBar.serverError");
      }
      return this.t("statusBar.serverBlocked");
    }
    if (authState.status === AUTH_STATUS.AUTHENTICATED) {
      return this.t("statusBar.serverConnected");
    }
    return this.t("statusBar.serverError");
  }

  getSyncProgressStatusLabel() {
    if (!this.isConfigured()) {
      return this.t("statusBar.syncNotConfigured");
    }
    if (this.syncInFlight) {
      return this.t("statusBar.syncing");
    }
    if (this.settings.lastError) {
      return this.t("statusBar.syncError");
    }
    if (this.pendingChangesDuringSync) {
      return this.t("statusBar.syncQueued");
    }
    return this.t("statusBar.syncIdle");
  }

  removeActiveNoteTakeoverButton() {
    if (this.activeNoteTakeoverButtonEl && this.activeNoteTakeoverButtonEl.isConnected) {
      this.activeNoteTakeoverButtonEl.remove();
    }
    this.activeNoteTakeoverButtonEl = null;
    this.activeNoteTakeoverButtonPath = "";
    this.activeNoteTakeoverButtonHostEl = null;
  }

  updateActiveNoteTakeoverButton() {
    const state = this.activeNoteLease;
    const path =
      state && state.path && this.shouldTrackNoteLeaseForPath(state.path)
        ? normalizePath(String(state.path))
        : "";
    if (!path || !this.isNoteLeaseReadOnly(path)) {
      this.removeActiveNoteTakeoverButton();
      return;
    }

    const openView = this.getOpenEditorView(path);
    const hostEl =
      openView && openView.containerEl
        ? openView.containerEl.querySelector(".view-actions") ||
          openView.containerEl.querySelector(".view-header")
        : null;
    if (!openView || !hostEl) {
      this.removeActiveNoteTakeoverButton();
      return;
    }

    if (
      this.activeNoteTakeoverButtonEl &&
      this.activeNoteTakeoverButtonEl.isConnected &&
      this.activeNoteTakeoverButtonPath === path &&
      this.activeNoteTakeoverButtonHostEl === hostEl
    ) {
      this.activeNoteTakeoverButtonEl.disabled = this.noteLeaseSupport === false;
      return;
    }

    this.removeActiveNoteTakeoverButton();
    const button = hostEl.createEl("button", {
      text: this.t("button.takeoverActiveNoteEdit"),
    });
    button.type = "button";
    button.classList.add("obsidian-http-sync-note-takeover-button");
    button.setAttribute("aria-label", this.t("button.takeoverActiveNoteEdit"));
    button.setAttribute("title", this.t("button.takeoverActiveNoteEdit"));
    button.disabled = this.noteLeaseSupport === false;
    button.style.marginLeft = "0.5em";
    button.style.padding = "0 0.6em";
    button.style.height = "24px";
    button.style.fontSize = "var(--font-ui-smaller)";
    button.style.lineHeight = "22px";
    button.style.fontWeight = "600";
    button.style.color = "#ffffff";
    button.style.backgroundColor = "#16a34a";
    button.style.borderColor = "#15803d";
    button.style.borderRadius = "5px";

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled) {
        new Notice(this.t("notice.noteTakeoverUnavailable"));
        return;
      }
      button.disabled = true;
      try {
        await this.takeOverActiveNoteLock();
      } catch (error) {
        console.error("[obsidian-http-sync] note takeover failed", error);
      } finally {
        this.updateActiveNoteTakeoverButton();
      }
    });

    this.activeNoteTakeoverButtonEl = button;
    this.activeNoteTakeoverButtonPath = path;
    this.activeNoteTakeoverButtonHostEl = hostEl;
  }

  isMarkdownNotePath(path) {
    return normalizePath(String(path || "")).toLowerCase().endsWith(".md");
  }

  shouldTrackNoteLeaseForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.isConfigured() || !this.isMarkdownNotePath(normalizedPath)) {
      return false;
    }
    return this.shouldApplyRemotePath(normalizedPath);
  }

  shouldRenewNoteLease(state) {
    if (!state) {
      return true;
    }
    const expiresAtMs = Date.parse(state.expiresAt || "");
    if (
      !Number.isFinite(expiresAtMs) ||
      expiresAtMs - Date.now() < NOTE_LEASE_RENEW_INTERVAL_MS
    ) {
      return true;
    }
    return Date.now() - Number(state.checkedAt || 0) >= NOTE_LEASE_RENEW_INTERVAL_MS;
  }

  getNoteLeaseRouteCandidates(kind, leaseId = "") {
    const vaultBase = `/vaults/${this.settings.vaultId}`;
    const baseCandidates =
      kind === "claim"
        ? [
            `${vaultBase}/crdt/leases`,
            `${vaultBase}/note-leases`,
            `${vaultBase}/note-leases/claim`,
            `${vaultBase}/notes/leases`,
            `${vaultBase}/notes/leases/claim`,
            `${vaultBase}/edit-locks`,
            `${vaultBase}/edit-locks/claim`,
          ]
        : [
            `${vaultBase}/note-leases`,
            `${vaultBase}/note-leases/release`,
            `${vaultBase}/notes/leases`,
            `${vaultBase}/notes/leases/release`,
            `${vaultBase}/edit-locks`,
            `${vaultBase}/edit-locks/release`,
          ];
    const selectedRoute = kind === "claim" ? this.noteLeaseRoutes[kind] : "";
    if (kind === "claim" && selectedRoute) {
      if (selectedRoute === baseCandidates[0]) {
        return [selectedRoute];
      }
      return [baseCandidates[0], selectedRoute, ...baseCandidates.slice(1).filter((candidate) => candidate !== selectedRoute)];
    }
    if (kind === "release") {
      const normalizedLeaseId = String(leaseId || "").trim();
      if (normalizedLeaseId) {
        return [`${vaultBase}/crdt/leases/${encodeURIComponent(normalizedLeaseId)}`, ...baseCandidates];
      }
    }
    return baseCandidates;
  }

  isUnsupportedNoteLeaseError(error) {
    const statusCode = Number(error && error.statusCode) || 0;
    return statusCode === 404 || statusCode === 405 || statusCode === 501;
  }

  buildNoteLeaseRequestBody(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    const body = {
      device_id: this.settings.deviceId,
      file_path: normalizedPath,
      mode: options.mode || "presence",
      ttl_seconds: NOTE_LEASE_TTL_SECONDS,
    };
    if (options.takeover === true) {
      body.takeover = true;
    }
    if (options.exclusive === true) {
      body.exclusive = true;
    }
    if (options.leaseToken) {
      body.lease_token = options.leaseToken;
    }
    if (options.generation !== null && options.generation !== undefined && options.generation !== "") {
      body.generation = options.generation;
    }
    return body;
  }

  normalizeNoteLeasePayload(path, mode, payload) {
    const lease = payload && payload.lease && typeof payload.lease === "object" ? payload.lease : {};
    const holders = Array.isArray(payload && payload.active_holders)
      ? payload.active_holders
      : Array.isArray(payload && payload.holders)
        ? payload.holders
      : payload && payload.holder && typeof payload.holder === "object"
        ? [payload.holder]
        : [];
    const editable = payload ? payload.editable !== false : true;
    const readonlyReason = String(
      (payload && payload.readonly_reason) || lease.readonly_reason || ""
    ).trim();
    return {
      path: normalizePath(String(path || "")),
      mode,
      editable,
      heldByCurrentDevice: Boolean(payload && payload.held_by_current_device),
      heldByOtherDevice:
        Boolean(payload && payload.held_by_other_device) &&
        (!editable || readonlyReason === "held_by_other_device"),
      readonlyReason,
      leaseId: String((lease && lease.id) || (payload && payload.lease_id) || "").trim(),
      leaseToken: String((payload && payload.lease_token) || lease.lease_token || "").trim(),
      generation:
        (payload && payload.generation) !== undefined
          ? payload.generation
          : lease.generation,
      exclusive: Boolean((payload && payload.exclusive) || lease.exclusive),
      expiresAt: String((payload && payload.expires_at) || lease.expires_at || "").trim(),
      planMode: String((payload && payload.plan_mode) || "").trim().toLowerCase(),
      holders,
      checkedAt: Date.now(),
    };
  }

  async requestNoteLeaseClaim(path, options = {}) {
    if (this.noteLeaseSupport === false) {
      return null;
    }
    let firstError = null;
    for (const candidateRoute of this.getNoteLeaseRouteCandidates("claim")) {
      try {
        const payload = await this.requestJson(
          "POST",
          candidateRoute,
          this.buildNoteLeaseRequestBody(path, options)
        );
        this.noteLeaseRoutes.claim = candidateRoute;
        this.noteLeaseSupport = true;
        return this.normalizeNoteLeasePayload(path, options.mode || "presence", payload);
      } catch (error) {
        if (this.isUnsupportedNoteLeaseError(error)) {
          continue;
        }
        firstError = firstError || error;
        break;
      }
    }
    if (firstError) {
      throw firstError;
    }
    this.noteLeaseSupport = false;
    return null;
  }

  async releaseNoteLeaseMode(path, mode, leaseId = "", leaseToken = "", generation = null) {
    if (this.noteLeaseSupport === false) {
      return false;
    }
    const normalizedLeaseId = String(leaseId || "").trim();
    if (!normalizedLeaseId) {
      return false;
    }
    let firstError = null;
    for (const candidateRoute of this.getNoteLeaseRouteCandidates("release", normalizedLeaseId)) {
      try {
        if (candidateRoute.includes("/crdt/leases/")) {
          const query = new URLSearchParams();
          if (leaseToken) {
            query.set("lease_token", leaseToken);
          }
          const suffix = query.toString() ? `?${query.toString()}` : "";
          const payload = await this.requestJson(
            "DELETE",
            `${candidateRoute}${suffix}`
          );
          this.noteLeaseSupport = true;
          return payload ? payload.released !== false : true;
        }
        const query = new URLSearchParams();
        query.set("file_path", normalizePath(String(path || "")));
        query.set("mode", String(mode || "presence"));
        if (leaseToken) {
          query.set("lease_token", leaseToken);
        }
        if (generation !== null && generation !== undefined && generation !== "") {
          query.set("generation", String(generation));
        }
        const payload = await this.requestJson(
          "DELETE",
          `${candidateRoute}?${query.toString()}`
        );
        this.noteLeaseRoutes.release = candidateRoute;
        this.noteLeaseSupport = true;
        return payload ? payload.released !== false : true;
      } catch (error) {
        if (this.isUnsupportedNoteLeaseError(error)) {
          continue;
        }
        firstError = firstError || error;
        break;
      }
    }
    if (firstError) {
      throw firstError;
    }
    this.noteLeaseSupport = false;
    return false;
  }

  getOtherNoteLeaseHolders(state) {
    if (!state || !Array.isArray(state.holders)) {
      return [];
    }
    return state.holders.filter((holder) => {
      if (!holder || typeof holder !== "object") {
        return false;
      }
      if (holder.current_device === true || holder.is_current_device === true) {
        return false;
      }
      const holderDeviceId = String(holder.device_id || "").trim();
      return !holderDeviceId || holderDeviceId !== String(this.settings.deviceId || "").trim();
    });
  }

  formatNoteLeaseHolder(holder) {
    if (!holder || typeof holder !== "object") {
      return "";
    }
    return String(
      holder.device_name ||
        holder.user_name ||
        holder.user_email ||
        holder.email ||
        holder.device_id ||
        holder.user_id ||
        ""
    ).trim();
  }

  formatNoteLeaseHolderSummary(holders) {
    const labels = (Array.isArray(holders) ? holders : [])
      .map((holder) => this.formatNoteLeaseHolder(holder))
      .filter(Boolean);
    return labels.slice(0, 2).join(", ");
  }

  shouldAcquireNoteEditLease(path, presenceLease) {
    if (!this.shouldTrackNoteLeaseForPath(path)) {
      return false;
    }
    return String((presenceLease && presenceLease.planMode) || "").toLowerCase() !== "team";
  }

  async resolveNoteLeaseState(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return null;
    }
    const currentState =
      this.activeNoteLease && this.activeNoteLease.path === normalizedPath
        ? this.activeNoteLease
        : null;
    if (!options.force && currentState && !this.shouldRenewNoteLease(currentState)) {
      return currentState;
    }
    let presenceLease;
    try {
      presenceLease = await this.requestNoteLeaseClaim(normalizedPath, {
        mode: "presence",
        leaseToken: currentState && currentState.presenceToken ? currentState.presenceToken : "",
        generation:
          currentState && currentState.presenceGeneration !== undefined
            ? currentState.presenceGeneration
            : null,
      });
    } catch (error) {
      console.warn("[obsidian-http-sync] note presence claim failed", error);
      return currentState;
    }
    if (!presenceLease) {
      return null;
    }
    let editLease = null;
    if (
      this.shouldAcquireNoteEditLease(normalizedPath, presenceLease) ||
      options.takeover === true ||
      options.exclusive === true
    ) {
      try {
        editLease = await this.requestNoteLeaseClaim(normalizedPath, {
          mode: "edit",
          takeover: options.takeover === true,
          exclusive: options.exclusive === true,
          leaseToken: currentState && currentState.editToken ? currentState.editToken : "",
          generation:
            currentState && currentState.editGeneration !== undefined
              ? currentState.editGeneration
              : null,
        });
      } catch (error) {
        console.warn("[obsidian-http-sync] note edit claim failed", error);
      }
    }
    const currentEditLease =
      editLease && editLease.heldByCurrentDevice && editLease.editable !== false
        ? editLease
        : null;
    const primaryLease = editLease || presenceLease;
    return {
      path: normalizedPath,
      editable: primaryLease.editable !== false,
      readonlyReason: primaryLease.readonlyReason || "",
      expiresAt: primaryLease.expiresAt || presenceLease.expiresAt || "",
      planMode: primaryLease.planMode || presenceLease.planMode || "",
      holders:
        Array.isArray(primaryLease.holders) && primaryLease.holders.length > 0
          ? primaryLease.holders
          : presenceLease.holders,
      checkedAt: Date.now(),
      presenceLeaseId: presenceLease.leaseId || "",
      presenceToken: presenceLease.leaseToken || "",
      presenceGeneration: presenceLease.generation,
      editLeaseId: currentEditLease ? currentEditLease.leaseId || "" : "",
      editToken: currentEditLease ? currentEditLease.leaseToken || "" : "",
      editGeneration: currentEditLease ? currentEditLease.generation : null,
      heldByCurrentDevice: Boolean(
        (currentEditLease && currentEditLease.heldByCurrentDevice) ||
          primaryLease.heldByCurrentDevice
      ),
      heldByOtherDevice: Boolean(primaryLease.heldByOtherDevice),
      exclusive: Boolean(
        (currentEditLease && currentEditLease.exclusive) ||
          primaryLease.exclusive ||
          presenceLease.exclusive
      ),
    };
  }

  async fetchCurrentNoteLeaseReadState(path) {
    if (this.noteLeaseReadSupport === false) {
      return null;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    try {
      const query = new URLSearchParams();
      query.set("file_path", normalizedPath);
      const payload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/crdt/leases?${query.toString()}`
      );
      this.noteLeaseReadSupport = true;
      const readState = this.normalizeNoteLeasePayload(normalizedPath, "push-guard", payload);
      if (
        this.isActiveCrdtPath(normalizedPath) ||
        (this.activeNoteLease && this.activeNoteLease.path === normalizedPath)
      ) {
        this.setActiveNoteLeaseState({
          ...(this.activeNoteLease && this.activeNoteLease.path === normalizedPath
            ? this.activeNoteLease
            : {}),
          ...readState,
        });
      }
      return readState;
    } catch (error) {
      if (this.isUnsupportedNoteLeaseError(error)) {
        this.noteLeaseReadSupport = false;
        return null;
      }
      throw error;
    }
  }

  async pollActiveNoteLease(activeFile = null, options = {}) {
    const currentActiveFile =
      activeFile ||
      (this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
        ? this.app.workspace.getActiveFile()
        : null);
    const nextPath =
      currentActiveFile &&
      currentActiveFile.path &&
      this.shouldTrackNoteLeaseForPath(currentActiveFile.path)
        ? normalizePath(String(currentActiveFile.path))
        : "";
    const previousState = this.activeNoteLease;
    if (!nextPath) {
      if (previousState) {
        await this.releaseActiveNoteLease();
      } else {
        this.updateSyncStatusBarItem();
      }
      return null;
    }
    if (previousState && previousState.path !== nextPath) {
      await this.releaseActiveNoteLease();
    }
    const currentState =
      this.activeNoteLease && this.activeNoteLease.path === nextPath ? this.activeNoteLease : null;
    if (!options.force && currentState && !this.shouldRenewNoteLease(currentState)) {
      try {
        const readState = await this.fetchCurrentNoteLeaseReadState(nextPath);
        if (readState) {
          this.applyActiveNoteLeaseEditorGuard();
          this.updateSyncStatusBarItem();
          this.updateActiveNoteTakeoverButton();
          return this.activeNoteLease && this.activeNoteLease.path === nextPath
            ? this.activeNoteLease
            : readState;
        }
      } catch (error) {
        console.warn("[obsidian-http-sync] active note lease read refresh failed", error);
      }
      this.applyActiveNoteLeaseEditorGuard();
      this.updateSyncStatusBarItem();
      this.updateActiveNoteTakeoverButton();
      return currentState;
    }
      const nextState = await this.resolveNoteLeaseState(nextPath, {
      force: options.force === true,
      takeover: options.takeover === true,
      exclusive: options.exclusive === true,
    });
    if (!nextState) {
      this.clearActiveNoteLeaseState();
      return null;
    }
    this.setActiveNoteLeaseState(nextState);
    return nextState;
  }

  setActiveNoteLeaseState(nextState) {
    const previousState = this.activeNoteLease;
    const wasReadOnly = this.isResolvedNoteLeaseReadOnly(previousState);
    const isReadOnly = this.isResolvedNoteLeaseReadOnly(nextState);
    if (
      previousState &&
      (!nextState || previousState.path !== nextState.path || !isReadOnly)
    ) {
      this.setOpenEditorReadOnly(previousState.path, false);
    }
    this.activeNoteLease = nextState;
    this.applyActiveNoteLeaseEditorGuard();
    this.updateSyncStatusBarItem();
    this.updateActiveNoteTakeoverButton();
    if (!nextState) {
      return;
    }
    if (
      isReadOnly &&
      (!wasReadOnly ||
        !previousState ||
        previousState.path !== nextState.path ||
        previousState.readonlyReason !== nextState.readonlyReason)
    ) {
      this.showNoteLeaseBlockedNotice(nextState.path, { structural: false });
      return;
    }
  }

  clearActiveNoteLeaseState() {
    if (this.activeNoteLease && this.activeNoteLease.path) {
      this.setOpenEditorReadOnly(this.activeNoteLease.path, false);
    }
    this.activeNoteLease = null;
    this.updateSyncStatusBarItem();
    this.removeActiveNoteTakeoverButton();
  }

  async releaseActiveNoteLease() {
    const state = this.activeNoteLease;
    this.clearActiveNoteLeaseState();
    if (!state || !state.path) {
      return false;
    }
    const tasks = [];
    if (state.editLeaseId) {
      tasks.push(
        this.releaseNoteLeaseMode(
          state.path,
          "edit",
          state.editLeaseId,
          state.editToken,
          state.editGeneration
        )
      );
    }
    if (state.presenceLeaseId) {
      tasks.push(
        this.releaseNoteLeaseMode(
          state.path,
          "presence",
          state.presenceLeaseId,
          state.presenceToken,
          state.presenceGeneration
        )
      );
    }
    if (tasks.length === 0) {
      return false;
    }
    const settled = await Promise.allSettled(tasks);
    return settled.some((result) => result.status === "fulfilled" && result.value);
  }

  isNoteLeaseReadOnly(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || state.path !== normalizedPath) {
      return false;
    }
    return this.isResolvedNoteLeaseReadOnly(state);
  }

  isResolvedNoteLeaseReadOnly(state) {
    if (!state) {
      return false;
    }
    if (!state.exclusive && String(state.planMode || "") === "team") {
      return false;
    }
    return state.editable === false;
  }

  isNoteLeaseStateBlockingPath(path, state) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!state || !normalizedPath || !this.isResolvedNoteLeaseReadOnly(state)) {
      return false;
    }
    return (
      normalizedPath === state.path ||
      normalizedPath.startsWith(`${state.path}/`) ||
      state.path.startsWith(`${normalizedPath}/`)
    );
  }

  isNoteChangeBlockedByOtherLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (!state || !normalizedPath || !this.isNoteLeaseReadOnly(state.path)) {
      return false;
    }
    return this.isNoteLeaseStateBlockingPath(normalizedPath, state);
  }

  shouldDeferRemoteApplyForActiveEditLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (
      !state ||
      !normalizedPath ||
      state.path !== normalizedPath ||
      this.isResolvedNoteLeaseReadOnly(state)
    ) {
      return false;
    }
    if (String(state.planMode || "") === "team") {
      return false;
    }
    return Boolean(state.editLeaseId && state.editToken && state.editable !== false);
  }

  shouldDeferRemoteApplyForSharedNonCrdtNote(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const state = this.activeNoteLease;
    if (
      !state ||
      !normalizedPath ||
      state.path !== normalizedPath ||
      this.shouldUseCrdtForPath(normalizedPath)
    ) {
      return false;
    }
    return this.getOtherNoteLeaseHolders(state).length > 0;
  }

  async shouldDeferRemoteApplyForNoteLease(path, baselineEntries = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (this.shouldDeferRemoteApplyForActiveEditLease(normalizedPath)) {
      return true;
    }
    if (
      this.shouldDeferRemoteApplyForSharedNonCrdtNote(normalizedPath) &&
      (!baselineEntries || (await this.hasUnsyncedLocalChange(normalizedPath, baselineEntries)))
    ) {
      this.showNoteNonCrdtRemotePausedNotice(normalizedPath);
      return true;
    }
    return false;
  }

  addReportConflictPath(report, path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath) {
      return;
    }
    if (!report.conflictedPaths || typeof report.conflictedPaths.add !== "function") {
      report.conflictedPaths = new Set();
    }
    report.conflictedPaths.add(normalizedPath);
  }

  getOpenConflictPaths(report = null) {
    const paths = new Set();
    if (report && report.conflictedPaths && typeof report.conflictedPaths.forEach === "function") {
      report.conflictedPaths.forEach((path) => {
        const normalizedPath = normalizePath(String(path || ""));
        if (normalizedPath) {
          paths.add(normalizedPath);
        }
      });
    }
    const items =
      this.settings && this.settings.conflicts && this.settings.conflicts.items
        ? this.settings.conflicts.items
        : {};
    for (const conflict of Object.values(items)) {
      if (!conflict || String(conflict.status || "open") !== "open") {
        continue;
      }
      for (const candidate of [conflict.path, conflict.target_path]) {
        const normalizedPath = normalizePath(String(candidate || ""));
        if (normalizedPath) {
          paths.add(normalizedPath);
        }
      }
    }
    return paths;
  }

  isPathOpenConflict(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(normalizedPath && this.getOpenConflictPaths(report).has(normalizedPath));
  }

  shouldDeferRemoteApplyForOpenConflict(path, report = null) {
    if (!this.isPathOpenConflict(path, report)) {
      return false;
    }
    this.pendingChangesDuringSync = true;
    return true;
  }

  rememberAcceptedPushBaseline(report, path, entry) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath || !entry) {
      return;
    }
    if (!report.acceptedPushEntries) {
      report.acceptedPushEntries = {};
    }
    report.acceptedPushEntries[normalizedPath] = { ...entry };
  }

  addReportRemoteAppliedPath(report, path, entry = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!report || !normalizedPath) {
      return;
    }
    if (!report.remotelyAppliedPaths || typeof report.remotelyAppliedPaths.add !== "function") {
      report.remotelyAppliedPaths = new Set();
    }
    report.remotelyAppliedPaths.add(normalizedPath);
    if (entry) {
      if (!report.remotelyAppliedEntries) {
        report.remotelyAppliedEntries = {};
      }
      report.remotelyAppliedEntries[normalizedPath] = { ...entry };
    }
  }

  isPathRemoteAppliedDuringSync(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(
      normalizedPath &&
        report &&
        report.remotelyAppliedPaths &&
        typeof report.remotelyAppliedPaths.has === "function" &&
        report.remotelyAppliedPaths.has(normalizedPath)
    );
  }

  getRemoteAppliedEntryDuringSync(path, report = null) {
    const normalizedPath = normalizePath(String(path || ""));
    if (
      !normalizedPath ||
      !report ||
      !report.remotelyAppliedEntries ||
      !report.remotelyAppliedEntries[normalizedPath]
    ) {
      return null;
    }
    return report.remotelyAppliedEntries[normalizedPath];
  }

  preserveAcceptedPushBaselines(finalEntries, report = null) {
    const acceptedEntries = report && report.acceptedPushEntries ? report.acceptedPushEntries : {};
    const acceptedPaths = Object.keys(acceptedEntries);
    if (acceptedPaths.length === 0) {
      return finalEntries;
    }
    const retainedEntries = { ...(finalEntries || {}) };
    let retainedAnyAcceptedBaseline = false;
    for (const path of acceptedPaths) {
      const acceptedEntry = acceptedEntries[path];
      if (!acceptedEntry) {
        continue;
      }
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      if (finalEntry && sameSyncIdentity(finalEntry, acceptedEntry)) {
        continue;
      }
      retainedEntries[path] = { ...acceptedEntry };
      retainedAnyAcceptedBaseline = true;
    }
    if (retainedAnyAcceptedBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }

  preserveLocalChangesDuringSyncBaselines(finalEntries, cycleStartEntries, report = null) {
    const retainedEntries = { ...(finalEntries || {}) };
    const paths = new Set([
      ...Object.keys(finalEntries || {}),
      ...Object.keys(cycleStartEntries || {}),
    ]);
    let retainedAnyLocalBaseline = false;
    for (const path of paths) {
      const acceptedEntries = report && report.acceptedPushEntries ? report.acceptedPushEntries : {};
      if (
        acceptedEntries[path] ||
        this.isPathOpenConflict(path, report)
      ) {
        continue;
      }
      const remoteAppliedEntry = this.getRemoteAppliedEntryDuringSync(path, report);
      if (this.isPathRemoteAppliedDuringSync(path, report) && !remoteAppliedEntry) {
        continue;
      }
      const startEntry = cycleStartEntries && cycleStartEntries[path] ? cycleStartEntries[path] : null;
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      if (remoteAppliedEntry) {
        if (finalEntry && sameSyncIdentity(finalEntry, remoteAppliedEntry)) {
          continue;
        }
        retainedEntries[path] = { ...remoteAppliedEntry };
        retainedAnyLocalBaseline = true;
        continue;
      }
      if (!startEntry && !finalEntry) {
        continue;
      }
      if (startEntry && finalEntry && sameSyncIdentity(startEntry, finalEntry)) {
        continue;
      }
      if (startEntry) {
        retainedEntries[path] = { ...startEntry };
      } else {
        delete retainedEntries[path];
      }
      retainedAnyLocalBaseline = true;
    }
    if (retainedAnyLocalBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }

  async preserveOpenConflictUnsyncedBaselines(finalEntries, previousEntries, report = null) {
    const conflictPaths = this.getOpenConflictPaths(report);
    if (conflictPaths.size === 0) {
      return finalEntries;
    }
    const retainedEntries = { ...(finalEntries || {}) };
    let retainedAnyConflictBaseline = false;
    for (const path of conflictPaths) {
      if (!path) {
        continue;
      }
      const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
      const previousEntry =
        previousEntries && previousEntries[path] ? previousEntries[path] : null;
      let remoteEntry = null;
      let remoteChecked = false;
      try {
        remoteEntry = await this.fetchRemoteSnapshotEntry(path);
        remoteChecked = true;
      } catch (error) {
        console.warn("[obsidian-http-sync] open conflict remote baseline check failed", error);
      }
      const retainedEntry = remoteChecked ? remoteEntry : previousEntry;
      if (retainedEntry && finalEntry && sameSyncIdentity(retainedEntry, finalEntry)) {
        continue;
      }
      if (!retainedEntry && !finalEntry) {
        continue;
      }
      if (retainedEntry) {
        retainedEntries[path] = retainedEntry;
        retainedAnyConflictBaseline = true;
      } else {
        delete retainedEntries[path];
        retainedAnyConflictBaseline = true;
      }
    }
    if (retainedAnyConflictBaseline) {
      this.pendingChangesDuringSync = true;
    }
    return retainedEntries;
  }

  async preserveActiveEditLeaseUnsyncedBaseline(finalEntries, pushedSnapshotEntries) {
    const state = this.activeNoteLease;
    const path = state && state.path ? normalizePath(String(state.path)) : "";
    if (
      !path ||
      (!this.shouldDeferRemoteApplyForActiveEditLease(path) &&
        !this.shouldDeferRemoteApplyForSharedNonCrdtNote(path))
    ) {
      return finalEntries;
    }
    const finalEntry = finalEntries && finalEntries[path] ? finalEntries[path] : null;
    const pushedEntry =
      pushedSnapshotEntries && pushedSnapshotEntries[path] ? pushedSnapshotEntries[path] : null;
    if (!finalEntry) {
      return finalEntries;
    }
    let remoteEntry = null;
    try {
      remoteEntry = await this.fetchRemoteSnapshotEntry(path);
    } catch (error) {
      console.warn("[obsidian-http-sync] active note remote baseline check failed", error);
    }
    if (remoteEntry && sameSyncIdentity(finalEntry, remoteEntry)) {
      return finalEntries;
    }
    if (!remoteEntry && pushedEntry && sameSyncIdentity(finalEntry, pushedEntry)) {
      return finalEntries;
    }
    const retainedEntries = { ...(finalEntries || {}) };
    if (remoteEntry) {
      retainedEntries[path] = remoteEntry;
    } else if (pushedEntry) {
      retainedEntries[path] = pushedEntry;
    } else {
      delete retainedEntries[path];
    }
    this.pendingChangesDuringSync = true;
    return retainedEntries;
  }

  async fetchRemoteSnapshotEntry(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return null;
    }
    const remoteEntry = (await this.fetchRemoteFileIndex()).find(
      (entry) => entry.path === normalizedPath && !entry.is_deleted
    );
    return remoteEntry ? this.remoteFileEntryToSnapshotEntry(remoteEntry) : null;
  }

  async isNoteChangeBlockedByOtherLeaseFresh(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return false;
    }
    const readState = await this.fetchCurrentNoteLeaseReadState(normalizedPath);
    if (readState) {
      return this.isNoteLeaseStateBlockingPath(normalizedPath, readState);
    }
    const state = await this.resolveNoteLeaseState(normalizedPath, {
      force: options.force === true,
      takeover: options.takeover === true,
    });
    return this.isNoteLeaseStateBlockingPath(normalizedPath, state);
  }

  shouldRenewLocalDiffNoteLock(state) {
    if (!state) {
      return true;
    }
    const expiresAtMs = Date.parse(state.expiresAt || "");
    return (
      !Number.isFinite(expiresAtMs) ||
      expiresAtMs - Date.now() < NOTE_LEASE_RENEW_INTERVAL_MS
    );
  }

  async claimLocalDiffNoteEditLock(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.shouldTrackNoteLeaseForPath(normalizedPath)) {
      return true;
    }
    const cachedLock = this.localDiffNoteLocks.get(normalizedPath) || null;
    if (!this.shouldRenewLocalDiffNoteLock(cachedLock)) {
      return true;
    }
    try {
      if (await this.isNoteChangeBlockedByOtherLeaseFresh(normalizedPath, { force: true })) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(normalizedPath, {
          structural: options.structural === true,
        });
        this.applyActiveNoteLeaseEditorGuard();
        return false;
      }
      const activeFile =
        this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
          ? this.app.workspace.getActiveFile()
          : null;
      let nextState = null;
      const isOpenEditorPath = Boolean(
        activeFile && normalizePath(String(activeFile.path || "")) === normalizedPath
      ) || Boolean(this.getOpenEditorView(normalizedPath));
      if (activeFile && normalizePath(String(activeFile.path || "")) === normalizedPath) {
        nextState = await this.pollActiveNoteLease(activeFile, {
          force: true,
          exclusive: true,
        });
      } else if (isOpenEditorPath) {
        nextState = await this.requestNoteLeaseClaim(normalizedPath, {
          mode: "edit",
          exclusive: true,
          leaseToken: cachedLock && cachedLock.editToken ? cachedLock.editToken : "",
          generation:
            cachedLock && cachedLock.editGeneration !== undefined
              ? cachedLock.editGeneration
              : null,
        });
      } else {
        return true;
      }
      if (!nextState || nextState.editable === false || nextState.heldByOtherDevice === true) {
        this.pendingChangesDuringSync = true;
        this.showNoteLeaseBlockedNotice(normalizedPath, {
          structural: options.structural === true,
        });
        this.applyActiveNoteLeaseEditorGuard();
        return false;
      }
      this.localDiffNoteLocks.set(normalizedPath, {
        expiresAt: nextState.expiresAt || "",
        editLeaseId: nextState.editLeaseId || nextState.leaseId || "",
        editToken: nextState.editToken || nextState.leaseToken || "",
        editGeneration: nextState.editGeneration ?? nextState.generation ?? null,
      });
      return true;
    } catch (error) {
      console.warn("[obsidian-http-sync] note edit lock claim failed", error);
      return true;
    }
  }

  queueReleaseLocalDiffNoteLock(path) {
    this.releaseLocalDiffNoteLock(path).catch((error) => {
      console.warn("[obsidian-http-sync] note edit lock release failed", error);
    });
  }

  async releaseLocalDiffNoteLock(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath) {
      return false;
    }
    const cachedLock = this.localDiffNoteLocks.get(normalizedPath) || null;
    if (!cachedLock) {
      return false;
    }
    this.localDiffNoteLocks.delete(normalizedPath);
    const activeState = this.activeNoteLease;
    if (
      activeState &&
      activeState.path === normalizedPath &&
      cachedLock.editLeaseId &&
      activeState.editLeaseId === cachedLock.editLeaseId
    ) {
      return false;
    }
    if (!cachedLock.editLeaseId) {
      return false;
    }
    return this.releaseNoteLeaseMode(
      normalizedPath,
      "edit",
      cachedLock.editLeaseId,
      cachedLock.editToken || "",
      cachedLock.editGeneration
    );
  }

  setOpenEditorReadOnly(path, readOnly) {
    const openView = this.getOpenEditorView(path);
    if (!openView || !openView.editor) {
      return false;
    }
    const editor = openView.editor;
    let applied = this.setCodeMirrorEditorGuard(path, editor, readOnly);
    try {
      if (typeof editor.setOption === "function") {
        editor.setOption("readOnly", readOnly);
        applied = true;
      }
    } catch (error) {
      // Ignore unsupported editor API variants.
    }
    try {
      if (editor.cm && typeof editor.cm.setOption === "function") {
        editor.cm.setOption("readOnly", readOnly);
        applied = true;
      }
    } catch (error) {
      // Ignore unsupported editor API variants.
    }
    return applied;
  }

  setCodeMirrorEditorGuard(path, editor, readOnly) {
    const cm = editor && editor.cm ? editor.cm : null;
    if (!cm || typeof cm !== "object") {
      return false;
    }
    let guard = this.noteLeaseEditorGuards.get(cm);
    if (!guard) {
      const originalDispatch = typeof cm.dispatch === "function" ? cm.dispatch.bind(cm) : null;
      guard = {
        path: "",
        readOnly: false,
        originalDispatch,
        contentDOM: cm.contentDOM || null,
        dom: cm.dom || null,
      };
      if (originalDispatch) {
        cm.dispatch = (...args) => {
          if (
            this.shouldBlockEditorGuard(guard) &&
            this.isEditorDispatchChangingDocument(args)
          ) {
            this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
            return;
          }
          return originalDispatch(...args);
        };
      }
      const blockDomEdit = (event) => {
        if (!this.shouldBlockEditorGuard(guard)) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
      };
      const blockKeyEdit = (event) => {
        if (!this.shouldBlockEditorGuard(guard)) {
          return;
        }
        if (this.isEditingKeyEvent(event)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.showNoteLeaseBlockedNotice(guard.path, { structural: false });
        }
      };
      guard.blockDomEdit = blockDomEdit;
      guard.blockKeyEdit = blockKeyEdit;
      const contentDOM = guard.contentDOM;
      if (contentDOM && typeof contentDOM.addEventListener === "function") {
        for (const eventName of ["beforeinput", "paste", "drop", "cut"]) {
          contentDOM.addEventListener(eventName, blockDomEdit, true);
        }
        contentDOM.addEventListener("keydown", blockKeyEdit, true);
      }
      this.noteLeaseEditorGuards.set(cm, guard);
    }
    guard.path = normalizePath(String(path || ""));
    guard.readOnly = readOnly === true;
    const contentDOM = cm.contentDOM || guard.contentDOM;
    if (contentDOM && typeof contentDOM.setAttribute === "function") {
      contentDOM.setAttribute("contenteditable", guard.readOnly ? "false" : "true");
      contentDOM.setAttribute("aria-readonly", guard.readOnly ? "true" : "false");
    }
    const editorDom = cm.dom || guard.dom;
    if (editorDom && editorDom.classList) {
      editorDom.classList.toggle("obsidian-http-sync-note-readonly", guard.readOnly);
    }
    return true;
  }

  shouldBlockEditorGuard(guard) {
    return Boolean(
      guard &&
        guard.readOnly &&
        guard.path &&
        this.remoteEditorUpdateDepth <= 0 &&
        this.isNoteLeaseReadOnly(guard.path)
    );
  }

  isEditorDispatchChangingDocument(args) {
    const stack = Array.isArray(args) ? args.slice() : [args];
    while (stack.length > 0) {
      const value = stack.shift();
      if (!value || typeof value !== "object") {
        continue;
      }
      if (Array.isArray(value)) {
        stack.push(...value);
        continue;
      }
      if (value.docChanged === true) {
        return true;
      }
      if (!Object.prototype.hasOwnProperty.call(value, "changes")) {
        continue;
      }
      const changes = value.changes;
      if (!changes) {
        continue;
      }
      if (Array.isArray(changes)) {
        if (changes.length > 0) {
          return true;
        }
        continue;
      }
      if (typeof changes === "object") {
        if (changes.empty === true) {
          continue;
        }
        if (typeof changes.iterChanges === "function") {
          let hasChanges = false;
          changes.iterChanges(() => {
            hasChanges = true;
          });
          if (hasChanges) {
            return true;
          }
          continue;
        }
        return true;
      }
      return true;
    }
    return false;
  }

  isEditingKeyEvent(event) {
    if (!event) {
      return false;
    }
    if (event.isComposing) {
      return true;
    }
    const key = String(event.key || "");
    if (key.length === 1 && !event.metaKey && !event.ctrlKey) {
      return true;
    }
    return ["Backspace", "Delete", "Enter", "Tab"].includes(key);
  }

  applyActiveNoteLeaseEditorGuard() {
    if (!this.activeNoteLease || !this.activeNoteLease.path) {
      return;
    }
    this.setOpenEditorReadOnly(
      this.activeNoteLease.path,
      this.isNoteLeaseReadOnly(this.activeNoteLease.path)
    );
  }

  showNoteLeaseBlockedNotice(path, options = {}) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.shouldShowNoteLeaseNoticeForPath(normalizedPath)) {
      return;
    }
    const now = Date.now();
    const noticeKey = `${normalizedPath}:${options.structural === true ? "struct" : "edit"}`;
    const lastNoticeAt = Number(this.noteLeaseNoticeTimestamps.get(noticeKey) || 0);
    if (now - lastNoticeAt < NOTE_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.noteLeaseNoticeTimestamps.set(noticeKey, now);
    const holders = this.activeNoteLease
      ? this.formatNoteLeaseHolderSummary(this.getOtherNoteLeaseHolders(this.activeNoteLease))
      : "";
    const reason =
      (this.activeNoteLease && this.activeNoteLease.readonlyReason) || holders || normalizedPath;
    new Notice(
      this.t(
        options.structural === true
          ? "notice.noteStructuralChangeBlocked"
          : "notice.noteReadonly",
        { path: normalizedPath, reason }
      )
    );
  }

  showNoteNonCrdtRemotePausedNotice(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (
      typeof this.shouldShowNoteLeaseNoticeForPath === "function" &&
      !this.shouldShowNoteLeaseNoticeForPath(normalizedPath)
    ) {
      return;
    }
    const noticeKey = `${normalizedPath}:non-crdt-remote-paused`;
    const now = Date.now();
    const lastNoticeAt = Number(this.noteLeaseNoticeTimestamps.get(noticeKey) || 0);
    if (now - lastNoticeAt < NOTE_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.noteLeaseNoticeTimestamps.set(noticeKey, now);
    new Notice(
      this.t("notice.noteNonCrdtRemotePaused", {
        path: normalizedPath,
        holders: this.formatNoteLeaseHolderSummary(this.getOtherNoteLeaseHolders(this.activeNoteLease)),
      })
    );
  }

  async takeOverActiveNoteLock() {
    const activeFile =
      this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
        ? this.app.workspace.getActiveFile()
        : null;
    if (!activeFile || !activeFile.path || !this.shouldTrackNoteLeaseForPath(activeFile.path)) {
      new Notice(this.t("notice.noteTakeoverUnavailable"));
      return;
    }
    const path = normalizePath(String(activeFile.path));
    const previousState = this.activeNoteLease;
    const nextState = await this.pollActiveNoteLease(activeFile, {
      force: true,
      takeover: true,
    });
    if (!nextState && previousState && previousState.path === path) {
      this.activeNoteLease = previousState;
      this.applyActiveNoteLeaseEditorGuard();
      this.updateSyncStatusBarItem();
      this.updateActiveNoteTakeoverButton();
      new Notice(this.t("notice.noteTakeoverUnavailable"));
      return;
    }
    if (this.shouldUseCrdtForPath(path) && this.settings.crdtMarkdownEnabled) {
      try {
        await this.pullCrdtRemoteUpdates(path, null, { skipWriteWhenDirty: true });
      } catch (error) {
        console.warn("[obsidian-http-sync] note takeover baseline refresh failed", error);
      }
    }
    if (!this.settings.state) {
      this.settings.state = { entries: {} };
    }
    if (!this.settings.state.entries) {
      this.settings.state.entries = {};
    }
    await this.refreshBaselineEntry(this.settings.state.entries, path);
    await this.saveSettings();
    this.updateActiveNoteTakeoverButton();
    new Notice(
      this.t(
        nextState && nextState.editable !== false
          ? "notice.noteTakeoverDone"
          : "notice.noteTakeoverPending",
        { path }
      )
    );
  }

  async ensureCrdtProtocolSupported() {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    if (this.crdtProtocolSupported === true) {
      return true;
    }
    if (this.crdtProtocolSupported === false) {
      return false;
    }

    const payload = await this.requestJson("GET", "/health");
    const capabilities =
      payload && payload.capabilities && typeof payload.capabilities === "object"
        ? payload.capabilities
        : {};
    const supported = REQUIRED_CRDT_CAPABILITIES.every(
      (capability) => capabilities[capability] === true
    );
    this.crdtProtocolSupported = supported;
    if (!supported) {
      this.settings.lastError = this.t("error.crdtProtocolUnsupported");
      await this.saveSettings();
      if (!this.crdtProtocolUnsupportedNoticeShown) {
        this.crdtProtocolUnsupportedNoticeShown = true;
        new Notice(this.settings.lastError);
      }
    }
    return supported;
  }

  isActiveCrdtPath(path) {
    const activeFile =
      this.app.workspace && typeof this.app.workspace.getActiveFile === "function"
        ? this.app.workspace.getActiveFile()
        : null;
    return Boolean(
      activeFile &&
        activeFile.path &&
        normalizePath(String(activeFile.path)) === normalizePath(String(path || ""))
    );
  }

  shouldShowNoteLeaseNoticeForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    return Boolean(
      normalizedPath &&
        (this.isActiveCrdtPath(normalizedPath) || this.getOpenEditorView(normalizedPath))
    );
  }

  getCachedCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.crdtLeases.get(normalizedPath);
    if (!cached) {
      return null;
    }
    const expiresAtMs = Date.parse(cached.expiresAt || "");
    if (Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now()) {
      this.crdtLeases.delete(normalizedPath);
      return null;
    }
    return cached;
  }

  cacheCrdtLeasePayload(path, payload) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!payload || !payload.lease) {
      this.crdtLeases.delete(normalizedPath);
      return null;
    }
    const lease = payload.lease;
    const leaseEditable = payload.editable !== false;
    const readonlyReason = String(payload.readonly_reason || "");
    const cached = {
      lease,
      leaseId: lease.id || "",
      leaseToken: lease.lease_token || "",
      heldByCurrentDevice: Boolean(payload.held_by_current_device),
      heldByOtherDevice:
        Boolean(payload.held_by_other_device) &&
        (!leaseEditable || readonlyReason === "held_by_other_device"),
      expiresAt: payload.expires_at || lease.expires_at || "",
      checkedAt: Date.now(),
    };
    this.crdtLeases.set(normalizedPath, cached);
    return cached;
  }

  async fetchCrdtLease(path) {
    const query = new URLSearchParams();
    query.set("path", path);
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/leases?${query.toString()}`
    );
    return this.cacheCrdtLeasePayload(path, payload);
  }

  async acquireCrdtLease(path) {
    const payload = await this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/crdt/leases`,
      {
        device_id: this.settings.deviceId,
        path,
        ttl_seconds: CRDT_LEASE_TTL_SECONDS,
      }
    );
    return this.cacheCrdtLeasePayload(path, payload);
  }

  async releaseCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (!cached || !cached.heldByCurrentDevice || !cached.leaseId) {
      return false;
    }
    const query = new URLSearchParams();
    if (cached.leaseToken) {
      query.set("lease_token", cached.leaseToken);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const payload = await this.requestJson(
      "DELETE",
      `/vaults/${this.settings.vaultId}/crdt/leases/${encodeURIComponent(
        cached.leaseId
      )}${suffix}`
    );
    if (payload && payload.released) {
      this.crdtLeases.delete(normalizedPath);
    }
    return Boolean(payload && payload.released);
  }

  async ensureActiveCrdtLease(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (cached) {
      if (cached.heldByOtherDevice) {
        return cached;
      }
      const expiresAtMs = Date.parse(cached.expiresAt || "");
      const shouldRenew =
        !cached.heldByCurrentDevice ||
        Date.now() - Number(cached.checkedAt || 0) >= CRDT_LEASE_RENEW_INTERVAL_MS ||
        (Number.isFinite(expiresAtMs) && expiresAtMs - Date.now() < CRDT_LEASE_RENEW_INTERVAL_MS);
      if (!shouldRenew) {
        return cached;
      }
    }
    return this.acquireCrdtLease(normalizedPath);
  }

  async isCrdtLeaseHeldByOther(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const cached = this.getCachedCrdtLease(normalizedPath);
    if (cached) {
      return cached.heldByOtherDevice;
    }
    const lease = await this.fetchCrdtLease(normalizedPath);
    return Boolean(lease && lease.heldByOtherDevice);
  }

  showCrdtLeasePausedNotice(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const now = Date.now();
    const lastNoticeAt = Number(this.crdtLeaseNoticeTimestamps.get(normalizedPath) || 0);
    if (now - lastNoticeAt < CRDT_LEASE_NOTICE_INTERVAL_MS) {
      return;
    }
    this.crdtLeaseNoticeTimestamps.set(normalizedPath, now);
    new Notice(this.t("notice.crdtLeaseHeld"));
  }

  async ensureCrdtDoc(path) {
    const normalizedPath = normalizePath(String(path || ""));
    const existing = this.crdtDocs.get(normalizedPath);
    if (existing) {
      return existing;
    }

    const doc = new Y.Doc();
    const text = doc.getText("markdown");
    let sequenceNumber = 0;
    while (true) {
      const updates = await this.fetchCrdtUpdates(normalizedPath, sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= sequenceNumber) {
          continue;
        }
        Y.applyUpdate(doc, base64ToUint8Array(update.update_base64), "remote");
        sequenceNumber = nextSequenceNumber;
      }
      if (updates.length < 500) {
        break;
      }
    }

    if (sequenceNumber === 0) {
      const snapshot = await this.fetchCrdtSnapshot(normalizedPath);
      if (snapshot && snapshot.text !== null && snapshot.text !== undefined) {
        doc.transact(() => {
          text.insert(0, snapshot.text);
        }, "snapshot");
        sequenceNumber = Number(snapshot.latestSequenceNumber || 0);
      }
    }

    const state = {
      doc,
      text,
      sequenceNumber,
    };
    this.crdtDocs.set(normalizedPath, state);

    if (
      sequenceNumber > 0 &&
      !this.isPendingLocalDeletePath(normalizedPath) &&
      !this.isPendingRenameSourcePath(normalizedPath) &&
      !this.isPendingRenameTargetPath(normalizedPath) &&
      !(await this.app.vault.adapter.exists(normalizedPath))
    ) {
      await this.writeTextFile(normalizedPath, text.toString());
    }
    return state;
  }

  async createCrdtDocAtSequence(path, targetSequenceNumber) {
    const normalizedPath = normalizePath(String(path || ""));
    const target = Math.max(0, Number(targetSequenceNumber) || 0);
    const doc = new Y.Doc();
    const text = doc.getText("markdown");
    let sequenceNumber = 0;

    while (sequenceNumber < target) {
      const updates = await this.fetchCrdtUpdates(normalizedPath, sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= sequenceNumber) {
          continue;
        }
        if (nextSequenceNumber > target) {
          return { doc, text, sequenceNumber };
        }
        Y.applyUpdate(doc, base64ToUint8Array(update.update_base64), "remote");
        sequenceNumber = nextSequenceNumber;
        if (sequenceNumber >= target) {
          break;
        }
      }
      if (updates.length < 500) {
        break;
      }
    }

    return { doc, text, sequenceNumber };
  }

  async fetchCrdtUpdates(path, afterSequenceNumber) {
    const query = new URLSearchParams();
    query.set("path", path);
    query.set("after_sequence_number", String(Math.max(0, Number(afterSequenceNumber) || 0)));
    query.set("limit", "500");
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/updates?${query.toString()}`
    );
    return Array.isArray(payload.updates) ? payload.updates : [];
  }

  async fetchCrdtSnapshot(path) {
    const query = new URLSearchParams();
    query.set("path", path);
    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/crdt/snapshot?${query.toString()}`
    );
    if (!payload || !payload.snapshot) {
      return null;
    }
    return {
      latestSequenceNumber: Number(payload.snapshot.latest_sequence_number || 0),
      text: payload.materialized_content_base64
        ? base64ToUtf8(payload.materialized_content_base64)
        : "",
    };
  }

  async publishCrdtSnapshot(path, state) {
    if (!state || Number(state.sequenceNumber || 0) <= 0) {
      return false;
    }
    const snapshotText = state.text.toString();
    try {
      const payload = await this.requestJson(
        "PUT",
        `/vaults/${this.settings.vaultId}/crdt/snapshot`,
        {
          device_id: this.settings.deviceId,
          path,
          last_applied_sequence_number: Number(state.sequenceNumber || 0),
          materialized_content_base64: utf8ToBase64(snapshotText),
        }
      );
      return Boolean(payload && payload.accepted);
    } catch (error) {
      throw error;
    }
  }

  async pushCrdtLocalFile(path, report) {
    if (this.crdtApplyingRemotePaths.has(path)) {
      return false;
    }
    if (await this.isNoteChangeBlockedByOtherLeaseFresh(path)) {
      this.showNoteLeaseBlockedNotice(path, { structural: false });
      return false;
    }
    // Skip CRDT push for files that are targets of pending renames.
    // The structural move must be processed first to avoid duplicate file entries.
    const allRenameTargets = new Set([
      ...Object.keys(this.settings.pendingRenameHints || {}),
      ...Object.keys(this.renameHints || {}),
    ]);
    if (allRenameTargets.has(path)) {
      return false;
    }
    if (this.shouldUseCrdtLeases() && (await this.isCrdtLeaseHeldByOther(path))) {
      if (this.isActiveCrdtPath(path)) {
        this.showCrdtLeasePausedNotice(path);
      }
      return false;
    }
    if (!(await this.app.vault.adapter.exists(path))) {
      return false;
    }
    const storedCrdtState = this.getCrdtFileState(path);
    const storedSequenceNumber = Math.max(
      0,
      Number(storedCrdtState && storedCrdtState.sequenceNumber) || 0
    );
    const hasPendingLocalEdit = Boolean(storedCrdtState && storedCrdtState.dirty);
    if (hasPendingLocalEdit) {
      const shouldHoldEditLeaseForPath =
        this.isActiveCrdtPath(path) || Boolean(this.getOpenEditorView(path));
      if (shouldHoldEditLeaseForPath) {
        const lease = await this.ensureActiveCrdtLease(path);
        if (lease && lease.heldByOtherDevice) {
          this.showCrdtLeasePausedNotice(path);
          return false;
        }
      }
    }
    const state = await this.ensureCrdtDoc(path);
    const localText = await this.readTextFile(path);
    const previousText = state.text.toString();
    const remoteAdvancedSinceLastStore =
      storedSequenceNumber < Number(state.sequenceNumber || 0);
    const shouldAttemptPush =
      Number(state.sequenceNumber || 0) === 0 ||
      hasPendingLocalEdit ||
      (localText !== previousText && !remoteAdvancedSinceLastStore);

    if (!shouldAttemptPush) {
      if (storedSequenceNumber !== Number(state.sequenceNumber || 0)) {
        this.setCrdtSequenceNumber(path, state.sequenceNumber);
        await this.saveSettings();
      }
      return false;
    }

    if (localText === previousText) {
      if (state.sequenceNumber !== 0) {
        this.setCrdtSequenceNumber(path, state.sequenceNumber);
        this.setCrdtDirty(path, false);
        await this.saveSettings();
        return false;
      }
      const baseSequenceNumber = state.sequenceNumber;
      const updateBytes = Y.encodeStateAsUpdate(state.doc);
      const clientUpdateId = generateClientOperationId();
      let payload;
      try {
        payload = await this.requestJson(
          "POST",
          `/vaults/${this.settings.vaultId}/crdt/updates`,
          {
            device_id: this.settings.deviceId,
            path,
            client_update_id: clientUpdateId,
            base_sequence_number: baseSequenceNumber,
            update_base64: uint8ArrayToBase64(updateBytes),
            materialized_content_base64: utf8ToBase64(localText),
          }
        );
      } catch (error) {
        throw error;
      }
      const sequenceNumber = Number(
        payload && payload.update ? payload.update.sequence_number : 0
      );
      if (sequenceNumber > state.sequenceNumber && sequenceNumber <= baseSequenceNumber + 1) {
        state.sequenceNumber = sequenceNumber;
        this.setCrdtSequenceNumber(path, sequenceNumber);
        this.setCrdtDirty(path, false);
        await this.saveSettings();
      }
      if (report) {
        report.crdtPushed = Number(report.crdtPushed || 0) + 1;
      }
      return true;
    }

    const localUpdates = [];
    const updateHandler = (update) => {
      localUpdates.push(update);
    };
    state.doc.on("update", updateHandler);
    try {
      state.doc.transact(() => {
        applyTextDiff(state.text, previousText, localText);
      }, "local");
    } finally {
      state.doc.off("update", updateHandler);
    }
    if (localUpdates.length === 0) {
      this.setCrdtSequenceNumber(path, state.sequenceNumber);
      this.setCrdtDirty(path, false);
      await this.saveSettings();
      return false;
    }

    const baseSequenceNumber = state.sequenceNumber;
    const updateBytes =
      localUpdates.length === 1 ? localUpdates[0] : Y.mergeUpdates(localUpdates);
    const clientUpdateId = generateClientOperationId();
    const materializedText = state.text.toString();
    let payload;
    try {
      payload = await this.requestJson(
        "POST",
        `/vaults/${this.settings.vaultId}/crdt/updates`,
        {
          device_id: this.settings.deviceId,
          path,
          client_update_id: clientUpdateId,
          base_sequence_number: baseSequenceNumber,
          update_base64: uint8ArrayToBase64(updateBytes),
          materialized_content_base64: utf8ToBase64(materializedText),
        }
      );
    } catch (error) {
      throw error;
    }
    const sequenceNumber = Number(
      payload && payload.update ? payload.update.sequence_number : 0
    );
    if (sequenceNumber > state.sequenceNumber && sequenceNumber <= baseSequenceNumber + 1) {
      state.sequenceNumber = sequenceNumber;
      this.setCrdtSequenceNumber(path, sequenceNumber);
      this.setCrdtDirty(path, false);
      await this.saveSettings();
    }
    if (report) {
      report.crdtPushed = Number(report.crdtPushed || 0) + 1;
    }
    return true;
  }

  async pushStaleCrdtLocalFile(path, baseSequenceNumber, localText, latestState, report) {
    const baseState = await this.createCrdtDocAtSequence(path, baseSequenceNumber);
    if (Number(baseState.sequenceNumber || 0) !== Number(baseSequenceNumber || 0)) {
      await this.captureConflictCopy(path);
      if (latestState && Number(latestState.sequenceNumber || 0) > 0) {
        this.setCrdtSequenceNumber(path, latestState.sequenceNumber);
      }
      if (report) {
        report.conflicts = Number(report.conflicts || 0) + 1;
      }
      await this.saveSettings();
      return false;
    }

    const baseText = baseState.text.toString();
    if (localText === baseText) {
      await this.writeLatestCrdtStateToFile(path, latestState);
      await this.saveSettings();
      return false;
    }

    const localUpdates = [];
    const updateHandler = (update) => {
      localUpdates.push(update);
    };
    baseState.doc.on("update", updateHandler);
    try {
      baseState.doc.transact(() => {
        applyTextDiff(baseState.text, baseText, localText);
      }, "local");
    } finally {
      baseState.doc.off("update", updateHandler);
    }
    if (localUpdates.length === 0) {
      return false;
    }

    const updateBytes =
      localUpdates.length === 1 ? localUpdates[0] : Y.mergeUpdates(localUpdates);
    await this.requestJson(
      "POST",
      `/vaults/${this.settings.vaultId}/crdt/updates`,
      {
        device_id: this.settings.deviceId,
        path,
        client_update_id: generateClientOperationId(),
        base_sequence_number: baseSequenceNumber,
        update_base64: uint8ArrayToBase64(updateBytes),
        materialized_content_base64: utf8ToBase64(localText),
      }
    );
    if (report) {
      report.crdtPushed = Number(report.crdtPushed || 0) + 1;
    }
    return true;
  }

  async pullCrdtRemoteUpdates(path, report, options = {}) {
    const state = await this.ensureCrdtDoc(path);
    let pulledCount = 0;
    while (true) {
      const updates = await this.fetchCrdtUpdates(path, state.sequenceNumber);
      if (updates.length === 0) {
        break;
      }
      for (const update of updates) {
        const nextSequenceNumber = Number(update.sequence_number || 0);
        if (nextSequenceNumber <= state.sequenceNumber) {
          continue;
        }
        Y.applyUpdate(state.doc, base64ToUint8Array(update.update_base64), "remote");
        state.sequenceNumber = nextSequenceNumber;
        pulledCount += 1;
      }
      if (updates.length < 500) {
        break;
      }
    }

    if (pulledCount === 0) {
      return 0;
    }

    this.setCrdtSequenceNumber(path, state.sequenceNumber);
    const nextText = state.text.toString();
    const shouldSkipWrite =
      options.skipWriteWhenDirty === true && this.isCrdtDirty(path);
    if (!shouldSkipWrite) {
      await this.writeTextFileIfChanged(path, nextText);
    }
    await this.saveSettings();
    if (report) {
      report.crdtPulled = Number(report.crdtPulled || 0) + pulledCount;
    }
    return pulledCount;
  }

  setCrdtSequenceNumber(path, sequenceNumber) {
    if (!this.settings.crdtState) {
      this.settings.crdtState = { files: {} };
    }
    if (!this.settings.crdtState.files) {
      this.settings.crdtState.files = {};
    }
    const previousState = this.settings.crdtState.files[path] || {};
    this.settings.crdtState.files[path] = {
      sequenceNumber: Math.max(0, Number(sequenceNumber) || 0),
      dirty: previousState.dirty === true,
    };
  }

  setCrdtDirty(path, dirty) {
    if (!this.settings.crdtState) {
      this.settings.crdtState = { files: {} };
    }
    if (!this.settings.crdtState.files) {
      this.settings.crdtState.files = {};
    }
    const normalizedPath = normalizePath(String(path || ""));
    const previousState = this.settings.crdtState.files[normalizedPath] || {};
    this.settings.crdtState.files[normalizedPath] = {
      sequenceNumber: Math.max(0, Number(previousState.sequenceNumber) || 0),
      dirty: dirty === true,
    };
  }

  isCrdtDirty(path) {
    const fileState = this.getCrdtFileState(path);
    return Boolean(fileState && fileState.dirty);
  }

  getCrdtFileState(path) {
    return this.settings &&
      this.settings.crdtState &&
      this.settings.crdtState.files
      ? this.settings.crdtState.files[path] || null
      : null;
  }

  async writeLatestCrdtStateToFile(path, state) {
    if (!state) {
      return;
    }
    await this.writeTextFileIfChanged(path, state.text.toString());
    this.setCrdtSequenceNumber(path, state.sequenceNumber);
  }

  async writeTextFileIfChanged(path, nextText) {
    const currentText = (await this.app.vault.adapter.exists(path))
      ? await this.readTextFile(path)
      : null;
    if (currentText === nextText) {
      return;
    }
    this.crdtApplyingRemotePaths.add(path);
    try {
      await this.writeTextFile(path, nextText);
    } finally {
      this.crdtApplyingRemotePaths.delete(path);
    }
  }

  async readTextFile(path) {
    const editorText = this.getOpenEditorText(path);
    if (editorText !== null) {
      return editorText;
    }
    return this.app.vault.adapter.read(path);
  }

  async writeTextFile(path, text) {
    this.markSuppressedPath(path);
    await this.ensureParentDirectories(path);
    await this.app.vault.adapter.write(path, text);
  }

  async scanVault(previousEntries) {
    const snapshot = {};
    await this.scanDirectory("", previousEntries, snapshot);
    return snapshot;
  }

  async scanDirectory(directoryPath, previousEntries, snapshot) {
    const listing = await this.app.vault.adapter.list(directoryPath);

    for (const folderPath of listing.folders.slice().sort()) {
      const normalizedPath = normalizePath(folderPath);
      if (
        this.isPathIgnoredByPattern(normalizedPath) ||
        isConflictArtifactPath(normalizedPath)
      ) {
        continue;
      }
      const inSyncScope = this.isPathInSyncScope(normalizedPath);
      const syncScopeAncestor = this.isPathAncestorOfSyncScope(normalizedPath);
      if (!inSyncScope && !syncScopeAncestor) {
        continue;
      }
      const stat = await this.app.vault.adapter.stat(normalizedPath);
      if (inSyncScope) {
        snapshot[normalizedPath] = {
          entryType: "directory",
          contentHash: null,
          sizeBytes: 0,
          mtimeMs: stat && typeof stat.mtime === "number" ? stat.mtime : null,
        };
      }
      await this.scanDirectory(normalizedPath, previousEntries, snapshot);
    }

    for (const filePath of listing.files.slice().sort()) {
      const normalizedPath = normalizePath(filePath);
      if (this.shouldIgnorePath(normalizedPath)) {
        continue;
      }
      const entry = await this.readCurrentEntry(
        normalizedPath,
        previousEntries[normalizedPath]
      );
      if (entry) {
        snapshot[normalizedPath] = entry;
      }
    }
  }

  async readCurrentEntry(path, previousEntry) {
    const normalizedPath = normalizePath(path);
    if (this.shouldIgnorePath(normalizedPath)) {
      return null;
    }

    const stat = await this.app.vault.adapter.stat(normalizedPath);
    if (!stat) {
      return null;
    }

    const abstractFile = this.app.vault.getAbstractFileByPath(normalizedPath);
    if (abstractFile instanceof TFolder || stat.type === "folder") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: typeof stat.mtime === "number" ? stat.mtime : null,
      };
    }

    if (!(abstractFile instanceof TFile) && stat.type === "folder") {
      return {
        entryType: "directory",
        contentHash: null,
        sizeBytes: 0,
        mtimeMs: typeof stat.mtime === "number" ? stat.mtime : null,
      };
    }

    const openEditorBinary = this.getOpenEditorBinary(normalizedPath);
    const sizeBytes =
      openEditorBinary !== null ? openEditorBinary.byteLength : Number(stat.size || 0);
    const mtimeMs =
      openEditorBinary !== null ? Date.now() : typeof stat.mtime === "number" ? stat.mtime : null;
    if (
      openEditorBinary === null &&
      previousEntry &&
      previousEntry.entryType === "file" &&
      previousEntry.sizeBytes === sizeBytes &&
      previousEntry.mtimeMs === mtimeMs &&
      previousEntry.contentHash
    ) {
      return {
        entryType: "file",
        contentHash: previousEntry.contentHash,
        sizeBytes,
        mtimeMs,
      };
    }

    const binaryPayload =
      openEditorBinary !== null
        ? openEditorBinary
        : await this.app.vault.adapter.readBinary(normalizedPath);
    return {
      entryType: "file",
      contentHash: await hashBinary(binaryPayload),
      sizeBytes,
      mtimeMs,
    };
  }

  async hasUnsyncedLocalChange(path, baselineEntries) {
    const baselineEntry = baselineEntries[path] || null;
    const currentEntry = await this.readCurrentEntry(path, baselineEntry);
    if (!baselineEntry) {
      return currentEntry !== null;
    }
    if (!currentEntry) {
      return true;
    }
    return !sameSyncIdentity(baselineEntry, currentEntry);
  }

  async refreshBaselineEntry(baselineEntries, path) {
    const currentEntry = await this.readCurrentEntry(path, baselineEntries[path]);
    if (currentEntry) {
      baselineEntries[path] = currentEntry;
    } else {
      delete baselineEntries[path];
    }
  }

  async captureConflictCopy(path) {
    const stat = await this.app.vault.adapter.stat(path);
    if (!stat) {
      return;
    }

    const conflictPath = buildConflictPath(path);
    this.markSuppressedPath(conflictPath);
    if (stat.type === "folder") {
      await this.copyDirectoryRecursive(path, conflictPath);
      return;
    }

    const binaryPayload = await this.readFileBinary(path);
    await this.writeBinaryFile(conflictPath, binaryPayload);
  }

  getOpenEditorView(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.app || !this.app.workspace) {
      return null;
    }
    const markdownLeaves =
      typeof this.app.workspace.getLeavesOfType === "function"
        ? this.app.workspace.getLeavesOfType("markdown")
        : [];
    if (!Array.isArray(markdownLeaves) || markdownLeaves.length === 0) {
      return null;
    }
    for (const leaf of markdownLeaves) {
      const view = leaf && leaf.view ? leaf.view : null;
      if (!(view instanceof MarkdownView)) {
        continue;
      }
      if (!view.file || normalizePath(String(view.file.path || "")) !== normalizedPath) {
        continue;
      }
      return view;
    }
    return null;
  }

  getOpenMarkdownLeavesForPath(path) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !this.app || !this.app.workspace) {
      return [];
    }
    const markdownLeaves =
      typeof this.app.workspace.getLeavesOfType === "function"
        ? this.app.workspace.getLeavesOfType("markdown")
        : [];
    if (!Array.isArray(markdownLeaves) || markdownLeaves.length === 0) {
      return [];
    }
    const matchingLeaves = [];
    for (const leaf of markdownLeaves) {
      const view = leaf && leaf.view ? leaf.view : null;
      if (!(view instanceof MarkdownView)) {
        continue;
      }
      if (!view.file || normalizePath(String(view.file.path || "")) !== normalizedPath) {
        continue;
      }
      matchingLeaves.push({ leaf, view });
    }
    return matchingLeaves;
  }

  getOpenEditorText(path) {
    const openView = this.getOpenEditorView(path);
    if (!openView || !openView.editor || typeof openView.editor.getValue !== "function") {
      return null;
    }
    return String(openView.editor.getValue());
  }

  getOpenEditorBinary(path) {
    const editorText = this.getOpenEditorText(path);
    if (editorText === null) {
      return null;
    }
    return new TextEncoder().encode(editorText);
  }

  async readFileBinary(path) {
    const openEditorBinary = this.getOpenEditorBinary(path);
    if (openEditorBinary !== null) {
      return openEditorBinary;
    }
    return this.app.vault.adapter.readBinary(path);
  }

  async copyDirectoryRecursive(sourcePath, targetPath) {
    await this.ensureDirectory(targetPath);
    const listing = await this.app.vault.adapter.list(sourcePath);
    for (const folderPath of listing.folders.slice().sort()) {
      const folderName = folderPath.split("/").pop();
      await this.copyDirectoryRecursive(folderPath, `${targetPath}/${folderName}`);
    }
    for (const filePath of listing.files.slice().sort()) {
      const fileName = filePath.split("/").pop();
      const binaryPayload = await this.app.vault.adapter.readBinary(filePath);
      await this.writeBinaryFile(`${targetPath}/${fileName}`, binaryPayload);
    }
  }

  async writeBinaryFile(path, payload) {
    this.markSuppressedPath?.(path);
    await this.ensureParentDirectories(path);
    await this.app.vault.adapter.writeBinary(path, toArrayBuffer(payload));
    this.applyOpenEditorBinaryPayload(path, payload);
  }

  applyOpenEditorBinaryPayload(path, payload) {
    const normalizedPath = normalizePath(String(path || ""));
    if (!this.isMarkdownNotePath(normalizedPath)) {
      return false;
    }
    const openView = this.getOpenEditorView(normalizedPath);
    const editor = openView && openView.editor ? openView.editor : null;
    if (!editor || typeof editor.setValue !== "function") {
      return false;
    }

    let text;
    try {
      text = decodeUtf8(payload);
    } catch (error) {
      console.warn("[obsidian-http-sync] unable to decode open editor payload", error);
      return false;
    }

    if (typeof editor.getValue === "function" && String(editor.getValue()) === text) {
      return false;
    }

    let cursor = null;
    try {
      cursor = typeof editor.getCursor === "function" ? editor.getCursor() : null;
    } catch (error) {
      cursor = null;
    }

    const restoreReadOnly = this.isNoteLeaseReadOnly(normalizedPath);
    this.remoteEditorUpdateDepth += 1;
    try {
      if (restoreReadOnly) {
        this.setOpenEditorReadOnly(normalizedPath, false);
      }
      this.markSuppressedPath(normalizedPath);
      editor.setValue(text);
      if (cursor && typeof editor.setCursor === "function") {
        try {
          editor.setCursor(cursor);
        } catch (error) {
          // The previous cursor can be outside the updated document.
        }
      }
    } finally {
      if (restoreReadOnly) {
        this.setOpenEditorReadOnly(normalizedPath, true);
      }
      this.remoteEditorUpdateDepth = Math.max(0, this.remoteEditorUpdateDepth - 1);
    }
    return true;
  }

  async renameVaultPath(path, targetPath) {
    const sourcePath = normalizePath(String(path || ""));
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    const abstractFile =
      this.app.vault && typeof this.app.vault.getAbstractFileByPath === "function"
        ? this.app.vault.getAbstractFileByPath(sourcePath)
        : null;
    if (
      abstractFile &&
      this.app.fileManager &&
      typeof this.app.fileManager.renameFile === "function"
    ) {
      this.markSuppressedPath?.(sourcePath);
      this.markSuppressedPath?.(normalizedTargetPath);
      await this.app.fileManager.renameFile(abstractFile, normalizedTargetPath);
      return;
    }
    if (abstractFile && this.app.vault && typeof this.app.vault.rename === "function") {
      this.markSuppressedPath?.(sourcePath);
      this.markSuppressedPath?.(normalizedTargetPath);
      await this.app.vault.rename(abstractFile, normalizedTargetPath);
      return;
    }
    this.markSuppressedPath?.(sourcePath);
    this.markSuppressedPath?.(normalizedTargetPath);
    await this.app.vault.adapter.rename(sourcePath, normalizedTargetPath);
  }

  updateActiveNoteLeasePathAfterRemoteMove(path, targetPath) {
    const sourcePath = normalizePath(String(path || ""));
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    if (
      !sourcePath ||
      !normalizedTargetPath ||
      !this.activeNoteLease ||
      this.activeNoteLease.path !== sourcePath
    ) {
      return false;
    }
    this.setOpenEditorReadOnly(sourcePath, false);
    this.activeNoteLease = {
      ...this.activeNoteLease,
      path: normalizedTargetPath,
    };
    if (this.isMarkdownNotePath(normalizedTargetPath)) {
      this.setOpenEditorReadOnly(
        normalizedTargetPath,
        this.isResolvedNoteLeaseReadOnly(this.activeNoteLease)
      );
    }
    return true;
  }

  async reopenRemoteMovedMarkdownLeaves(movedMarkdownLeaves, targetPath) {
    if (!Array.isArray(movedMarkdownLeaves) || movedMarkdownLeaves.length === 0) {
      return false;
    }
    const normalizedTargetPath = normalizePath(String(targetPath || ""));
    if (!this.isMarkdownNotePath(normalizedTargetPath)) {
      return false;
    }
    const targetFile =
      this.app.vault && typeof this.app.vault.getAbstractFileByPath === "function"
        ? this.app.vault.getAbstractFileByPath(normalizedTargetPath)
        : null;
    if (!(targetFile instanceof TFile)) {
      return false;
    }

    let reopened = false;
    for (const entry of movedMarkdownLeaves) {
      const leaf = entry && entry.leaf ? entry.leaf : null;
      if (!leaf || typeof leaf.openFile !== "function") {
        continue;
      }
      try {
        await leaf.openFile(targetFile);
        reopened = true;
      } catch (error) {
        console.warn("[obsidian-http-sync] unable to reopen moved markdown leaf", error);
      }
    }
    if (reopened && this.isNoteLeaseReadOnly(normalizedTargetPath)) {
      this.setOpenEditorReadOnly(normalizedTargetPath, true);
    }
    return reopened;
  }

  async ensureDirectory(path) {
    if (await this.app.vault.adapter.exists(path)) {
      return;
    }
    await this.ensureParentDirectories(path);
    try {
      this.markSuppressedPath?.(path);
      await this.app.vault.adapter.mkdir(path);
    } catch (error) {
      if (!isAlreadyExistsError(error)) {
        throw error;
      }
    }
  }

  async ensureParentDirectories(path) {
    const normalizedPath = normalizePath(path);
    const segments = normalizedPath.split("/");
    segments.pop();
    let currentPath = "";
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      if (!currentPath) {
        continue;
      }
      if (!(await this.app.vault.adapter.exists(currentPath))) {
        try {
          this.markSuppressedPath?.(currentPath);
          await this.app.vault.adapter.mkdir(currentPath);
        } catch (error) {
          if (!isAlreadyExistsError(error)) {
            throw error;
          }
        }
      }
    }
  }

  async removePath(path) {
    const stat = await this.app.vault.adapter.stat(path);
    if (!stat) {
      return;
    }
    this.markSuppressedPath?.(path);
    if (stat.type === "folder") {
      await this.app.vault.adapter.rmdir(path, true);
      return;
    }
    await this.app.vault.adapter.remove(path);
  }

  shouldIgnorePath(path) {
    const normalizedPath = normalizePath(path);
    if (isConflictArtifactPath(normalizedPath)) {
      return true;
    }
    if (!this.isPathInSyncScope(normalizedPath)) {
      return true;
    }
    return this.isPathIgnoredByPattern(normalizedPath);
  }

  shouldUseCrdtForPath(path) {
    if (!this.settings.crdtMarkdownEnabled) {
      return false;
    }
    const normalizedPath = normalizePath(String(path || ""));
    if (!normalizedPath || !normalizedPath.toLowerCase().endsWith(".md")) {
      return false;
    }
    if (isRootObsidianConfigPath(normalizedPath)) {
      return false;
    }
    if (isConflictArtifactPath(normalizedPath) || this.isPathIgnoredByPattern(normalizedPath)) {
      return false;
    }
    return this.isPathInSyncScope(normalizedPath);
  }

  isPathIgnoredByPattern(path) {
    const normalizedPath = normalizePath(path);
    if (isNestedObsidianConfigPath(normalizedPath)) {
      return true;
    }
    if (isRootObsidianConfigPath(normalizedPath)) {
      if (this.settings.syncObsidianConfig !== true) {
        return true;
      }
      if (isAlwaysLocalObsidianConfigPath(normalizedPath)) {
        return true;
      }
    } else if (hasIgnoredPathSegment(normalizedPath, DEFAULT_IGNORE_PATH_SEGMENTS)) {
      return true;
    }
    const ignorePaths = Array.isArray(this.settings.ignorePaths)
      ? this.settings.ignorePaths
      : DEFAULT_IGNORE_PATHS;
    return ignorePaths.some((pattern) => {
      const normalizedPattern = String(pattern || "").replace(/\\/g, "/").replace(/^\.?\//, "");
      if (!normalizedPattern) {
        return false;
      }
      if (
        this.settings.syncObsidianConfig === true &&
        normalizedPattern === `${OBSIDIAN_CONFIG_DIR}/`
      ) {
        return false;
      }
      if (normalizedPattern.endsWith("/")) {
        const prefix = normalizedPattern.slice(0, -1);
        return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
      }
      return normalizedPath === normalizedPattern;
    });
  }

  getSyncFolderPaths() {
    return normalizeSyncFolderPathList(this.settings.syncFolderPaths);
  }

  isPathInSyncScope(path) {
    const normalizedPath = normalizePluginPath(path);
    const syncFolders = this.getSyncFolderPaths();
    if (syncFolders.includes("")) {
      return true;
    }
    return syncFolders.some(
      (folderPath) =>
        normalizedPath === folderPath || normalizedPath.startsWith(`${folderPath}/`)
    );
  }

  isPathAncestorOfSyncScope(path) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath) {
      return true;
    }
    const syncFolders = this.getSyncFolderPaths();
    if (syncFolders.includes("")) {
      return true;
    }
    return syncFolders.some((folderPath) => folderPath.startsWith(`${normalizedPath}/`));
  }

  partitionDirectoryDeletes(directoryDeletes, moves) {
    const sourcePrefixes = new Set();
    for (const move of moves) {
      const normalizedPath = normalizePath(move.path);
      const segments = normalizedPath.split("/").filter(Boolean);
      segments.pop();
      let currentPath = "";
      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        sourcePrefixes.add(currentPath);
      }
    }

    const beforeMoves = [];
    const afterMoves = [];
    for (const path of directoryDeletes) {
      if (sourcePrefixes.has(normalizePath(path))) {
        afterMoves.push(path);
      } else {
        beforeMoves.push(path);
      }
    }
    return { beforeMoves, afterMoves };
  }

  markSuppressedPath(path) {
    const normalizedPath = String(path || "").trim() ? normalizePath(path) : "";
    if (!normalizedPath) {
      return;
    }
    const expiresAt = Date.now() + SUPPRESSED_EVENT_TTL_MS;
    const segments = normalizedPath.split("/").filter(Boolean);
    let currentPath = "";
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      this.suppressedPaths.set(currentPath, expiresAt);
    }
  }

  shouldSuppressEventPath(path) {
    const normalizedPath = String(path || "").trim() ? normalizePath(path) : "";
    if (!normalizedPath) {
      return false;
    }
    const now = Date.now();
    for (const [suppressedPath, expiresAt] of Array.from(this.suppressedPaths.entries())) {
      if (expiresAt <= now) {
        this.suppressedPaths.delete(suppressedPath);
        continue;
      }
      if (
        normalizedPath === suppressedPath ||
        normalizedPath.startsWith(`${suppressedPath}/`) ||
        suppressedPath.startsWith(`${normalizedPath}/`)
      ) {
        return true;
      }
    }
    return false;
  }

  async requestJson(method, path, jsonBody = null, binaryBody = null, headers = {}) {
    const response = await this.request(method, path, jsonBody, binaryBody, headers);
    if (response.contentType !== "application/json") {
      throw new Error(this.t("error.expectedJson"));
    }
    return response.body;
  }

  async requestBinary(method, path, headers = {}) {
    const response = await this.request(method, path, null, null, headers, {
      responseType: "binary",
    });
    return response.body;
  }

  async request(method, path, jsonBody = null, binaryBody = null, headers = {}, options = {}) {
    const requestHeaders = { ...headers };
    if (!requestHeaders.Authorization && this.settings.accessToken) {
      requestHeaders.Authorization = `Bearer ${this.settings.accessToken}`;
    }
    let body = undefined;
    if (jsonBody !== null) {
      body = JSON.stringify(jsonBody);
      requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    } else if (binaryBody !== null) {
      body = binaryBody;
      requestHeaders["Content-Type"] =
        requestHeaders["Content-Type"] || "application/octet-stream";
    }

    const baseUrl = String(this.settings.baseUrl || "").replace(/\/+$/, "");
    const performRequest = async (resolvedHeaders) =>
      performObsidianRequest({
        url: `${baseUrl}${path}`,
        method,
        headers: { ...resolvedHeaders },
        body,
      });

    let response = await performRequest(requestHeaders);
    let refreshAttempted = false;
    if (
      response.status === 401 &&
      path !== "/auth/refresh" &&
      this.settings.refreshToken
    ) {
      refreshAttempted = true;
      const refreshed = await this.tryRefreshAuthSession(baseUrl);
      if (refreshed) {
        const retryHeaders = { ...requestHeaders };
        if (this.settings.accessToken) {
          retryHeaders.Authorization = `Bearer ${this.settings.accessToken}`;
        }
        response = await performRequest(retryHeaders);
      }
    }

    const contentTypeHeader = getResponseHeader(response.headers, "content-type") || "";
    const declaredContentType =
      contentTypeHeader.split(";")[0].trim() || "application/octet-stream";
    const parsedResponse =
      options.responseType === "binary" && isSuccessfulStatus(response.status)
        ? {
            contentType: "application/octet-stream",
            payload: getBinaryResponsePayload(response),
          }
        : parseResponsePayload(response, declaredContentType);
    const contentType = parsedResponse.contentType;
    const payload = parsedResponse.payload;

    if (!isSuccessfulStatus(response.status)) {
      const errorMessage =
        contentType === "application/json" && payload && payload.error === "sync_blocked_billing"
          ? buildSyncBlockedBillingMessage(this, payload)
          : contentType === "application/json" && payload && payload.user_message
            ? String(payload.user_message)
            : contentType === "application/json" && payload && payload.message
              ? payload.message
              : `HTTP ${response.status}`;
      const error = new Error(
        errorMessage
      );
      error.statusCode = response.status;
      error.payload = contentType === "application/json" ? payload : {};
      if (refreshAttempted) {
        error._refreshAttempted = true;
      }
      throw error;
    }

    return {
      statusCode: response.status,
      contentType,
      body: payload,
      headers: response.headers,
    };
  }

  async tryRefreshAuthSession(baseUrl) {
    const refreshToken = String(this.settings.refreshToken || "").trim();
    if (!refreshToken) {
      this.settings.authState = {
        status: AUTH_STATUS.MISSING_TOKEN,
        reason: SYNC_BLOCK_REASON.MISSING_TOKEN,
        lastChecked: new Date().toISOString(),
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.MISSING_TOKEN;
      this.saveSettings().catch(() => {});
      return false;
    }

    try {
      const response = await performObsidianRequest({
        url: `${baseUrl}/auth/refresh`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!isSuccessfulStatus(response.status)) {
        this.settings.authState = {
          status: AUTH_STATUS.SESSION_EXPIRED,
          reason: SYNC_BLOCK_REASON.SESSION_EXPIRED,
          lastChecked: new Date().toISOString(),
        };
        this.settings.syncBlockReason = SYNC_BLOCK_REASON.SESSION_EXPIRED;
        this.saveSettings().catch(() => {});
        return false;
      }
      const payload =
        response.json !== undefined
          ? response.json
          : response.text
            ? JSON.parse(response.text)
            : {};
      if (!payload || !payload.access_token || !payload.refresh_token) {
        this.settings.authState = {
          status: AUTH_STATUS.REFRESH_FAILED,
          reason: SYNC_BLOCK_REASON.REFRESH_FAILED,
          lastChecked: new Date().toISOString(),
        };
        this.settings.syncBlockReason = SYNC_BLOCK_REASON.REFRESH_FAILED;
        this.saveSettings().catch(() => {});
        return false;
      }
      this.settings.accessToken = payload.access_token;
      this.settings.refreshToken = payload.refresh_token;
      this.settings.authState = {
        status: AUTH_STATUS.AUTHENTICATED,
        reason: "",
        lastChecked: new Date().toISOString(),
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.NONE;
      this.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
      await this.saveSettings();
      return true;
    } catch (_) {
      this.settings.authState = {
        status: AUTH_STATUS.REFRESH_FAILED,
        reason: SYNC_BLOCK_REASON.REFRESH_FAILED,
        lastChecked: new Date().toISOString(),
      };
      this.settings.syncBlockReason = SYNC_BLOCK_REASON.REFRESH_FAILED;
      this.saveSettings().catch(() => {});
      return false;
    }
  }

  async fetchConflicts() {
    if (!this.isConfigured()) {
      return [];
    }
    const response = await this.request(
      "GET",
      `/vaults/${encodeURIComponent(this.settings.vaultId)}/conflicts?status=open&limit=${CONFLICT_FETCH_LIMIT}`
    );
    const body = response.body;
    if (body && Array.isArray(body.conflicts)) {
      return body.conflicts;
    }
    if (Array.isArray(body)) {
      return body;
    }
    return [];
  }

  async syncConflictState() {
    const previousConflicts = this.settings.conflicts || {};
    const previousItems = previousConflicts.items || {};
    try {
      const conflicts = await this.fetchConflicts();
      const openConflicts = conflicts.filter(
        (c) => c && c.status === "open"
      );
      const nextItems = {};
      for (const conflict of openConflicts) {
        if (conflict && conflict.id) {
          const previousItem = previousItems[conflict.id] || {};
          nextItems[conflict.id] = {
            id: conflict.id,
            path: conflict.path || "",
            target_path: conflict.target_path || "",
            entry_type: conflict.entry_type || "",
            operation_type: conflict.operation_type || "",
            reason: conflict.reason || "",
            status: conflict.status || "open",
            created_at: conflict.created_at || "",
            device_id: conflict.device_id || "",
            expected_content_hash:
              conflict.expected_content_hash !== null &&
              conflict.expected_content_hash !== undefined
                ? String(conflict.expected_content_hash)
                : null,
            actual_content_hash:
              conflict.actual_content_hash !== null &&
              conflict.actual_content_hash !== undefined
                ? String(conflict.actual_content_hash)
                : null,
            resolved_at: conflict.resolved_at || "",
            resolution: conflict.resolution || "",
            resolved_by_device_id: conflict.resolved_by_device_id || "",
            materialized_remote_path: previousItem.materialized_remote_path || "",
            materialized_remote_content_hash:
              previousItem.materialized_remote_content_hash || "",
          };
        }
      }
      const nextConflictState = {
        items: nextItems,
        lastFetchedAt: new Date().toISOString(),
        lastError: "",
      };
      const shouldSave = (
        JSON.stringify(previousItems) !== JSON.stringify(nextItems) ||
        previousConflicts.lastError !== ""
      );
      this.settings.conflicts = nextConflictState;
      if (shouldSave) {
        await this.saveSettings();
      }
      return openConflicts;
    } catch (error) {
      const nextLastError = error && error.message ? error.message : String(error);
      this.settings.conflicts = {
        items: previousItems,
        lastFetchedAt: previousConflicts.lastFetchedAt || null,
        lastError: nextLastError,
      };
      if (previousConflicts.lastError !== nextLastError) {
        await this.saveSettings();
      }
      throw error;
    }
  }

  getCachedOpenConflicts() {
    return Object.values((this.settings.conflicts && this.settings.conflicts.items) || {}).filter(
      (conflict) => conflict && conflict.status === "open"
    );
  }

  isConflictResolutionSupported(conflict) {
    if (!conflict || conflict.status !== "open") {
      return false;
    }
    const entryType = String(conflict.entry_type || "file");
    const operationType = String(conflict.operation_type || "");
    if (entryType !== "file") {
      return false;
    }
    if (operationType === "upsert") {
      return (
        !this.shouldUseCrdtForPath(conflict.path || "") ||
        this.isHashMismatchConflict(conflict) ||
        this.isMissingBaseConflict(conflict)
      );
    }
    return operationType === "delete" && this.isHashMismatchConflict(conflict);
  }

  isHashMismatchConflict(conflict) {
    return String(conflict && conflict.reason ? conflict.reason : "") === "base_content_hash_mismatch";
  }

  isMissingBaseConflict(conflict) {
    return String(conflict && conflict.reason ? conflict.reason : "") === "missing_base_for_existing_path";
  }

  isMoveTargetOccupiedConflict(conflict) {
    return (
      conflict &&
      conflict.status === "open" &&
      String(conflict.entry_type || "file") === "file" &&
      String(conflict.operation_type || "") === "move" &&
      String(conflict.reason || "") === "target_path_occupied" &&
      Boolean(conflict.path) &&
      Boolean(conflict.target_path)
    );
  }

  isDeleteHashMismatchConflict(conflict) {
    return (
      this.isHashMismatchConflict(conflict) &&
      String(conflict && conflict.entry_type ? conflict.entry_type : "file") === "file" &&
      String(conflict && conflict.operation_type ? conflict.operation_type : "") === "delete"
    );
  }

  assertConflictResolutionSupported(conflict) {
    if (this.isConflictResolutionSupported(conflict)) {
      return;
    }
    throw new Error(
      this.t("error.unsupportedConflictResolution", {
        entryType: String(conflict && conflict.entry_type ? conflict.entry_type : "unknown"),
        operationType: String(
          conflict && conflict.operation_type ? conflict.operation_type : "unknown"
        ),
      })
    );
  }

  getOpenConflictCount() {
    const items = this.settings.conflicts && this.settings.conflicts.items
      ? this.settings.conflicts.items
      : {};
    return Object.keys(items).length;
  }

  async resolveConflict(conflictOrId, resolution) {
    const conflict =
      conflictOrId && typeof conflictOrId === "object" ? conflictOrId : null;
    const conflictId = String(conflict ? conflict.id || "" : conflictOrId || "").trim();
    if (!conflictId) {
      throw new Error("Conflict has no id");
    }
    const body = {
      resolved_by_device_id: this.settings.deviceId,
      resolution,
    };
    const paths = [];
    const vaultId = String(this.settings.vaultId || "").trim();
    if (vaultId) {
      paths.push(
        `/vaults/${encodeURIComponent(vaultId)}/conflicts/${encodeURIComponent(conflictId)}/resolve`
      );
    }
    paths.push(`/conflicts/${encodeURIComponent(conflictId)}/resolve`);

    let notFoundError = null;
    for (const path of paths) {
      try {
        const payload = await this.requestJson("POST", path, body);
        return payload && payload.conflict ? payload.conflict : null;
      } catch (error) {
        if (Number(error && error.statusCode) === 404) {
          notFoundError = error;
          continue;
        }
        throw error;
      }
    }

    if (conflict) {
      const refreshedConflict = await this.findMatchingOpenConflict(conflict);
      if (!refreshedConflict) {
        return {
          ...conflict,
          status: "resolved",
          resolution,
          resolved_by_device_id: this.settings.deviceId || "",
        };
      }
      if (refreshedConflict.id && refreshedConflict.id !== conflictId) {
        return this.resolveConflict(refreshedConflict, resolution);
      }
    }
    throw notFoundError || new Error("HTTP 404");
  }

  async finalizeConflictResolution(conflict, resolution) {
    const resolvedConflict = await this.resolveConflict(conflict, resolution);
    const conflictId = String(conflict && conflict.id ? conflict.id : "").trim();
    if (
      conflictId &&
      this.settings.conflicts &&
      this.settings.conflicts.items
    ) {
      delete this.settings.conflicts.items[conflictId];
      this.settings.conflicts.lastError = "";
      this.settings.conflicts.lastFetchedAt = new Date().toISOString();
    }
    try {
      await this.syncConflictState();
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] conflict resolved but refresh failed",
        error
      );
    }
    await this.saveSettings();
    return resolvedConflict;
  }

  async findMatchingOpenConflict(conflict) {
    const conflicts = await this.syncConflictState();
    return conflicts.find((candidate) => this.isSameConflictIdentity(candidate, conflict)) || null;
  }

  isSameConflictIdentity(left, right) {
    if (!left || !right) {
      return false;
    }
    if (left.id && right.id && left.id === right.id) {
      return true;
    }
    return (
      normalizePath(String(left.path || "")) === normalizePath(String(right.path || "")) &&
      String(left.target_path || "") === String(right.target_path || "") &&
      String(left.operation_type || "") === String(right.operation_type || "") &&
      String(left.entry_type || "file") === String(right.entry_type || "file") &&
      String(left.reason || "") === String(right.reason || "")
    );
  }

  async fetchRemoteFileEntry(path) {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath) {
      return null;
    }

    try {
      const historyPayload = await this.requestJson(
        "GET",
        `/vaults/${this.settings.vaultId}/file-history?path=${encodeURIComponent(normalizedPath)}&limit=1`
      );
      const versions = Array.isArray(historyPayload.versions)
        ? historyPayload.versions
        : [];
      const latestVersion = versions[0] || null;
      if (latestVersion) {
        return {
          path: normalizedPath,
          entry_type: String(latestVersion.entry_type || "file"),
          current_content_hash:
            latestVersion.content_hash !== null &&
            latestVersion.content_hash !== undefined
              ? String(latestVersion.content_hash)
              : null,
          current_size_bytes: Number(latestVersion.size_bytes || 0),
          is_deleted:
            Boolean(latestVersion.is_deleted) ||
            String(latestVersion.operation_type || "") === "delete",
          latest_version_number: Number(
            latestVersion.version_number ||
              latestVersion.sequence_number ||
              0
          ),
        };
      }
    } catch (error) {
      if (Number(error && error.statusCode) !== 404) {
        throw error;
      }
    }

    const payload = await this.requestJson(
      "GET",
      `/vaults/${this.settings.vaultId}/files?include_deleted=false&limit=1000`
    );
    const files = Array.isArray(payload.files) ? payload.files : [];
    const currentEntry = files.find(
      (entry) => normalizePath(String(entry.path || "")) === normalizedPath
    );
    if (!currentEntry) {
      return null;
    }

    return {
      path: normalizedPath,
      entry_type: String(currentEntry.entry_type || "file"),
      current_content_hash:
        currentEntry.current_content_hash !== null &&
        currentEntry.current_content_hash !== undefined
          ? String(currentEntry.current_content_hash)
          : null,
      current_size_bytes: Number(currentEntry.current_size_bytes || 0),
      is_deleted: Boolean(currentEntry.is_deleted),
      latest_version_number: Number(currentEntry.latest_version_number || 0),
    };
  }

  async getConflictRemoteEntry(conflict) {
    const path = conflict && conflict.path ? normalizePath(conflict.path) : "";
    if (!path) {
      return null;
    }
    try {
      const remoteEntry = await this.fetchRemoteFileEntry(path);
      if (remoteEntry) {
        return remoteEntry;
      }
    } catch (error) {
      if (Number(error && error.statusCode) !== 404) {
        throw error;
      }
    }
    const actualContentHash =
      conflict &&
      conflict.actual_content_hash !== null &&
      conflict.actual_content_hash !== undefined
        ? String(conflict.actual_content_hash || "").trim()
        : "";
    if (!actualContentHash) {
      return null;
    }
    return {
      path,
      entry_type: String((conflict && conflict.entry_type) || "file"),
      current_content_hash: actualContentHash,
      current_size_bytes: 0,
      is_deleted: false,
      latest_version_number: Number(
        (conflict && conflict.actual_sequence_number) || 0
      ),
    };
  }

  async downloadConflictRemoteContent(conflict, remoteEntry) {
    try {
      return await this.downloadRemoteContent(remoteEntry.current_content_hash);
    } catch (error) {
      if (!isMissingRemoteObjectContentError(error)) {
        throw error;
      }
      const path = String((conflict && conflict.path) || "");
      const useLocal =
        typeof confirm === "function" &&
        confirm(this.t("confirm.remoteConflictContentMissingUseLocal", { path }));
      if (!useLocal) {
        throw new Error(
          this.t("error.remoteConflictContentMissing", { path })
        );
      }
      await this.resolveKeepLocal(conflict);
      return null;
    }
  }

  async downloadRemoteContent(contentHash) {
    const requestedContentHash = String(contentHash || "").trim();
    try {
      return await this.requestBinary(
        "GET",
        `/vaults/${this.settings.vaultId}/objects/${requestedContentHash}/content`
      );
    } catch (error) {
      const normalizedContentHash = normalizeContentHashForCompare(requestedContentHash);
      if (
        isMissingRemoteObjectContentError(error) &&
        normalizedContentHash &&
        normalizedContentHash !== requestedContentHash
      ) {
        return this.requestBinary(
          "GET",
          `/vaults/${this.settings.vaultId}/objects/${normalizedContentHash}/content`
        );
      }
      throw error;
    }
  }

  async downloadRemoteContentForSync(contentHash, context, path = null, report = null) {
    try {
      return await this.downloadRemoteContent(contentHash);
    } catch (error) {
      if (isMissingRemoteObjectContentError(error)) {
        const pathSuffix = path ? ` for ${path}` : "";
        console.warn(
          `[obsidian-http-sync] missing remote object content${pathSuffix} during ${context}: ${contentHash}`,
          error
        );
        if (report && typeof report === "object") {
          report.missingRemoteObjectContent =
            Number(report.missingRemoteObjectContent || 0) + 1;
          if (!report.divergenceWarning) {
            report.divergenceWarning = "missing_remote_object_content";
          }
        }
        return null;
      }
      throw error;
    }
  }

  async resolveKeepLocal(conflict) {
    if (
      typeof this.isMoveTargetOccupiedConflict === "function" &&
      this.isMoveTargetOccupiedConflict(conflict)
    ) {
      return this.resolveKeepLocalMoveTargetOccupied(conflict);
    }
    this.assertConflictResolutionSupported(conflict);
    if (this.isDeleteHashMismatchConflict(conflict)) {
      return this.resolveKeepLocalDeleteHashMismatch(conflict);
    }
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }
    if (!(await this.app.vault.adapter.exists(path))) {
      return this.resolveKeepLocalDeleteHashMismatch(conflict);
    }

    const remoteEntry = await this.fetchRemoteFileEntry(path);
    const binaryPayload = await this.readFileBinary(path);
    const localContentHash = await hashBinary(binaryPayload);
    const localSizeBytes = binaryPayload.byteLength || binaryPayload.length || 0;

    if (
      remoteEntry &&
      !remoteEntry.is_deleted &&
      remoteEntry.current_content_hash === localContentHash &&
      Number(remoteEntry.current_size_bytes || 0) === localSizeBytes
    ) {
      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: localContentHash,
          sizeBytes: localSizeBytes,
          mtimeMs: Date.now(),
        };
      }
      await this.finalizeConflictResolution(conflict, "keep_local");
      return true;
    }

    const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
      vault_id: this.settings.vaultId,
      device_id: this.settings.deviceId,
      direction: "bidirectional",
    });
    const sessionId = sessionPayload.sync_session.id;

    try {
      const uploadPayload = await this.requestJson(
        "POST",
        `/sync-sessions/${sessionId}/objects`,
        null,
        toArrayBuffer(binaryPayload),
        { "Content-Type": "application/octet-stream" }
      );

      const previousSize =
        remoteEntry && !remoteEntry.is_deleted
          ? Number(remoteEntry.current_size_bytes || 0)
          : 0;
      const baseContentHash =
        remoteEntry && !remoteEntry.is_deleted
          ? remoteEntry.current_content_hash || null
          : null;

      await this.recordGuardedOperation(
        sessionId,
        {
          client_operation_id: generateClientOperationId(),
          operation_type: "upsert",
          entry_type: "file",
          path,
          storage_delta_bytes: localSizeBytes - previousSize,
          content_hash: uploadPayload.object.content_hash,
          base_content_hash: baseContentHash,
        },
        this.createSyncReport(),
        {
          operationSource: "conflict_resolution",
          manualOverride: true,
          allowedPaths: [path],
        }
      );

      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed",
      });

      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: uploadPayload.object.content_hash,
          sizeBytes: localSizeBytes,
          mtimeMs: Date.now(),
        };
      }

      await this.finalizeConflictResolution(conflict, "keep_local");

      return true;
    } catch (error) {
      try {
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "cancelled",
          error_message: String(error.message || "").slice(0, 500),
        });
      } catch (_e) {
        // best-effort cleanup
      }
      throw error;
    }
  }

  async resolveKeepLocalDeleteHashMismatch(conflict) {
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }

    const remoteEntry = await this.fetchRemoteFileEntry(path);
    if (remoteEntry && !remoteEntry.is_deleted && remoteEntry.current_content_hash) {
      const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
        vault_id: this.settings.vaultId,
        device_id: this.settings.deviceId,
        direction: "bidirectional",
      });
      const sessionId = sessionPayload.sync_session.id;

      try {
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "delete",
            entry_type: "file",
            path,
            storage_delta_bytes: -Number(remoteEntry.current_size_bytes || 0),
            base_content_hash: remoteEntry.current_content_hash || null,
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [path],
          }
        );

        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "completed",
        });
      } catch (error) {
        try {
          await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
            status: "cancelled",
            error_message: String(error.message || "").slice(0, 500),
          });
        } catch (_e) {
          // best-effort cleanup
        }
        throw error;
      }
    }

    if (await this.app.vault.adapter.exists(path)) {
      this.markSuppressedPath(path);
      await this.removePath(path);
    }
    if (this.settings.state && this.settings.state.entries) {
      delete this.settings.state.entries[path];
    }

    await this.finalizeConflictResolution(conflict, "keep_local");

    return true;
  }

  async resolveKeepLocalMoveTargetOccupied(conflict) {
    const sourcePath = conflict.path;
    const targetPath = conflict.target_path;
    if (!sourcePath || !targetPath) {
      throw new Error("Conflict has no path");
    }
    if (!(await this.app.vault.adapter.exists(targetPath))) {
      throw new Error(this.t("error.localFileNotFound", { path: targetPath }));
    }

    const remoteTargetEntry = await this.fetchRemoteFileEntry(targetPath);
    const remoteSourceEntry = await this.fetchRemoteFileEntry(sourcePath);
    const binaryPayload = await this.readFileBinary(targetPath);
    const localContentHash = await hashBinary(binaryPayload);
    const localSizeBytes = binaryPayload.byteLength || binaryPayload.length || 0;

    const sessionPayload = await this.requestJson("POST", "/sync-sessions", {
      vault_id: this.settings.vaultId,
      device_id: this.settings.deviceId,
      direction: "bidirectional",
    });
    const sessionId = sessionPayload.sync_session.id;

    try {
      if (
        !remoteTargetEntry ||
        remoteTargetEntry.is_deleted ||
        remoteTargetEntry.current_content_hash !== localContentHash ||
        Number(remoteTargetEntry.current_size_bytes || 0) !== localSizeBytes
      ) {
        const uploadPayload = await this.requestJson(
          "POST",
          `/sync-sessions/${sessionId}/objects`,
          null,
          toArrayBuffer(binaryPayload),
          { "Content-Type": "application/octet-stream" }
        );
        const previousSize =
          remoteTargetEntry && !remoteTargetEntry.is_deleted
            ? Number(remoteTargetEntry.current_size_bytes || 0)
            : 0;
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "upsert",
            entry_type: "file",
            path: targetPath,
            storage_delta_bytes: localSizeBytes - previousSize,
            content_hash: uploadPayload.object.content_hash,
            base_content_hash:
              remoteTargetEntry && !remoteTargetEntry.is_deleted
                ? remoteTargetEntry.current_content_hash || null
                : null,
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [sourcePath, targetPath],
          }
        );
      }

      if (
        sourcePath !== targetPath &&
        remoteSourceEntry &&
        !remoteSourceEntry.is_deleted &&
        remoteSourceEntry.current_content_hash
      ) {
        await this.recordGuardedOperation(
          sessionId,
          {
            client_operation_id: generateClientOperationId(),
            operation_type: "delete",
            entry_type: "file",
            path: sourcePath,
            storage_delta_bytes: -Number(remoteSourceEntry.current_size_bytes || 0),
            base_content_hash: remoteSourceEntry.current_content_hash || null,
          },
          this.createSyncReport(),
          {
            operationSource: "conflict_resolution",
            manualOverride: true,
            allowedPaths: [sourcePath, targetPath],
          }
        );
      }

      await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
        status: "completed",
      });
    } catch (error) {
      try {
        await this.requestJson("PATCH", `/sync-sessions/${sessionId}`, {
          status: "cancelled",
          error_message: String(error.message || "").slice(0, 500),
        });
      } catch (_e) {
        // best-effort cleanup
      }
      throw error;
    }

    if (this.settings.state && this.settings.state.entries) {
      this.settings.state.entries[targetPath] = {
        entryType: "file",
        contentHash: localContentHash,
        sizeBytes: localSizeBytes,
        mtimeMs: Date.now(),
      };
      delete this.settings.state.entries[sourcePath];
    }
    this.clearPendingDeletePath(targetPath);
    this.clearPendingRenameHintForPath(targetPath);

    await this.finalizeConflictResolution(conflict, "keep_local");

    return true;
  }

  async resolveAcceptRemote(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }

    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (!remoteEntry || remoteEntry.is_deleted || !remoteEntry.current_content_hash) {
      // Remote file was deleted - remove local and resolve
      if (await this.app.vault.adapter.exists(path)) {
        await this.captureConflictCopy(path);
        this.markSuppressedPath(path);
        await this.removePath(path);
      }
      if (this.settings.state && this.settings.state.entries) {
        delete this.settings.state.entries[path];
      }
      await this.finalizeConflictResolution(conflict, "accept_remote");
      return true;
    }

    // Preserve safety copy if local file has user changes
    const localExists = await this.app.vault.adapter.exists(path);
    if (localExists) {
      await this.captureConflictCopy(path);
    }

    // Download and apply remote version
    const binaryResponse = await this.downloadConflictRemoteContent(
      conflict,
      remoteEntry
    );
    if (binaryResponse === null) {
      return true;
    }
    this.markSuppressedPath(path);
    await this.writeBinaryFile(path, binaryResponse);

    // Update local state
    if (this.settings.state && this.settings.state.entries) {
      this.settings.state.entries[path] = {
        entryType: "file",
        contentHash: remoteEntry.current_content_hash,
        sizeBytes:
          binaryResponse.byteLength ||
          binaryResponse.length ||
          Number(remoteEntry.current_size_bytes || 0),
        mtimeMs: Date.now(),
      };
    }

    await this.finalizeConflictResolution(conflict, "accept_remote");

    return true;
  }

  async resolveKeepBoth(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict.path;
    if (!path) {
      throw new Error("Conflict has no path");
    }

    // Ensure a conflict copy exists before overwriting canonical path
    if (await this.app.vault.adapter.exists(path)) {
      await this.captureConflictCopy(path);
    }

    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (remoteEntry && !remoteEntry.is_deleted && remoteEntry.current_content_hash) {
      const binaryResponse = await this.downloadConflictRemoteContent(
        conflict,
        remoteEntry
      );
      if (binaryResponse === null) {
        return true;
      }
      this.markSuppressedPath(path);
      await this.writeBinaryFile(path, binaryResponse);

      if (this.settings.state && this.settings.state.entries) {
        this.settings.state.entries[path] = {
          entryType: "file",
          contentHash: remoteEntry.current_content_hash,
          sizeBytes:
            binaryResponse.byteLength ||
            binaryResponse.length ||
            Number(remoteEntry.current_size_bytes || 0),
          mtimeMs: Date.now(),
        };
      }
    } else {
      // Remote was deleted - remove local if it exists (but conflict copy is preserved)
      if (await this.app.vault.adapter.exists(path)) {
        this.markSuppressedPath(path);
        await this.removePath(path);
      }
      if (this.settings.state && this.settings.state.entries) {
        delete this.settings.state.entries[path];
      }
    }

    await this.finalizeConflictResolution(conflict, "keep_both");

    return true;
  }

  async materializeRemoteVersion(conflict) {
    this.assertConflictResolutionSupported(conflict);
    const path = conflict && conflict.path ? conflict.path : "";
    if (!path) {
      throw new Error("Path is required for remote materialization");
    }

    const remoteEntry = await this.getConflictRemoteEntry(conflict);
    if (!remoteEntry || remoteEntry.is_deleted || !remoteEntry.current_content_hash) {
      throw new Error(
        this.t("error.remoteFileNotAvailable", { path })
      );
    }

    const binaryResponse = await this.downloadRemoteContent(
      remoteEntry.current_content_hash
    );
    const conflictId = String(conflict.id || "");
    const cachedConflict =
      conflictId && this.settings.conflicts && this.settings.conflicts.items
        ? this.settings.conflicts.items[conflictId] || null
        : null;
    const cachedMaterializedPath = cachedConflict && cachedConflict.materialized_remote_path
      ? String(cachedConflict.materialized_remote_path)
      : "";
    if (
      cachedMaterializedPath &&
      cachedConflict.materialized_remote_content_hash === remoteEntry.current_content_hash &&
      await this.app.vault.adapter.exists(cachedMaterializedPath)
    ) {
      return cachedMaterializedPath;
    }

    const normalizedPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
    const lastSlashIndex = normalizedPath.lastIndexOf("/");
    const baseName =
      lastSlashIndex >= 0
        ? normalizedPath.slice(lastSlashIndex + 1)
        : normalizedPath;
    const parentPath =
      lastSlashIndex >= 0 ? normalizedPath.slice(0, lastSlashIndex) : "";
    const materializeRoot = ".sync-conflict-local/remote-copies";
    const hashSuffix = String(remoteEntry.current_content_hash || "")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(-12) || "remote";
    const materializeName = `${baseName}.remote-${hashSuffix}`;
    const materializePath = parentPath
      ? `${materializeRoot}/${conflictId || "unknown-conflict"}/${parentPath}/${materializeName}`
      : `${materializeRoot}/${conflictId || "unknown-conflict"}/${materializeName}`;

    this.markSuppressedPath(materializePath);
    await this.writeBinaryFile(materializePath, binaryResponse);
    if (conflictId && this.settings.conflicts && this.settings.conflicts.items) {
      this.settings.conflicts.items[conflictId] = {
        ...(this.settings.conflicts.items[conflictId] || {}),
        materialized_remote_path: materializePath,
        materialized_remote_content_hash: remoteEntry.current_content_hash,
      };
      await this.saveSettings();
    }

    return materializePath;
  }

  getCurrentPluginVersion() {
    const manifestVersion =
      this.manifest && this.manifest.version ? String(this.manifest.version).trim() : "";
    return manifestVersion || PLUGIN_VERSION;
  }

  getCurrentPluginBuildId() {
    return PLUGIN_BUILD_ID;
  }

  getPluginInstallDir() {
    const manifestDir =
      this.manifest && this.manifest.dir ? normalizePath(String(this.manifest.dir)) : "";
    const configDir =
      this.app && this.app.vault && this.app.vault.configDir
        ? normalizePath(String(this.app.vault.configDir))
        : ".obsidian";
    const pluginId =
      this.manifest && this.manifest.id ? String(this.manifest.id) : PLUGIN_ID;
    if (manifestDir) {
      const cleanManifestDir = manifestDir.replace(/\/+$/, "");
      if (cleanManifestDir === pluginId || !cleanManifestDir.includes("/")) {
        return normalizePath(`${configDir}/plugins/${cleanManifestDir}`).replace(/\/+$/, "");
      }
      if (cleanManifestDir.startsWith("plugins/")) {
        return normalizePath(`${configDir}/${cleanManifestDir}`).replace(/\/+$/, "");
      }
      return cleanManifestDir;
    }
    return normalizePath(`${configDir}/plugins/${pluginId}`);
  }

  applyInstalledPluginManifest(manifest) {
    if (!manifest || String(manifest.id || "").trim() !== PLUGIN_ID) {
      return false;
    }
    const metadataFields = [
      "name",
      "version",
      "minAppVersion",
      "description",
      "author",
      "authorUrl",
      "fundingUrl",
      "isDesktopOnly",
    ];
    const applyMetadata = (target) => {
      if (!target) {
        return;
      }
      for (const field of metadataFields) {
        if (Object.prototype.hasOwnProperty.call(manifest, field)) {
          target[field] = manifest[field];
        }
      }
    };
    applyMetadata(this.manifest);
    const registeredManifest =
      this.app &&
      this.app.plugins &&
      this.app.plugins.manifests &&
      this.app.plugins.manifests[PLUGIN_ID]
        ? this.app.plugins.manifests[PLUGIN_ID]
        : null;
    if (registeredManifest !== this.manifest) {
      applyMetadata(registeredManifest);
    }
    return true;
  }

  async refreshInstalledPluginManifest() {
    const pluginDir = this.getPluginInstallDir();
    const manifestPath = normalizePath(`${pluginDir}/manifest.json`);
    try {
      const manifestSource = await this.app.vault.adapter.read(manifestPath);
      const manifest = JSON.parse(String(manifestSource || ""));
      return this.applyInstalledPluginManifest(manifest) ? manifest : null;
    } catch (error) {
      console.warn(
        "[obsidian-http-sync] unable to refresh installed plugin manifest",
        manifestPath,
        error
      );
      return null;
    }
  }

  getPluginUpdateBaseUrls() {
    const configuredBaseUrl = String(
      this.settings.baseUrl || DEFAULT_SETTINGS.baseUrl || ""
    )
      .trim()
      .replace(/\/+$/, "");
    const baseUrls = [];
    const addBaseUrl = (url) => {
      const normalizedUrl = String(url || "").trim().replace(/\/+$/, "");
      if (
        normalizedUrl &&
        !baseUrls.some(
          (existingUrl) =>
            existingUrl.toLowerCase() === normalizedUrl.toLowerCase()
        )
      ) {
        baseUrls.push(normalizedUrl);
      }
    };
    addBaseUrl(configuredBaseUrl);
    addBaseUrl(PLUGIN_UPDATE_PUBLIC_BASE_URL);
    if (baseUrls.length === 0) {
      throw new Error(this.t("error.updateServerRequired"));
    }
    return baseUrls;
  }

  async downloadPluginUpdateArchive() {
    const baseUrls = this.getPluginUpdateBaseUrls();
    const downloadPaths = [
      PLUGIN_UPDATE_LATEST_ARCHIVE_PATH,
      PLUGIN_UPDATE_FALLBACK_ARCHIVE_PATH,
    ];
    let lastError = null;
    for (const baseUrl of baseUrls) {
      for (const archivePath of downloadPaths) {
        let response;
        try {
          response = await performObsidianRequest({
            url: `${baseUrl}${archivePath}`,
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
            },
          });
        } catch (error) {
          lastError = error;
          continue;
        }
        if (isSuccessfulStatus(response.status)) {
          return {
            baseUrl,
            archivePath,
            archiveBytes: getBinaryResponsePayload(response),
          };
        }
        const error = new Error(`HTTP ${response.status}`);
        error.statusCode = response.status;
        lastError = error;
      }
    }
    throw lastError || new Error("Plugin update archive not found");
  }

  async loadPluginUpdatePackage() {
    const downloaded = await this.downloadPluginUpdateArchive();
    const files = await readPluginZipFiles(
      downloaded.archiveBytes,
      PLUGIN_UPDATE_FILES
    );
    for (const fileName of PLUGIN_UPDATE_FILES) {
      if (!files.has(fileName)) {
        throw new Error(
          this.t("error.pluginArchiveMissingFile", { fileName })
        );
      }
    }
    let manifest;
    try {
      manifest = JSON.parse(decodeUtf8(files.get("manifest.json")));
    } catch (error) {
      throw new Error(this.t("error.pluginManifestInvalid"));
    }
    const latestVersion = String(manifest && manifest.version ? manifest.version : "").trim();
    if (!latestVersion) {
      throw new Error(this.t("error.pluginManifestInvalid"));
    }
    return {
      ...downloaded,
      files,
      manifest,
      latestVersion,
    };
  }

  async readInstalledPluginFileHash(fileName) {
    const pluginDir = this.getPluginInstallDir();
    const path = normalizePath(`${pluginDir}/${fileName}`);
    try {
      const exists =
        this.app &&
        this.app.vault &&
        this.app.vault.adapter &&
        typeof this.app.vault.adapter.exists === "function"
          ? await this.app.vault.adapter.exists(path)
          : true;
      if (exists === false) {
        return "";
      }
      const payload = await this.app.vault.adapter.readBinary(path);
      return await hashBinary(payload);
    } catch (error) {
      console.warn("[obsidian-http-sync] unable to hash installed plugin file", path, error);
      return "";
    }
  }

  async checkForPluginUpdate() {
    const updatePackage = await this.loadPluginUpdatePackage();
    const currentVersion = this.getCurrentPluginVersion();
    const files = {};
    let hasDifferentFiles = false;
    for (const fileName of PLUGIN_UPDATE_FILES) {
      const remoteHash = await hashBinary(updatePackage.files.get(fileName));
      const installedHash = await this.readInstalledPluginFileHash(fileName);
      const differs = !installedHash || installedHash !== remoteHash;
      files[fileName] = {
        installedHash,
        remoteHash,
        differs,
      };
      if (differs) {
        hasDifferentFiles = true;
      }
    }
    const versionComparison = comparePluginVersions(
      updatePackage.latestVersion,
      currentVersion
    );
    const remoteSupportsSelfUpdate = pluginArchiveSupportsSelfUpdate(
      updatePackage.files.get("main.js")
    );
    const currentBuildId = this.getCurrentPluginBuildId();
    const remoteBuildId = extractPluginBuildId(updatePackage.files.get("main.js"));
    const buildComparison = comparePluginBuildIds(remoteBuildId, currentBuildId);
    const hasNewerSameVersionBuild =
      versionComparison === 0 &&
      hasDifferentFiles &&
      remoteSupportsSelfUpdate &&
      buildComparison > 0;
    return {
      currentVersion,
      currentBuildId,
      latestVersion: updatePackage.latestVersion,
      remoteBuildId,
      archivePath: updatePackage.archivePath,
      updateAvailable:
        versionComparison > 0 || hasNewerSameVersionBuild,
      hasDifferentFiles,
      hasNewerSameVersionBuild,
      remoteSupportsSelfUpdate,
      versionComparison,
      buildComparison,
      files,
    };
  }

  async installPluginUpdate() {
    const updatePackage = await this.loadPluginUpdatePackage();
    for (const fileName of PLUGIN_UPDATE_WRITE_ORDER) {
      await this.writePluginUpdateFile(fileName, updatePackage.files.get(fileName));
    }
    this.applyInstalledPluginManifest(updatePackage.manifest);
    return {
      latestVersion: updatePackage.latestVersion,
      archivePath: updatePackage.archivePath,
    };
  }

  async writePluginUpdateFile(fileName, payload) {
    if (!PLUGIN_UPDATE_FILES.includes(fileName)) {
      throw new Error(`Unsupported plugin update file: ${fileName}`);
    }
    const pluginDir = this.getPluginInstallDir();
    if (!pluginDir) {
      throw new Error(this.t("error.pluginDirectoryUnavailable"));
    }
    await this.writeBinaryFile(normalizePath(`${pluginDir}/${fileName}`), payload);
  }
};

function isSuccessfulStatus(statusCode) {
  return Number(statusCode) >= 200 && Number(statusCode) < 300;
}

function parseResponsePayload(response, declaredContentType) {
  const responseText = typeof response.text === "string" ? response.text : "";
  const trimmedText = responseText.trim();
  const hasJsonPayload = response.json !== undefined;
  const looksLikeJson = trimmedText.startsWith("{") || trimmedText.startsWith("[");
  if (declaredContentType === "application/json" || hasJsonPayload || looksLikeJson) {
    if (hasJsonPayload) {
      return {
        contentType: "application/json",
        payload: response.json,
      };
    }
    try {
      return {
        contentType: "application/json",
        payload: trimmedText ? JSON.parse(trimmedText) : {},
      };
    } catch (error) {
      if (declaredContentType === "application/json") {
        throw error;
      }
    }
  }
  return {
    contentType: declaredContentType,
    payload: new Uint8Array(response.arrayBuffer || new ArrayBuffer(0)),
  };
}

function getBinaryResponsePayload(response) {
  if (response.arrayBuffer !== undefined) {
    return new Uint8Array(response.arrayBuffer || new ArrayBuffer(0));
  }
  if (typeof response.text === "string") {
    return encodeUtf8(response.text);
  }
  return new Uint8Array(new ArrayBuffer(0));
}

function encodeUtf8(text) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(String(text || ""));
  }
  throw new Error("UTF-8 encoder is not available");
}

function decodeUtf8(binaryPayload) {
  const arrayBuffer = toArrayBuffer(binaryPayload);
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder("utf-8").decode(arrayBuffer);
  }
  throw new Error("UTF-8 decoder is not available");
}

async function performObsidianRequest(options) {
  try {
    return await requestUrl(options);
  } catch (error) {
    const normalizedResponse = normalizeFailedRequestResponse(error);
    if (normalizedResponse) {
      return normalizedResponse;
    }
    throw error;
  }
}

function normalizeFailedRequestResponse(error) {
  if (!error || typeof error !== "object") {
    return null;
  }
  const response =
    error.response && typeof error.response === "object" ? error.response : null;
  const status = Number(
    error.status ??
      error.statusCode ??
      (response ? response.status ?? response.statusCode : undefined)
  );
  if (!Number.isFinite(status) || status <= 0) {
    return null;
  }
  return {
    status,
    headers: error.headers || (response ? response.headers : {}) || {},
    json:
      error.json !== undefined
        ? error.json
        : response && response.json !== undefined
          ? response.json
          : undefined,
    text:
      error.text !== undefined
        ? error.text
        : response && response.text !== undefined
          ? response.text
          : undefined,
    arrayBuffer:
      error.arrayBuffer !== undefined
        ? error.arrayBuffer
        : response && response.arrayBuffer !== undefined
          ? response.arrayBuffer
          : undefined,
  };
}

function getResponseHeader(headers, name) {
  if (!headers || !name) {
    return "";
  }
  const targetName = String(name).toLowerCase();
  for (const [headerName, value] of Object.entries(headers)) {
    if (String(headerName).toLowerCase() === targetName) {
      return String(value || "");
    }
  }
  return "";
}

const UI_LOCALES = {
  en: {
    "button.completeLogin": "Complete login",
    "button.connectSharedVaultHere": "Connect here",
    "button.connectThisLocalVault": "Connect this local vault",
    "button.checkUpdates": "Check updates",
    "button.createLinkCode": "Create link code",
    "button.grantAccess": "Create invite",
    "button.loadVaults": "Scan vaults",
    "button.publishCurrentVault": "Create vault",
    "button.refresh": "Refresh",
    "button.refreshAccount": "Refresh account",
    "button.register": "Register",
    "button.remove": "Remove",
    "button.requestCode": "Request code",
    "button.reconnectThisLocalVault": "Reconnect this local vault",
    "button.resetLocalState": "Reset local state",
    "button.revoke": "Revoke",
    "button.saveFolderSelection": "Save folders",
    "button.syncNow": "Sync now",
    "button.syncProgress": "Syncing {{completed}}/{{total}}",
    "button.takeoverActiveNoteEdit": "Take over editing",
    "button.updatePlugin": "Update",
    "command.registerDevice": "Register current Obsidian app as sync device",
    "command.resetLocalState": "Reset local sync state",
    "command.syncNow": "HTTP Sync Now",
    "command.syncVaultNow": "Sync vault now",
    "command.takeoverActiveNoteLock": "Take over active note lock",
    "dropdown.loadVaultsFirst": "Scan vaults first",
    "dropdown.selectVault": "Select vault",
    "error.accessTokenRequired": "Access token is required",
    "error.backendAndEmailRequired": "Backend URL and user email are required",
    "error.crdtProtocolUnsupported":
      "Server is too old for safe collaborative Markdown sync. Update the backend before editing shared notes.",
    "error.deviceRegistrationNeedsAccount":
      "Backend URL and user email must be filled before device registration",
    "error.expectedBinary": "Expected binary response",
    "error.expectedJson": "Expected JSON response",
    "error.loginCodeRequired": "Backend URL, user email and login code are required",
    "error.pluginArchiveMissingFile": "Plugin archive is missing {{fileName}}",
    "error.pluginDirectoryUnavailable": "Plugin install directory is unavailable",
    "error.pluginManifestInvalid": "Downloaded plugin manifest is invalid",
    "error.pluginNotConfigured": "Plugin is not configured: login, vault and device are required",
    "error.publishVaultMissingId": "Server did not return a vault id",
    "error.publishVaultNeedsAccount": "Fill Backend URL and sign in before creating a server vault from the current local vault",
    "error.remoteMoveMissingHash": "Remote file move cannot be reconstructed without content_hash",
    "error.remoteMoveMissingTarget": "Remote move is missing target_path",
    "error.remoteUpsertMissingHash": "Remote upsert is missing content_hash",
    "error.resolveUser": "Could not resolve backend user reference from email",
    "error.serverVaultRequired": "Select a server vault first",
    "error.sharingConfigRequired": "Backend URL, user email and vault ID must be filled first",
    "error.targetEmailRequired": "Target user email is required",
    "error.inviteIdRequired": "Invite ID is required",
    "error.targetUserIdRequired": "Target user ID is required",
    "error.telegramLinksNeedAccount": "Backend URL and user email are required for Telegram links",
    "error.updateServerRequired": "Backend URL is required to check plugin updates",
    "error.unsupportedRemoteOperation": "Unsupported remote operation_type {{operationType}}",
    "error.userEmailRequired": "User email is required",
    "error.userIdRequired": "User ID is required",
    "notice.accountRefreshed": "Account refreshed",
    "notice.accountRefreshFailed": "Account refresh failed: {{message}}",
    "notice.deviceRegistered": "Registered sync device: {{deviceId}}",
    "notice.deviceRegistrationFailed": "Device registration failed: {{message}}",
    "notice.loadedVaults": "Scanned vaults: {{count}}",
    "notice.loadVaultsFailed": "Could not scan vaults: {{message}}",
    "notice.localStateReset": "Local sync state reset",
    "notice.loginCode": "Login code (debug): {{code}}",
    "notice.loginCodeRequested": "Login code sent to email",
    "notice.loginCompleted": "Login completed",
    "notice.loginFailed": "Login failed: {{message}}",
    "notice.loginRequestFailed": "Login request failed: {{message}}",
    "notice.localVaultConnected":
      "This local vault is connected. Run the first sync manually.",
    "notice.localVaultConnectFailed": "Could not connect this local vault: {{message}}",
    "notice.currentVaultPublished": "Server vault created from current local vault: {{name}}",
    "notice.currentVaultPublishFailed": "Could not create server vault from current local vault: {{message}}",
    "notice.pluginUpdateAvailable": "Plugin update available: {{version}}",
    "notice.pluginUpdateCheckFailed": "Update check failed: {{message}}",
    "notice.pluginUpdateInstallFailed": "Plugin update failed: {{message}}",
    "notice.pluginUpdateInstalled":
      "Plugin files updated to {{version}}. Restart Obsidian or reload the plugin.",
    "notice.pluginUpdateNotAvailable": "Plugin is already up to date",
    "notice.folderSelectionSaved": "Folder selection saved",
    "notice.folderSelectionSaveFailed": "Could not save folder selection: {{message}}",
    "notice.vaultChangedManualSyncRequired":
      "Server vault changed. Local sync state was reset. Review the selection and run the first sync manually.",
    "notice.vaultChangedAutoSyncPaused":
      "Server vault changed. Auto sync was turned off and local sync state was reset. Review the selection and run the first sync manually.",
    "notice.removeAccessFailed": "Failed to remove access: {{message}}",
    "notice.removedAccess": "Removed access for {{member}}",
    "notice.revokeInviteFailed": "Failed to revoke invite: {{message}}",
    "notice.sharingUpdateFailed": "Sharing update failed: {{message}}",
    "notice.syncAlreadyRunning": "Sync is already running",
    "notice.syncBootstrapped": "Sync bootstrapped: pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncDone": "Sync done: push {{pushed}}, pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncDoneWithWarning": "Sync completed with warnings: push {{pushed}}, pull {{pulled}}, conflicts {{conflicts}}",
    "notice.syncFailed": "Sync failed: {{message}}",
    "notice.crdtMarkdownBlocked":
      "Collaborative Markdown editing was turned off: {{reason}}",
    "notice.crdtLeaseHeld":
      "This note is being edited on another device; sending your changes is temporarily paused.",
    "notice.noteNonCrdtRemotePaused":
      "This note is open on another device while CRDT is off; remote changes for {{path}} are paused so your local text is not overwritten.",
    "notice.noteReadonly":
      "This note is read-only on this device right now: {{reason}}",
    "notice.noteStructuralChangeBlocked":
      "Rename, move or delete was not sent because this note is locked elsewhere: {{path}}",
    "notice.noteTakeoverDone": "Takeover requested for {{path}}",
    "notice.noteTakeoverPending":
      "Takeover was requested for {{path}}, but the note is still reported as read-only.",
    "notice.noteTakeoverUnavailable":
      "Open a synced Markdown note before requesting takeover.",
    "notice.telegramCodeCreated": "Telegram link code created",
    "notice.telegramCodeCreatedWithCode": "Telegram link code created: {{code}}",
    "notice.telegramCodeFailed": "Telegram link creation failed: {{message}}",
    "notice.telegramRevokeFailed": "Failed to revoke Telegram link: {{message}}",
    "notice.telegramRevoked": "Telegram chat {{chatId}} revoked",
    "notice.vaultInviteCreated": "Vault invite created for {{email}}",
    "notice.vaultInviteRevoked": "Vault invite revoked for {{email}}",
    "notice.vaultAccessUpdated": "Vault access updated for {{email}}",
    "invite.status.accepted": "accepted",
    "invite.status.expired": "expired",
    "invite.status.pending": "sent, waiting for acceptance",
    "invite.status.revoked": "revoked",
    "role.editor": "editor",
    "role.member": "member",
    "role.owner": "owner",
    "role.viewer": "viewer",
    "settings.accessibleVaults": "Accessible vaults",
    "settings.accessibleVaultsDesc":
      "These are the vaults already available to your account, including accepted invitations. Choose the one you want to use here.",
    "settings.accessibleVaultsBehavior":
      "Nothing is linked until you press Connect here. To keep shared notes separate, open or create a separate Obsidian vault first, then press Connect here from that vault.",
    "settings.accessToken": "Access token",
    "settings.accessTokenDesc": "Optional Bearer token for authenticated backend routes",
    "settings.accountSetup": "Account Setup",
    "settings.advancedSettings": "Advanced settings",
    "settings.advancedSettingsDesc":
      "Rarely needed fields for diagnostics, support and custom sync scope. Most users can ignore this section.",
    "settings.autoGenerated": "auto-generated",
    "settings.autoSync": "Auto sync",
    "settings.autoSyncDesc": "Sync automatically on local vault changes with periodic polling fallback",
    "settings.syncObsidianConfig": "Sync Obsidian settings and plugins",
    "settings.syncObsidianConfigDesc":
      "Sync .obsidian settings, themes, snippets and community plugins. Enable the source device first, then the others: existing server files win during first import. Workspace state and this sync plugin's own local credentials stay device-local; restart Obsidian after plugin files change.",
    "settings.crdtMarkdownEnabled": "Collaborative Markdown editing",
    "settings.crdtMarkdownEnabledDesc":
      "Use the CRDT update channel for .md files so concurrent edits merge without whole-file 409 conflicts. All devices on this vault should run an updated plugin.",
    "settings.crdtMarkdownBlockedHint":
      "Currently unavailable: {{reason}}",
    "settings.backendUrl": "Backend URL",
    "settings.backendUrlDesc": "Example: http://45.144.65.18",
    "settings.basicSyncDesc":
      "These settings are enough for one user syncing between their own devices.",
    "settings.colleagueEmail": "Colleague email",
    "settings.colleagueEmailDesc": "Email of the colleague who should access this vault",
    "settings.connectedTelegramChats": "Connected Telegram chats",
    "settings.currentLocalVault": "Current local vault: {{vaultName}}",
    "settings.connectCurrentVault": "Connect current local vault",
    "settings.connectCurrentVaultDesc":
      "The selected server vault and folders will sync into the currently opened Obsidian vault. To use a separate local vault, create or open it in Obsidian first, install this plugin there, then connect it.",
    "settings.connectSharedVaultDesc":
      "Connects the selected shared vault to the Obsidian vault currently open on this device. First sync remains manual so local notes are not mixed accidentally.",
    "settings.connectedServerVault": "Connected server vault: {{vault}}",
    "settings.currentDevice": "Current device: {{deviceId}}",
    "settings.currentMembers": "Current members",
    "settings.deviceId": "Device ID",
    "settings.deviceIdDesc": "Filled automatically after device registration",
    "settings.deviceName": "Device Name",
    "settings.deviceNameDesc": "Human-readable name shown in backend",
    "settings.expiresAt": "Expires at: {{expiresAt}}",
    "settings.ignorePaths": "Ignore paths",
    "settings.ignorePathsDesc": "One path or prefix per line. Prefixes must end with '/'.",
    "settings.language": "Language",
    "settings.languageDesc": "Plugin interface language",
    "settings.lastCode": "Last code: {{code}}",
    "settings.lastErrorSuffix": " | Last error: {{message}}",
    "settings.lastSyncWarningSuffix": " | Last warning: {{message}}",
    "settings.lastSyncStatus": "Last sync: {{lastSyncAt}}{{lastErrorSuffix}}{{lastWarningSuffix}}",
    "settings.loadMembershipsFailed": "Could not load memberships: {{message}}",
    "settings.loadTelegramFailed": "Could not load Telegram links: {{message}}",
    "settings.loginCode": "Login code",
    "settings.loginCodeDesc": "Enter the one-time code sent to your email",
    "settings.loginCodeDevDesc":
      "Enter the one-time code sent to your email. Debug servers may prefill it here.",
    "settings.loginRequestExpires": "Last request expires at {{expiresAt}}",
    "settings.inviteSentReference": "Invitation sent | Role: {{role}} | Status: {{status}}",
    "settings.memberReference": "Role: {{role}}",
    "settings.memberReferenceWithId": "Role: {{role}} | reference id: {{userId}}",
    "settings.membershipsNeedConfig": "Fill Backend URL, user email and Vault ID to load vault memberships.",
    "settings.noVaultSelected": "No server vault selected yet.",
    "settings.noMembers": "No members found yet.",
    "settings.noPendingInvites": "No pending invites.",
    "settings.noTelegramChats": "No Telegram chats linked yet.",
    "settings.pendingInvites": "Sent invites",
    "settings.platform": "Platform",
    "settings.platformDesc": "Device platform identifier",
    "settings.pluginUpdate": "Plugin update",
    "settings.pluginUpdateAvailable": "Available version: {{latestVersion}}",
    "settings.pluginUpdateAvailableBuild":
      "A newer build is available for version {{latestVersion}}",
    "settings.pluginUpdateChecking": "Checking...",
    "settings.pluginUpdateCurrent": "Latest installed: {{latestVersion}}",
    "settings.pluginUpdateDesc": "Plugin version: {{currentVersion}}. {{status}}",
    "settings.pluginUpdateFailed": "Last check failed: {{message}}",
    "settings.pluginUpdateInstalling": "Updating...",
    "settings.pluginUpdateNotChecked": "Updates have not been checked yet.",
    "settings.publishCurrentVault": "Create server vault from this local vault",
    "settings.publishCurrentVaultDesc":
      "Use this only when the currently opened local Obsidian vault does not yet exist on the server. This creates a new server vault entry from the local vault. If a server vault already exists, scan and select it below instead.",
    "settings.publishCurrentVaultAvailableDesc":
      "You already have server vaults available. Connect one below, or create another vault if your tariff allows it.",
    "settings.publishCurrentVaultHiddenDesc":
      "This local vault is already linked to a server vault. If you need a different target, choose it from the list below instead of creating a new one here.",
    "settings.quickStart": "Quick start",
    "settings.quickStartDesc":
      "Finish these required steps first. Sharing, Telegram and advanced fields can wait until personal sync is already working.",
    "settings.refreshAccount": "Refresh account",
    "settings.refreshAccountDesc":
      "Service action. Re-reads the saved session and restores user/device data if the UI lost them. Usually not needed during normal daily sync.",
    "settings.refreshToken": "Refresh token",
    "settings.refreshTokenDesc": "Optional refresh token used to renew access after 401",
    "settings.requestLoginCode": "Request login code",
    "settings.requestLoginCodeDesc": "The server sends a one-time login code to this email",
    "settings.reconnectCurrentVaultDesc":
      "Changing the server vault or folders will reset local sync state and turn off auto sync. The first sync must be started manually.",
    "settings.runSyncNow": "Run sync now",
    "settings.serverSyncFolders": "Server folders to sync",
    "settings.serverSyncFoldersDesc":
      "One server folder per line. Leave empty to sync the whole selected server vault into the currently opened Obsidian vault. These folders are applied when you connect or reconnect this local vault.",
    "settings.serverSyncFoldersInviteDesc":
      "These folders come from the accepted invitation or membership and cannot be changed here.",
    "settings.sharedAccessReady": "Shared access is ready",
    "settings.sharedAccessReadyDesc":
      "Your account can access “{{vault}}” as {{role}}. Scope: {{scope}}.",
    "settings.sharedAccessReadyDescWithInviter":
      "{{inviter}} shared “{{vault}}” with you as {{role}}. Scope: {{scope}}.",
    "settings.setupStepAccount": "User email is entered",
    "settings.setupStepLogin": "Login is completed and device is registered",
    "settings.setupStepOptional": "Sharing and Telegram are optional after personal sync is working",
    "settings.setupStepServer": "Server URL is configured",
    "settings.setupStepSync": "Plugin is ready for the first sync",
    "settings.setupStepVault": "A server vault is selected",
    "settings.vaultId": "Server vault ID",
    "settings.vaultIdDesc":
      "Service reference of the selected server vault. Usually not needed in daily use.",
    "settings.sharedFolders": "Shared Folders",
    "settings.sharedFoldersDesc":
      "Use the folder tree to choose whole-vault access or specific shared folders.",
    "settings.sharedFolderScope": "Folders to share",
    "settings.sharedFolderScopeDesc":
      "Choose Whole vault or select one or more folders from the tree.",
    "settings.selectedSharedFolders": "Selected folders: {{count}}",
    "settings.noShareableFolders": "No folders in this vault",
    "settings.status": "Status: {{status}}",
    "settings.sync": "Sync",
    "settings.syncFolders": "Folders to publish",
    "settings.syncFoldersDesc":
      "One local folder per line. Leave empty to publish the whole current Obsidian vault. Changing this resets local sync state.",
    "settings.syncFoldersPlaceholder": "Projects\nArchive/Shared",
    "settings.syncInterval": "Sync interval (seconds)",
    "settings.syncIntervalDesc": "Fallback polling interval while auto sync is enabled",
    "settings.telegramChat": "Chat {{chatId}}",
    "settings.telegramDesc":
      "You can generate a one-time Telegram link code here and then send `/link CODE` to the bot in a private chat.",
    "settings.telegramInboxFolder": "Telegram inbox folder",
    "settings.telegramInboxFolderDesc": "Default destination folder for notes created from Telegram messages",
    "settings.telegramNeedConfig": "Fill Backend URL and user email to load Telegram links.",
    "settings.title": "Arcalink Sync",
    "settings.unnamedVault": "Unnamed vault",
    "settings.userEmail": "User email",
    "settings.userEmailDesc": "Primary account identifier used by registration, sharing and Telegram flows",
    "settings.userId": "User ID (reference)",
    "settings.userIdDesc": "Resolved automatically from email. Keep it only for diagnostics and support.",
    "settings.vaultConnection": "Vault Connection",
    "settings.vaultRole": "Vault role",
    "settings.vaultRoleDesc": "Role for the invite. Folder restrictions are controlled by Folders to share.",
    "settings.vaultSharing": "Vault Sharing",
    "settings.vaultSharingDesc":
      "ArcaLink creates an invite by colleague email. Choose the whole vault or specific folders in the tree.",
    "settings.wholeVaultAccess": "Whole vault",
    "settings.wholeVaultAccessInput": "Whole vault",
    "settings.folderScopeAccess": "Folders: {{folders}}",
    "status.never": "never",
    "stage.bootstrap-from-remote": "bootstrap from remote",
    "stage.create-session": "create sync session",
    "stage.pull-remote-changes": "pull remote changes",
    "stage.push-local-changes": "push local changes",
    "stage.scan-local-after-pull": "scan local vault after pull",
    "stage.scan-local-before-push": "scan local vault before push",
    "auth.status.authenticated": "Logged in",
    "auth.status.unknown": "Checking auth...",
    "auth.status.missing_token": "Not logged in — no access token",
    "auth.status.refresh_failed": "Login expired — refresh failed",
    "auth.status.session_expired": "Login expired — session ended",
    "auth.status.session_revoked": "Login revoked — session was invalidated",
    "auth.status.billing_blocked": "Sync blocked — check account status",
    "auth.status.error": "Auth error — see details below",
    "auth.indicatorLabel": "Auth status",
    "syncBlock.reason.none": "No issues detected",
    "syncBlock.reason.not_configured": "Plugin is not fully configured",
    "syncBlock.reason.missing_token": "Access token is missing — log in again",
    "syncBlock.reason.session_expired": "Session has expired — log in again",
    "syncBlock.reason.session_revoked": "Session was revoked by server — log in again",
    "syncBlock.reason.refresh_failed": "Token refresh failed — log in again",
    "syncBlock.reason.billing_blocked": "Account billing status prevents sync",
    "syncBlock.reason.network_error": "Network error — check connection",
    "syncBlock.reason.server_error": "Server error — try again later",
    "syncBlock.label": "Sync status",
    "collaborationBlock.reason.none": "No collaboration issues detected",
    "collaborationBlock.reason.billing_blocked_collaboration": "Collaboration subscription unpaid — sharing and live editing blocked",
    "collaborationBlock.reason.collaboration_not_in_plan": "Current plan does not include collaboration — upgrade to enable sharing and live editing",
    "collaborationBlock.reason.member_limit_exceeded": "Vault member limit reached — upgrade plan or remove unused members",
    "collaborationBlock.label": "Collaboration status",
    "stage.sync-crdt-markdown": "sync collaborative Markdown notes",
    "settings.syncConflicts": "Sync conflicts",
    "settings.syncConflictsNeedConfig": "Select a vault and run the first sync to load conflict information.",
    "settings.noConflicts": "No open conflicts found.",
    "settings.syncConflictsDesc": "These files have conflicting changes. Resolve them from the Obsidian plugin on your device.",
    "settings.conflictItemDesc": "{{createdAt}} | {{reason}} | {{opType}} | {{status}}",
    "settings.loadConflictsFailed": "Failed to load conflicts: {{message}}",
    "settings.loadConflictsUsingCache": "Showing cached conflicts because refresh failed: {{message}}",
    "settings.conflictDetailTitle": "Conflict details",
    "settings.conflictPath": "Path",
    "settings.conflictCreatedAt": "Created at",
    "settings.conflictOperationType": "Operation",
    "settings.conflictReason": "Reason",
    "settings.conflictExpectedHash": "Expected hash",
    "settings.conflictActualHash": "Actual hash",
    "settings.conflictStatus": "Status",
    "settings.conflictDeviceId": "Device",
    "settings.conflictTargetPath": "Target path",
    "settings.conflictResolutionUnsupported": "This conflict type is currently read-only. Resolve it from a device flow that supports {{entryType}} / {{operationType}}.",
    "button.viewConflictDetails": "Details",
    "button.resolveKeepLocal": "Keep local",
    "button.resolveAcceptRemote": "Accept remote",
    "button.resolveKeepBoth": "Keep both",
    "button.materializeRemote": "Show remote version",
    "button.checkVaultDivergence": "Check divergence",
    "button.mergeVaultDivergence": "Merge missing files",
    "button.acceptServerVaultState": "Use server here",
    "button.publishLocalVaultState": "Publish this client",
    "resolution.keepLocal": "keep_local",
    "resolution.acceptRemote": "accept_remote",
    "resolution.keepBoth": "keep_both",
    "resolution.keepLocalDesc": "Publish your local file version to the server and mark the conflict as resolved.",
    "resolution.keepLocalDeleteHashMismatchDesc": "Keep the local deletion: delete the current server file version and mark the conflict as resolved.",
    "resolution.acceptRemoteDesc": "Replace your local file with the current server version. A safety copy will be preserved.",
    "resolution.keepBothDesc": "Keep the server version as the main file and preserve your local version as a conflict copy.",
    "resolution.materializeDesc": "Download the current server version into a read-only comparison file next to your local copy.",
    "confirm.remoteConflictContentMissingUseLocal": "The server content for {{path}} is missing and cannot be restored from the server. Use this device's local version instead?",
    "error.localFileNotFound": "Local file {{path}} no longer exists",
    "error.remoteFileNotAvailable": "Remote version of {{path}} is not available",
    "error.remoteConflictContentMissing": "Server content for {{path}} is missing. Keep the local version to resolve this conflict.",
    "error.syncBlockedBilling.generic": "Sync is blocked because the subscription currently does not allow it.",
    "error.syncBlockedBilling.expired": "Sync is blocked because the subscription has expired.",
    "error.syncBlockedBilling.past_due": "Sync is blocked because the subscription payment is overdue.",
    "error.syncBlockedBilling.suspended": "Sync is blocked because the subscription is suspended.",
    "error.syncBlockedBilling.canceled": "Sync is blocked because the subscription is canceled.",
    "error.unsupportedConflictResolution": "Conflict resolution for {{entryType}} / {{operationType}} is not supported in this version",
    "error.resolveConflictFailed": "Failed to resolve conflict: {{message}}",
    "notice.conflictResolved": "Conflict resolved",
    "notice.conflictResolveFailed": "Conflict resolution failed: {{message}}",
    "notice.remoteMaterialized": "Remote version downloaded to {{path}}",
    "notice.remoteMaterializeFailed": "Failed to download remote version: {{message}}",
    "notice.vaultDivergenceServerAccepted":
      "Server state applied: remote {{applied}}, local removed {{removed}}, safety copies {{preserved}}",
    "notice.vaultDivergenceLocalPublished":
      "Local state published: operations {{pushed}}, conflicts {{conflicts}}",
    "notice.vaultDivergenceMerged":
      "Merge done: server-only downloaded {{downloaded}}, local-only uploaded {{uploaded}}, directories created on server {{directories}}, missing remote objects {{missing}}, conflicts {{conflicts}}, same-path changed left {{changed}}",
    "notice.vaultDivergenceResolveFailed": "Could not resolve vault divergence: {{message}}",
    "settings.vaultDivergence": "Vault divergence",
    "settings.vaultDivergenceNeedConfig": "Select a vault and run the first sync to compare file sets.",
    "settings.vaultDivergenceDesc": "Compares this local vault with the server index without changing files.",
    "settings.checkVaultDivergence": "Compare local and server files",
    "settings.checkVaultDivergenceDesc": "Scans the current vault and shows paths that exist only on one side or have different content.",
    "settings.loadVaultDivergenceFailed": "Failed to compare vaults: {{message}}",
    "settings.vaultDivergenceCheckedAt": "Checked: {{checkedAt}}",
    "settings.vaultDivergenceCounts": "Local: {{localCount}} | Server: {{remoteCount}} | Only local: {{localOnlyCount}} | Only server: {{remoteOnlyCount}} | Changed: {{changedCount}}",
    "settings.vaultDivergenceNoDiff": "No file set differences found.",
    "settings.vaultDivergenceLocalOnly": "Only in this local vault",
    "settings.vaultDivergenceRemoteOnly": "Only on server",
    "settings.vaultDivergenceChanged": "Different content",
    "settings.vaultDivergenceMore": "and {{count}} more",
    "settings.vaultDivergenceTimeHint":
      "Times: local is this client's file modified time; server is when the server accepted the latest operation.",
    "settings.vaultDivergenceSideLocal": "Local",
    "settings.vaultDivergenceSideServer": "Server",
    "settings.vaultDivergenceSideMissing": "{{side}}: missing",
    "settings.vaultDivergenceSideMeta":
      "{{side}}: {{modifiedAt}} | {{type}} | {{size}} | {{hash}}",
    "settings.mergeVaultDivergence": "Merge file sets without overwrite",
    "settings.mergeVaultDivergenceDesc":
      "Downloads files that exist only on the server and uploads files that exist only on this client. Files with different content at the same path are not changed (remaining: {{changed}}).",
    "settings.acceptServerVaultState": "Use server state on this client",
    "settings.acceptServerVaultStateDesc":
      "Server-only files will be downloaded, changed files will be replaced by server versions, and local-only paths will be removed after safety copies are written under .sync-conflict-local.",
    "settings.publishLocalVaultState": "Make this client the source",
    "settings.publishLocalVaultStateDesc":
      "Local-only files will be created on the server, changed files will be published from this client, and server-only paths will be deleted from the server.",
    "confirm.acceptServerVaultState":
      "Apply the server state to this client for {{count}} differences? Server-only files will be downloaded; local-only files will be removed after safety copies are created.",
    "confirm.publishLocalVaultState":
      "Publish this client as the source for {{count}} differences? Local-only files will be uploaded; server-only files will be deleted from the server for all clients.",
    "confirm.mergeVaultDivergence":
      "Merge {{count}} paths that exist on only one side? Files with different content at the same path will not be changed (remaining: {{changed}}).",
    "status.unknown": "unknown",
    "sectionStatus.connected": "Connected",
    "sectionStatus.notConnected": "Not connected",
    "sectionStatus.configured": "Configured",
    "sectionStatus.notConfigured": "Not configured",
    "sectionStatus.checking": "Checking…",
    "sectionStatus.blocked": "Blocked",
    "sectionStatus.error": "Error",
    "sectionStatus.autoSync": "Auto sync",
    "sectionStatus.manualSync": "Manual sync",
    "sectionStatus.syncConflicted": "Sync conflicted",
    "sectionStatus.noConflicts": "No conflicts",
    "sectionStatus.conflictsOpen": "{{count}} open",
    "sectionStatus.noVaultDivergence": "No divergence",
    "sectionStatus.vaultDiverged": "{{count}} differences",
    "statusBar.notePresence": "HTTP Sync: note {{path}} is open elsewhere ({{holders}})",
    "statusBar.noteReadonly": "HTTP Sync: note {{path}} is read-only ({{holders}})",
    "statusBar.notePresenceShort": "Note: +{{count}}",
    "statusBar.noteReadonlyShort": "Note: read-only",
    "statusBar.noteUnknownHolders": "unknown holders",
    "statusBar.brand": "Arcalink",
    "statusBar.openSettings": "Open Arcalink settings",
    "statusBar.lampOk": "Arcalink: everything works",
    "statusBar.lampNoConnection": "Arcalink: no server connection",
    "statusBar.lampBlocked": "Arcalink: sync is blocked",
    "statusBar.lampSyncError": "Arcalink: sync error",
    "statusBar.lampConflict": "Arcalink: sync conflicts exist",
    "statusBar.lampConflictCount": "Arcalink: {{count}} open sync conflicts",
    "statusBar.syncModeAuto": "Auto sync",
    "statusBar.syncModeManual": "Manual sync",
    "statusBar.serverLabel": "Server",
    "statusBar.serverConnected": "connected",
    "statusBar.serverChecking": "checking",
    "statusBar.serverBlocked": "blocked",
    "statusBar.serverError": "error",
    "statusBar.serverNotConfigured": "not configured",
    "statusBar.serverNotConnected": "not connected",
    "statusBar.syncLabel": "Sync",
    "statusBar.syncIdle": "idle",
    "statusBar.syncing": "syncing",
    "statusBar.syncProgress": "Files: {{completed}}/{{total}}",
    "statusBar.syncQueued": "queued",
    "statusBar.syncError": "error",
    "statusBar.syncNotConfigured": "not configured",
  },
  ru: {
    "button.completeLogin": "Завершить вход",
    "button.connectSharedVaultHere": "Подключить сюда",
    "button.connectThisLocalVault": "Подключить этот локальный vault",
    "button.checkUpdates": "Проверить обновления",
    "button.createLinkCode": "Создать код привязки",
    "button.grantAccess": "Создать приглашение",
    "button.loadVaults": "Сканировать хранилища",
    "button.publishCurrentVault": "Создать хранилище",
    "button.refresh": "Обновить",
    "button.refreshAccount": "Обновить аккаунт",
    "button.register": "Зарегистрировать",
    "button.remove": "Удалить",
    "button.requestCode": "Запросить код",
    "button.reconnectThisLocalVault": "Переподключить этот локальный vault",
    "button.resetLocalState": "Сбросить локальное состояние",
    "button.revoke": "Отозвать",
    "button.syncNow": "Синхронизировать",
    "button.syncProgress": "Синхронизация {{completed}}/{{total}}",
    "button.takeoverActiveNoteEdit": "Перехватить редактирование",
    "button.updatePlugin": "Обновить",
    "command.registerDevice": "Зарегистрировать текущее приложение Obsidian как устройство",
    "command.resetLocalState": "Сбросить локальное состояние синхронизации",
    "command.syncNow": "Синхронизировать сейчас",
    "command.syncVaultNow": "Синхронизировать хранилище сейчас",
    "command.takeoverActiveNoteLock": "Перехватить блокировку активной заметки",
    "dropdown.loadVaultsFirst": "Сначала сканируйте хранилища",
    "dropdown.selectVault": "Выберите хранилище",
    "error.accessTokenRequired": "Нужен токен доступа",
    "error.backendAndEmailRequired": "Укажите URL сервера и email пользователя",
    "error.crdtProtocolUnsupported":
      "Сервер слишком старый для безопасной совместной синхронизации Markdown. Обновите backend перед редактированием общих заметок.",
    "error.deviceRegistrationNeedsAccount":
      "Перед регистрацией устройства укажите URL сервера и email пользователя",
    "error.expectedBinary": "Ожидался бинарный ответ",
    "error.expectedJson": "Ожидался JSON-ответ",
    "error.loginCodeRequired": "Укажите URL сервера, email и код входа",
    "error.pluginArchiveMissingFile": "В архиве плагина нет файла {{fileName}}",
    "error.pluginDirectoryUnavailable": "Не удалось определить папку установки плагина",
    "error.pluginManifestInvalid": "Скачанный manifest плагина некорректен",
    "error.pluginNotConfigured": "Плагин не настроен: нужен вход, хранилище и устройство",
    "error.publishVaultMissingId": "Сервер не вернул ID хранилища",
    "error.publishVaultNeedsAccount": "Перед созданием server-хранилища из текущего локального vault укажите URL сервера и выполните вход",
    "error.remoteMoveMissingHash": "Нельзя восстановить удалённое перемещение файла без content_hash",
    "error.remoteMoveMissingTarget": "В удалённом перемещении нет target_path",
    "error.remoteUpsertMissingHash": "В удалённой операции обновления нет content_hash",
    "error.resolveUser": "Не удалось найти пользователя на сервере по email",
    "error.serverVaultRequired": "Сначала выберите server-хранилище",
    "error.sharingConfigRequired": "Сначала заполните URL сервера, email и ID хранилища",
    "error.targetEmailRequired": "Укажите email пользователя",
    "error.inviteIdRequired": "Нужен ID приглашения",
    "error.targetUserIdRequired": "Укажите ID пользователя",
    "error.telegramLinksNeedAccount": "Для Telegram-связок нужны URL сервера и email пользователя",
    "error.updateServerRequired": "Для проверки обновлений нужен URL сервера",
    "error.unsupportedRemoteOperation": "Неподдерживаемый тип удалённой операции: {{operationType}}",
    "error.userEmailRequired": "Укажите email пользователя",
    "error.userIdRequired": "Нужен ID пользователя",
    "notice.accountRefreshed": "Аккаунт обновлён",
    "notice.accountRefreshFailed": "Не удалось обновить аккаунт: {{message}}",
    "notice.deviceRegistered": "Устройство синхронизации зарегистрировано: {{deviceId}}",
    "notice.deviceRegistrationFailed": "Не удалось зарегистрировать устройство: {{message}}",
    "notice.loadedVaults": "Найдено хранилищ: {{count}}",
    "notice.loadVaultsFailed": "Не удалось просканировать хранилища: {{message}}",
    "notice.localStateReset": "Локальное состояние синхронизации сброшено",
    "notice.loginCode": "Код входа (debug): {{code}}",
    "notice.loginCodeRequested": "Код входа отправлен на email",
    "notice.loginCompleted": "Вход выполнен",
    "notice.loginFailed": "Не удалось войти: {{message}}",
    "notice.loginRequestFailed": "Не удалось запросить код входа: {{message}}",
    "notice.localVaultConnected":
      "Этот локальный vault подключён. Запустите первую синхронизацию вручную.",
    "notice.localVaultConnectFailed": "Не удалось подключить этот локальный vault: {{message}}",
    "notice.currentVaultPublished": "Server-хранилище создано из текущего локального vault: {{name}}",
    "notice.currentVaultPublishFailed": "Не удалось создать server-хранилище из текущего локального vault: {{message}}",
    "notice.pluginUpdateAvailable": "Доступно обновление плагина: {{version}}",
    "notice.pluginUpdateCheckFailed": "Не удалось проверить обновления: {{message}}",
    "notice.pluginUpdateInstallFailed": "Не удалось обновить плагин: {{message}}",
    "notice.pluginUpdateInstalled":
      "Файлы плагина обновлены до {{version}}. Перезапустите Obsidian или перезагрузите плагин.",
    "notice.pluginUpdateNotAvailable": "Плагин уже обновлён",
    "notice.vaultChangedManualSyncRequired":
      "Выбор server-хранилища изменён. Локальное состояние синхронизации сброшено. Проверьте выбор и запустите первую синхронизацию вручную.",
    "notice.vaultChangedAutoSyncPaused":
      "Выбор server-хранилища изменён. Автосинхронизация выключена, а локальное состояние синхронизации сброшено. Проверьте выбор и запустите первую синхронизацию вручную.",
    "notice.removeAccessFailed": "Не удалось удалить доступ: {{message}}",
    "notice.removedAccess": "Доступ удалён для {{member}}",
    "notice.revokeInviteFailed": "Не удалось отозвать приглашение: {{message}}",
    "notice.sharingUpdateFailed": "Не удалось обновить доступ: {{message}}",
    "notice.syncAlreadyRunning": "Синхронизация уже выполняется",
    "notice.syncBootstrapped": "Первичная синхронизация: получено {{pulled}}, конфликтов {{conflicts}}",
    "notice.syncDone": "Синхронизация завершена: отправлено {{pushed}}, получено {{pulled}}, конфликтов {{conflicts}}",
    "notice.syncDoneWithWarning": "Синхронизация завершена с предупреждениями: отправлено {{pushed}}, получено {{pulled}}, конфликтов {{conflicts}}",
    "notice.syncFailed": "Ошибка синхронизации: {{message}}",
    "notice.crdtMarkdownBlocked":
      "Совместное редактирование Markdown отключено: {{reason}}",
    "notice.crdtLeaseHeld":
      "Заметка редактируется на другом устройстве; отправка ваших правок временно приостановлена.",
    "notice.noteNonCrdtRemotePaused":
      "Эта заметка открыта на другом устройстве при выключенном CRDT; входящие изменения для {{path}} поставлены на паузу, чтобы не перезаписать ваш локальный текст.",
    "notice.noteReadonly":
      "Эта заметка сейчас доступна только для чтения на этом устройстве: {{reason}}",
    "notice.noteStructuralChangeBlocked":
      "Переименование, перемещение или удаление не отправлено, потому что заметка заблокирована в другом клиенте: {{path}}",
    "notice.noteTakeoverDone": "Запрошен перехват блокировки для {{path}}",
    "notice.noteTakeoverPending":
      "Перехват для {{path}} запрошен, но заметка всё ещё помечена как read-only.",
    "notice.noteTakeoverUnavailable":
      "Сначала откройте синхронизируемую Markdown-заметку.",
    "notice.telegramCodeCreated": "Код привязки Telegram создан",
    "notice.telegramCodeCreatedWithCode": "Код привязки Telegram создан: {{code}}",
    "notice.telegramCodeFailed": "Не удалось создать код Telegram: {{message}}",
    "notice.telegramRevokeFailed": "Не удалось отозвать Telegram-связку: {{message}}",
    "notice.telegramRevoked": "Telegram-чат {{chatId}} отвязан",
    "notice.vaultInviteCreated": "Приглашение в хранилище создано для {{email}}",
    "notice.vaultInviteRevoked": "Приглашение отозвано для {{email}}",
    "notice.vaultAccessUpdated": "Доступ к хранилищу обновлён для {{email}}",
    "invite.status.accepted": "принято",
    "invite.status.expired": "истекло",
    "invite.status.pending": "приглашение направлено, ожидает принятия",
    "invite.status.revoked": "отозвано",
    "role.editor": "редактор",
    "role.member": "участник",
    "role.owner": "владелец",
    "role.viewer": "просмотр",
    "settings.accessibleVaults": "Доступные хранилища",
    "settings.accessibleVaultsDesc":
      "Это хранилища, к которым у вашего аккаунта уже есть доступ, включая принятые приглашения. Выберите то, которое нужно открыть здесь.",
    "settings.accessibleVaultsBehavior":
      "Ничего не привязывается, пока вы не нажмёте «Подключить сюда». Если общие заметки должны жить отдельно, сначала откройте или создайте отдельный Obsidian vault, затем нажмите «Подключить сюда» уже из него.",
    "settings.accessToken": "Токен доступа",
    "settings.accessTokenDesc": "Bearer-токен для защищённых маршрутов сервера",
    "settings.accountSetup": "Настройка аккаунта",
    "settings.advancedSettings": "Продвинутые настройки",
    "settings.advancedSettingsDesc":
      "Редко нужные поля для диагностики, поддержки и нестандартного publish scope. Большинству пользователей этот раздел не нужен.",
    "settings.autoGenerated": "заполняется автоматически",
    "settings.autoSync": "Автосинхронизация",
    "settings.autoSyncDesc": "Синхронизировать изменения хранилища автоматически, пока Obsidian открыт",
    "settings.syncObsidianConfig": "Синхронизировать настройки и плагины Obsidian",
    "settings.syncObsidianConfigDesc":
      "Обменивать настройки .obsidian, темы, сниппеты и сторонние плагины. Сначала включите на устройстве-источнике, затем на остальных: при первом обмене уже загруженные серверные файлы приоритетнее. Рабочее пространство и локальные данные самого синхронизатора не передаются; после изменения файлов плагинов перезапустите Obsidian.",
    "settings.crdtMarkdownEnabled": "Совместное редактирование Markdown",
    "settings.crdtMarkdownEnabledDesc":
      "Использовать CRDT-канал для .md-файлов, чтобы одновременные правки сливались без whole-file 409 конфликтов. Все устройства этого vault должны работать на обновленном плагине.",
    "settings.crdtMarkdownBlockedHint":
      "Сейчас недоступно: {{reason}}",
    "settings.backendUrl": "URL сервера",
    "settings.backendUrlDesc": "Например: http://45.144.65.18",
    "settings.basicSyncDesc":
      "Этих настроек достаточно для персональной синхронизации между своими устройствами.",
    "settings.colleagueEmail": "Email коллеги",
    "settings.colleagueEmailDesc": "Email пользователя, которому нужен доступ к этому хранилищу",
    "settings.connectedTelegramChats": "Подключённые Telegram-чаты",
    "settings.currentLocalVault": "Текущий локальный vault: {{vaultName}}",
    "settings.connectCurrentVault": "Подключить текущий локальный vault",
    "settings.connectCurrentVaultDesc":
      "Выбранный server vault и папки будут синхронизироваться в текущий открытый Obsidian vault. Если нужен отдельный локальный vault, сначала создайте или откройте его в Obsidian, установите там этот плагин, затем подключите его.",
    "settings.connectSharedVaultDesc":
      "Подключает выбранное общее хранилище к Obsidian vault, который сейчас открыт на этом устройстве. Первая синхронизация остаётся ручной, чтобы случайно не смешать локальные заметки.",
    "settings.connectedServerVault": "Подключённый server vault: {{vault}}",
    "settings.currentDevice": "Текущее устройство: {{deviceId}}",
    "settings.currentMembers": "Текущие участники",
    "settings.deviceId": "ID устройства",
    "settings.deviceIdDesc": "Заполняется автоматически после регистрации устройства",
    "settings.deviceName": "Имя устройства",
    "settings.deviceNameDesc": "Понятное имя устройства на сервере",
    "settings.expiresAt": "Истекает: {{expiresAt}}",
    "settings.ignorePaths": "Игнорируемые пути",
    "settings.ignorePathsDesc": "Один путь или префикс на строку. Префиксы должны заканчиваться на '/'.",
    "settings.language": "Язык интерфейса",
    "settings.languageDesc": "Язык настроек, команд и уведомлений плагина",
    "settings.lastCode": "Последний код: {{code}}",
    "settings.lastErrorSuffix": " | Последняя ошибка: {{message}}",
    "settings.lastSyncWarningSuffix": " | Последнее предупреждение: {{message}}",
    "settings.lastSyncStatus": "Последняя синхронизация: {{lastSyncAt}}{{lastErrorSuffix}}{{lastWarningSuffix}}",
    "settings.loadMembershipsFailed": "Не удалось загрузить участников: {{message}}",
    "settings.loadTelegramFailed": "Не удалось загрузить Telegram-связки: {{message}}",
    "settings.loginCode": "Код входа",
    "settings.loginCodeDesc": "Введите одноразовый код, отправленный на email",
    "settings.loginCodeDevDesc":
      "Введите одноразовый код, отправленный на email. Тестовый сервер может подставить его здесь.",
    "settings.loginRequestExpires": "Последний запрос истекает: {{expiresAt}}",
    "settings.inviteSentReference": "Приглашение направлено | Роль: {{role}} | Статус: {{status}}",
    "settings.memberReference": "Роль: {{role}}",
    "settings.memberReferenceWithId": "Роль: {{role}} | ID пользователя: {{userId}}",
    "settings.membershipsNeedConfig": "Заполните URL сервера, email и ID хранилища, чтобы загрузить участников.",
    "settings.noVaultSelected": "Хранилище на сервере пока не выбрано.",
    "settings.noMembers": "Участников пока нет.",
    "settings.noPendingInvites": "Ожидающих приглашений нет.",
    "settings.noTelegramChats": "Telegram-чаты пока не подключены.",
    "settings.pendingInvites": "Направленные приглашения",
    "settings.platform": "Платформа",
    "settings.platformDesc": "Идентификатор платформы устройства",
    "settings.pluginUpdate": "Обновление плагина",
    "settings.pluginUpdateAvailable": "Доступная версия: {{latestVersion}}",
    "settings.pluginUpdateAvailableBuild":
      "Доступна новая сборка версии {{latestVersion}}",
    "settings.pluginUpdateChecking": "Проверка...",
    "settings.pluginUpdateCurrent": "Установлена последняя версия: {{latestVersion}}",
    "settings.pluginUpdateDesc": "Версия плагина: {{currentVersion}}. {{status}}",
    "settings.pluginUpdateFailed": "Последняя проверка не удалась: {{message}}",
    "settings.pluginUpdateInstalling": "Обновление...",
    "settings.pluginUpdateNotChecked": "Обновления ещё не проверялись.",
    "settings.publishCurrentVault": "Создать server-хранилище из этого локального vault",
    "settings.publishCurrentVaultDesc":
      "Используйте это только если текущего открытого локального Obsidian vault ещё нет на сервере. Кнопка создаёт новую запись server-хранилища из локального vault. Если server-хранилище уже существует, просто просканируйте и выберите его ниже.",
    "settings.publishCurrentVaultAvailableDesc":
      "У аккаунта уже есть доступные server-хранилища. Подключите одно из них ниже или создайте ещё одно, если это позволяет тариф.",
    "settings.publishCurrentVaultHiddenDesc":
      "Этот локальный vault уже привязан к server-хранилищу. Если нужен другой target, выберите его в списке ниже, а не создавайте новое хранилище здесь.",
    "settings.quickStart": "Быстрый старт",
    "settings.quickStartDesc":
      "Сначала пройдите обязательные шаги. Доступ коллегам, Telegram и служебные поля можно настроить позже, когда персональная синхронизация уже работает.",
    "settings.refreshAccount": "Обновить аккаунт",
    "settings.refreshAccountDesc":
      "Служебное действие. Повторно читает сохранённую сессию и восстанавливает данные пользователя и устройства, если интерфейс их потерял. Обычно в повседневной синхронизации не требуется.",
    "settings.refreshToken": "Токен обновления",
    "settings.refreshTokenDesc": "Токен для обновления токена доступа после ответа 401",
    "settings.requestLoginCode": "Запросить код входа",
    "settings.requestLoginCodeDesc": "Сервер отправит одноразовый код входа на этот email",
    "settings.reconnectCurrentVaultDesc":
      "Смена server vault или папок сбросит локальное состояние синхронизации и выключит auto-sync. Первую синхронизацию нужно запустить вручную.",
    "settings.runSyncNow": "Запустить синхронизацию",
    "settings.serverSyncFolders": "Папки сервера для синхронизации",
    "settings.serverSyncFoldersDesc":
      "Одна папка server vault на строку. Оставьте поле пустым, чтобы синхронизировать весь выбранный server vault в текущий открытый Obsidian vault. Эти папки применяются при подключении или переподключении локального vault.",
    "settings.serverSyncFoldersInviteDesc":
      "Эти папки пришли из принятого приглашения или прав доступа и здесь не меняются.",
    "settings.sharedAccessReady": "Доступ уже открыт",
    "settings.sharedAccessReadyDesc":
      "Ваш аккаунт может открыть «{{vault}}» с ролью {{role}}. Доступ: {{scope}}.",
    "settings.sharedAccessReadyDescWithInviter":
      "{{inviter}} открыл вам «{{vault}}» с ролью {{role}}. Доступ: {{scope}}.",
    "settings.setupStepAccount": "Указан email пользователя",
    "settings.setupStepLogin": "Вход завершён и устройство зарегистрировано",
    "settings.setupStepOptional": "Доступ коллегам и Telegram можно подключать уже после запуска персональной синхронизации",
    "settings.setupStepServer": "Указан адрес сервера",
    "settings.setupStepSync": "Плагин готов к первой синхронизации",
    "settings.setupStepVault": "Выбрано server-хранилище",
    "settings.vaultId": "ID server-хранилища",
    "settings.vaultIdDesc":
      "Служебный идентификатор выбранного server-хранилища. В повседневной работе обычно не нужен.",
    "settings.sharedFolders": "Общие папки",
    "settings.sharedFoldersDesc":
      "Используйте дерево папок, чтобы открыть всё хранилище или только выбранные папки.",
    "settings.sharedFolderScope": "Папки для доступа",
    "settings.sharedFolderScopeDesc":
      "Выберите всё хранилище или одну либо несколько папок в дереве.",
    "settings.selectedSharedFolders": "Выбрано папок: {{count}}",
    "settings.noShareableFolders": "В хранилище нет папок",
    "settings.status": "Статус: {{status}}",
    "settings.sync": "Синхронизация",
    "settings.syncFolders": "Папки для отправки",
    "settings.syncFoldersDesc":
      "Одна локальная папка на строку. Оставьте поле пустым, чтобы отправлять весь текущий Obsidian vault. Изменение сбрасывает локальное состояние синхронизации.",
    "settings.syncFoldersPlaceholder": "Проекты\nАрхив/Общее",
    "settings.syncInterval": "Интервал синхронизации (секунды)",
    "settings.syncIntervalDesc": "Резервный интервал опроса, когда включена автосинхронизация",
    "settings.telegramChat": "Чат {{chatId}}",
    "settings.telegramDesc":
      "Здесь можно создать одноразовый код Telegram, а затем отправить `/link CODE` боту в личном чате.",
    "settings.telegramInboxFolder": "Папка входящих Telegram",
    "settings.telegramInboxFolderDesc": "Папка назначения для заметок, созданных из Telegram-сообщений",
    "settings.telegramNeedConfig": "Заполните URL сервера и email, чтобы загрузить Telegram-связки.",
    "settings.title": "Arcalink Sync",
    "settings.unnamedVault": "Vault без имени",
    "settings.userEmail": "Email пользователя",
    "settings.userEmailDesc": "Основной идентификатор аккаунта для регистрации, доступа и Telegram",
    "settings.userId": "ID пользователя (справочно)",
    "settings.userIdDesc": "Определяется автоматически по email. Нужен только для диагностики и поддержки.",
    "settings.vaultConnection": "Подключение хранилища",
    "settings.vaultRole": "Роль в хранилище",
    "settings.vaultRoleDesc": "Роль в приглашении. Ограничение по папкам задаётся в поле папок для доступа.",
    "settings.vaultSharing": "Доступ к хранилищу",
    "settings.vaultSharingDesc":
      "ArcaLink создаёт приглашение по email коллеги. Выберите всё хранилище или конкретные папки в дереве.",
    "settings.wholeVaultAccess": "Весь vault",
    "settings.wholeVaultAccessInput": "все хранилище",
    "settings.folderScopeAccess": "Папки: {{folders}}",
    "status.never": "никогда",
    "stage.bootstrap-from-remote": "первичная загрузка с сервера",
    "stage.create-session": "создание сессии синхронизации",
    "stage.pull-remote-changes": "получение изменений с сервера",
    "stage.push-local-changes": "отправка локальных изменений",
    "stage.scan-local-after-pull": "сканирование хранилища после получения изменений",
    "stage.scan-local-before-push": "сканирование хранилища перед отправкой",
    "auth.status.authenticated": "Вход выполнен",
    "auth.status.unknown": "Проверка авторизации...",
    "auth.status.missing_token": "Нет входа — токен доступа отсутствует",
    "auth.status.refresh_failed": "Вход истёк — не удалось обновить токен",
    "auth.status.session_expired": "Вход истёк — сессия завершена",
    "auth.status.session_revoked": "Вход отозван — сессия аннулирована сервером",
    "auth.status.billing_blocked": "Синхронизация заблокирована — проверьте статус аккаунта",
    "auth.status.error": "Ошибка авторизации — см. подробности ниже",
    "auth.indicatorLabel": "Статус авторизации",
    "syncBlock.reason.none": "Проблем не обнаружено",
    "syncBlock.reason.not_configured": "Плагин не полностью настроен",
    "syncBlock.reason.missing_token": "Токен доступа отсутствует — войдите заново",
    "syncBlock.reason.session_expired": "Сессия истекла — войдите заново",
    "syncBlock.reason.session_revoked": "Сессия отозвана сервером — войдите заново",
    "syncBlock.reason.refresh_failed": "Не удалось обновить токен — войдите заново",
    "syncBlock.reason.billing_blocked": "Коммерческий статус аккаунта запрещает синхронизацию",
    "syncBlock.reason.network_error": "Сетевая ошибка — проверьте подключение",
    "syncBlock.reason.server_error": "Ошибка сервера — попробуйте позже",
    "syncBlock.label": "Статус синхронизации",
    "collaborationBlock.reason.none": "Проблем с совместной работой не обнаружено",
    "collaborationBlock.reason.billing_blocked_collaboration": "Подписка на совместную работу не оплачена — общий доступ и живое редактирование заблокированы",
    "collaborationBlock.reason.collaboration_not_in_plan": "Текущий тариф не включает совместную работу — смените тариф для доступа и живого редактирования",
    "collaborationBlock.reason.member_limit_exceeded": "Лимит участников хранилища исчерпан — смените тариф или удалите неиспользуемых участников",
    "collaborationBlock.label": "Статус совместной работы",
    "stage.sync-crdt-markdown": "синхронизация совместных Markdown-заметок",
    "settings.syncConflicts": "Конфликты синхронизации",
    "settings.syncConflictsNeedConfig": "Выберите хранилище и запустите первую синхронизацию, чтобы загрузить информацию о конфликтах.",
    "settings.noConflicts": "Открытых конфликтов не найдено.",
    "settings.syncConflictsDesc": "В этих файлах есть конфликтующие изменения. Разрешите их из плагина Obsidian на вашем устройстве.",
    "settings.conflictItemDesc": "{{createdAt}} | {{reason}} | {{opType}} | {{status}}",
    "settings.loadConflictsFailed": "Не удалось загрузить конфликты: {{message}}",
    "settings.loadConflictsUsingCache": "Показан сохранённый список конфликтов, потому что обновление не удалось: {{message}}",
    "settings.conflictDetailTitle": "Детали конфликта",
    "settings.conflictPath": "Путь",
    "settings.conflictCreatedAt": "Создан",
    "settings.conflictOperationType": "Операция",
    "settings.conflictReason": "Причина",
    "settings.conflictExpectedHash": "Ожидаемый hash",
    "settings.conflictActualHash": "Фактический hash",
    "settings.conflictStatus": "Статус",
    "settings.conflictDeviceId": "Устройство",
    "settings.conflictTargetPath": "Целевой путь",
    "settings.conflictResolutionUnsupported": "Этот тип конфликта пока доступен только для просмотра. Разрешите его в потоке устройства, который поддерживает {{entryType}} / {{operationType}}.",
    "button.viewConflictDetails": "Детали",
    "button.resolveKeepLocal": "Оставить локальную",
    "button.resolveAcceptRemote": "Принять серверную",
    "button.resolveKeepBoth": "Сохранить обе",
    "button.materializeRemote": "Показать серверную версию",
    "button.checkVaultDivergence": "Проверить расхождение",
    "button.mergeVaultDivergence": "Слить отсутствующие файлы",
    "button.acceptServerVaultState": "Принять сервер здесь",
    "button.publishLocalVaultState": "Опубликовать этот клиент",
    "resolution.keepLocal": "keep_local",
    "resolution.acceptRemote": "accept_remote",
    "resolution.keepBoth": "keep_both",
    "resolution.keepLocalDesc": "Опубликовать вашу локальную версию файла на сервере и отметить конфликт как разрешённый.",
    "resolution.keepLocalDeleteHashMismatchDesc": "Оставить локальное удаление: удалить текущую серверную версию файла и отметить конфликт разрешённым.",
    "resolution.acceptRemoteDesc": "Заменить локальный файл текущей серверной версией. Будет сохранена резервная копия.",
    "resolution.keepBothDesc": "Оставить серверную версию основным файлом, а локальную сохранить как копию конфликта.",
    "resolution.materializeDesc": "Скачать текущую серверную версию в файл для сравнения рядом с вашей локальной копией.",
    "confirm.remoteConflictContentMissingUseLocal": "Содержимое серверной версии {{path}} отсутствует и не может быть восстановлено с сервера. Использовать локальную версию с этого устройства?",
    "error.localFileNotFound": "Локальный файл {{path}} больше не существует",
    "error.remoteFileNotAvailable": "Серверная версия {{path}} недоступна",
    "error.remoteConflictContentMissing": "Содержимое серверной версии {{path}} отсутствует. Для разрешения конфликта оставьте локальную версию.",
    "error.syncBlockedBilling.generic": "Синхронизация заблокирована, потому что текущий статус подписки не позволяет её выполнять.",
    "error.syncBlockedBilling.expired": "Синхронизация заблокирована, потому что подписка истекла.",
    "error.syncBlockedBilling.past_due": "Синхронизация заблокирована, потому что оплата подписки просрочена.",
    "error.syncBlockedBilling.suspended": "Синхронизация заблокирована, потому что подписка приостановлена.",
    "error.syncBlockedBilling.canceled": "Синхронизация заблокирована, потому что подписка отменена.",
    "error.unsupportedConflictResolution": "Разрешение конфликта для {{entryType}} / {{operationType}} пока не поддерживается",
    "error.resolveConflictFailed": "Не удалось разрешить конфликт: {{message}}",
    "notice.conflictResolved": "Конфликт разрешён",
    "notice.conflictResolveFailed": "Не удалось разрешить конфликт: {{message}}",
    "notice.remoteMaterialized": "Серверная версия загружена в {{path}}",
    "notice.remoteMaterializeFailed": "Не удалось скачать серверную версию: {{message}}",
    "notice.vaultDivergenceServerAccepted":
      "Серверная картина применена: загружено {{applied}}, локально удалено {{removed}}, safety copies {{preserved}}",
    "notice.vaultDivergenceLocalPublished":
      "Локальная картина опубликована: операций {{pushed}}, конфликтов {{conflicts}}",
    "notice.vaultDivergenceMerged":
      "Слияние выполнено: скачано с сервера {{downloaded}}, загружено на сервер {{uploaded}}, директорий создано на сервере {{directories}}, отсутствующих объектов на сервере {{missing}}, конфликтов {{conflicts}}, файлов с разным содержимым оставлено {{changed}}",
    "notice.vaultDivergenceResolveFailed": "Не удалось устранить расхождение vault: {{message}}",
    "settings.vaultDivergence": "Расхождение vault",
    "settings.vaultDivergenceNeedConfig": "Выберите хранилище и запустите первую синхронизацию, чтобы сравнить набор файлов.",
    "settings.vaultDivergenceDesc": "Сравнивает этот локальный vault с серверным индексом без изменения файлов.",
    "settings.checkVaultDivergence": "Сравнить локальные и серверные файлы",
    "settings.checkVaultDivergenceDesc": "Сканирует текущий vault и показывает пути, которые есть только с одной стороны или отличаются содержимым.",
    "settings.loadVaultDivergenceFailed": "Не удалось сравнить vault: {{message}}",
    "settings.vaultDivergenceCheckedAt": "Проверено: {{checkedAt}}",
    "settings.vaultDivergenceCounts": "Локально: {{localCount}} | Сервер: {{remoteCount}} | Только локально: {{localOnlyCount}} | Только на сервере: {{remoteOnlyCount}} | Изменены: {{changedCount}}",
    "settings.vaultDivergenceNoDiff": "Расхождений в наборе файлов не найдено.",
    "settings.vaultDivergenceLocalOnly": "Только в этом локальном vault",
    "settings.vaultDivergenceRemoteOnly": "Только на сервере",
    "settings.vaultDivergenceChanged": "Разное содержимое",
    "settings.vaultDivergenceMore": "и ещё {{count}}",
    "settings.vaultDivergenceTimeHint":
      "Время: локально — mtime файла на этом клиенте; сервер — когда сервер принял последнюю операцию.",
    "settings.vaultDivergenceSideLocal": "Локально",
    "settings.vaultDivergenceSideServer": "Сервер",
    "settings.vaultDivergenceSideMissing": "{{side}}: отсутствует",
    "settings.vaultDivergenceSideMeta":
      "{{side}}: {{modifiedAt}} | {{type}} | {{size}} | {{hash}}",
    "settings.mergeVaultDivergence": "Слить наборы файлов без перезаписи",
    "settings.mergeVaultDivergenceDesc":
      "Скачает файлы, которые есть только на сервере, и загрузит файлы, которые есть только на этом клиенте. Файлы с разным содержимым по одному пути не изменяются (останется: {{changed}}).",
    "settings.acceptServerVaultState": "Принять серверную картину на этом клиенте",
    "settings.acceptServerVaultStateDesc":
      "Файлы только на сервере будут скачаны, изменённые файлы будут заменены серверными версиями, а локальные-only пути будут удалены после сохранения safety copies в .sync-conflict-local.",
    "settings.publishLocalVaultState": "Сделать этот клиент источником",
    "settings.publishLocalVaultStateDesc":
      "Файлы только локально будут созданы на сервере, изменённые файлы будут опубликованы с этого клиента, а server-only пути будут удалены с сервера.",
    "confirm.acceptServerVaultState":
      "Применить серверную картину к этому клиенту для {{count}} расхождений? Server-only файлы будут скачаны; local-only файлы будут удалены после создания safety copies.",
    "confirm.publishLocalVaultState":
      "Опубликовать этот клиент как источник для {{count}} расхождений? Local-only файлы будут загружены; server-only файлы будут удалены с сервера для всех клиентов.",
    "confirm.mergeVaultDivergence":
      "Слить {{count}} путей, которые есть только с одной стороны? Файлы с разным содержимым по одному пути не будут изменены (останется: {{changed}}).",
    "status.unknown": "неизвестно",
    "sectionStatus.connected": "подключен",
    "sectionStatus.notConnected": "не подключен",
    "sectionStatus.configured": "настроен",
    "sectionStatus.notConfigured": "не настроен",
    "sectionStatus.checking": "проверка…",
    "sectionStatus.blocked": "заблокировано",
    "sectionStatus.error": "ошибка",
    "sectionStatus.autoSync": "автосинхронизация",
    "sectionStatus.manualSync": "ручная синхронизация",
    "sectionStatus.syncConflicted": "Конфликт синхронизации",
    "sectionStatus.noConflicts": "Нет конфликтов",
    "sectionStatus.conflictsOpen": "Открыто: {{count}}",
    "sectionStatus.noVaultDivergence": "Нет расхождений",
    "sectionStatus.vaultDiverged": "Расхождений: {{count}}",
    "statusBar.notePresence":
      "HTTP Sync: заметка {{path}} открыта в другом клиенте ({{holders}})",
    "statusBar.noteReadonly":
      "HTTP Sync: заметка {{path}} доступна только для чтения ({{holders}})",
    "statusBar.notePresenceShort": "Заметка: +{{count}}",
    "statusBar.noteReadonlyShort": "Заметка: только чтение",
    "statusBar.noteUnknownHolders": "неизвестные держатели",
    "statusBar.brand": "Arcalink",
    "statusBar.openSettings": "Открыть настройки Arcalink",
    "statusBar.lampOk": "Arcalink: всё работает",
    "statusBar.lampNoConnection": "Arcalink: нет связи с сервером",
    "statusBar.lampBlocked": "Arcalink: синхронизация заблокирована",
    "statusBar.lampSyncError": "Arcalink: ошибка синхронизации",
    "statusBar.lampConflict": "Arcalink: есть конфликты синхронизации",
    "statusBar.lampConflictCount": "Arcalink: открытых конфликтов: {{count}}",
    "statusBar.syncModeAuto": "Автосинхронизация",
    "statusBar.syncModeManual": "Ручная синхронизация",
    "statusBar.serverLabel": "Сервер",
    "statusBar.serverConnected": "подключён",
    "statusBar.serverChecking": "проверка",
    "statusBar.serverBlocked": "заблокирован",
    "statusBar.serverError": "ошибка",
    "statusBar.serverNotConfigured": "не настроен",
    "statusBar.serverNotConnected": "нет подключения",
    "statusBar.syncLabel": "Синхронизация",
    "statusBar.syncIdle": "в ожидании",
    "statusBar.syncing": "синхронизация",
    "statusBar.syncProgress": "Файлы: {{completed}}/{{total}}",
    "statusBar.syncQueued": "в очереди",
    "statusBar.syncError": "ошибка",
    "statusBar.syncNotConfigured": "не настроена",
  },
};

function translate(language, key, params = {}) {
  const locale = language === "en" ? "en" : "ru";
  const template = UI_LOCALES[locale][key] || UI_LOCALES.en[key] || key;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : ""
  );
}

function translateRole(language, role) {
  return translate(language, `role.${role || "member"}`);
}

function normalizeSharedFolderScopeForApi(paths) {
  const rawPaths = (Array.isArray(paths) ? paths : [paths])
    .map((path) => String(path || "").trim())
    .filter(Boolean)
    .filter((path) => !isWholeVaultScopeInputValue(path));
  if (rawPaths.length === 0) {
    return [];
  }
  const normalized = normalizeSyncFolderPathList(rawPaths);
  return normalized.includes("") ? [] : normalized;
}

function isWholeVaultScopeInputValue(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();
  return [
    "все хранилище",
    "всё хранилище",
    "весь vault",
    "whole vault",
  ].includes(normalizedValue);
}

function formatSharedFolderScope(language, paths) {
  const normalized = normalizeSharedFolderScopeForApi(paths);
  if (!normalized.length) {
    return translate(language, "settings.wholeVaultAccess");
  }
  return translate(language, "settings.folderScopeAccess", {
    folders: normalized.join(", "),
  });
}

class ObsidianHttpSyncSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.sharingDraft = {
      userEmail: "",
      role: "editor",
      sharedFolderPaths: this.plugin.t("settings.wholeVaultAccessInput"),
    };
    this.sharingFolderExpandedPaths = new Set();
    this.availableVaults = [];
    this.selectedVaultDraftId = "";
    this.syncFolderDraft = null;
    this.vaultConnectionAutoOpened = false;
    this.sectionOpenState = {
      account: false,
      vaultConnection: false,
      sync: false,
      vaultDivergence: false,
      conflicts: false,
      sharing: false,
      telegram: false,
    };
    this.vaultDivergenceReport = null;
    this.pluginUpdateState = {
      checking: false,
      installing: false,
      checkedAt: "",
      currentVersion: this.plugin.getCurrentPluginVersion(),
      latestVersion: "",
      updateAvailable: false,
      hasDifferentFiles: false,
      lastError: "",
    };
  }

  getAccessibleVaultById(vaultId) {
    const targetVaultId = String(vaultId || "").trim();
    return this.availableVaults.find(
      (accessibleVault) =>
        accessibleVault &&
        accessibleVault.vault &&
        String(accessibleVault.vault.id || "") === targetVaultId
    );
  }

  getSharingDraftFolderPaths() {
    return normalizeSharedFolderScopeForApi(
      String(this.sharingDraft.sharedFolderPaths || "").split("\n")
    );
  }

  setSharingDraftFolderPaths(paths) {
    const normalizedPaths = normalizeSharedFolderScopeForApi(paths);
    this.sharingDraft.sharedFolderPaths = normalizedPaths.length
      ? normalizedPaths.join("\n")
      : this.plugin.t("settings.wholeVaultAccessInput");
    return normalizedPaths;
  }

  getShareableVaultFolderTree() {
    const vault = this.app && this.app.vault;
    const root = vault && typeof vault.getRoot === "function" ? vault.getRoot() : null;
    if (!root || !Array.isArray(root.children)) {
      return [];
    }

    const buildNode = (folder) => ({
      name: String(folder.name || folder.path || ""),
      path: normalizePath(String(folder.path || "")),
      children: (Array.isArray(folder.children) ? folder.children : [])
        .filter(
          (child) =>
            child instanceof TFolder && isShareableFolderPath(child.path)
        )
        .sort((left, right) =>
          String(left.name || left.path || "").localeCompare(
            String(right.name || right.path || "")
          )
        )
        .map(buildNode),
    });

    return root.children
      .filter(
        (child) => child instanceof TFolder && isShareableFolderPath(child.path)
      )
      .sort((left, right) =>
        String(left.name || left.path || "").localeCompare(
          String(right.name || right.path || "")
        )
      )
      .map(buildNode);
  }

  renderSharedFolderSelector(controlEl) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    controlEl.empty();
    const selectorEl = controlEl.createEl("details", {
      cls: "arcalink-shared-folder-selector",
    });
    selectorEl.style.minWidth = "260px";
    selectorEl.style.maxWidth = "380px";
    selectorEl.style.width = "100%";

    const summaryEl = selectorEl.createEl("summary");
    summaryEl.style.cursor = "pointer";
    summaryEl.style.whiteSpace = "normal";

    const treeEl = selectorEl.createDiv({
      cls: "arcalink-shared-folder-tree",
    });
    treeEl.style.maxHeight = "280px";
    treeEl.style.overflow = "auto";
    treeEl.style.padding = "8px 4px 4px";

    const updateSelection = (path, checked) => {
      const currentPaths = this.getSharingDraftFolderPaths();
      const nextPaths = checked
        ? currentPaths.concat(path)
        : currentPaths.filter((currentPath) => currentPath !== path);
      this.setSharingDraftFolderPaths(nextPaths);
      renderTree();
    };

    const createCheckboxRow = (
      container,
      label,
      path,
      selectedPaths
    ) => {
      const rowEl = container.createEl("span", {
        cls: "arcalink-shared-folder-row",
      });
      rowEl.style.display = "flex";
      rowEl.style.alignItems = "center";
      rowEl.style.gap = "6px";
      rowEl.style.minHeight = "26px";

      const checkboxEl = rowEl.createEl("input");
      checkboxEl.type = "checkbox";
      const selectedExact = path ? selectedPaths.includes(path) : selectedPaths.length === 0;
      const coveredByParent = path
        ? selectedPaths.some((selectedPath) => path.startsWith(`${selectedPath}/`))
        : false;
      const hasSelectedChild = path
        ? selectedPaths.some((selectedPath) => selectedPath.startsWith(`${path}/`))
        : false;
      checkboxEl.checked = selectedExact || coveredByParent;
      checkboxEl.indeterminate = !checkboxEl.checked && hasSelectedChild;
      checkboxEl.disabled = coveredByParent;
      checkboxEl.setAttribute("aria-label", label);
      checkboxEl.addEventListener("click", (event) => event.stopPropagation());
      checkboxEl.addEventListener("change", (event) => {
        event.stopPropagation();
        if (!path) {
          this.setSharingDraftFolderPaths([]);
          renderTree();
          return;
        }
        updateSelection(path, event.currentTarget.checked);
      });

      const labelEl = rowEl.createEl("span", { text: label });
      labelEl.style.overflowWrap = "anywhere";
      return rowEl;
    };

    const renderFolderNode = (container, node, selectedPaths, depth) => {
      const nodeEl = container.createDiv({
        cls: "arcalink-shared-folder-node",
      });
      nodeEl.style.paddingLeft = `${depth * 14}px`;
      if (!node.children.length) {
        createCheckboxRow(nodeEl, node.name, node.path, selectedPaths);
        return;
      }

      const branchEl = nodeEl.createEl("details");
      branchEl.open = this.sharingFolderExpandedPaths.has(node.path);
      branchEl.addEventListener("toggle", () => {
        if (branchEl.open) {
          this.sharingFolderExpandedPaths.add(node.path);
        } else {
          this.sharingFolderExpandedPaths.delete(node.path);
        }
      });
      const branchSummaryEl = branchEl.createEl("summary");
      branchSummaryEl.style.cursor = "pointer";
      createCheckboxRow(
        branchSummaryEl,
        node.name,
        node.path,
        selectedPaths
      );
      const childrenEl = branchEl.createDiv();
      for (const child of node.children) {
        renderFolderNode(childrenEl, child, selectedPaths, depth + 1);
      }
    };

    const renderTree = () => {
      const selectedPaths = this.getSharingDraftFolderPaths();
      summaryEl.setText(
        selectedPaths.length
          ? t("settings.selectedSharedFolders", { count: selectedPaths.length })
          : t("settings.wholeVaultAccessInput")
      );
      treeEl.empty();
      createCheckboxRow(
        treeEl,
        t("settings.wholeVaultAccessInput"),
        "",
        selectedPaths
      );
      const folderTree = this.getShareableVaultFolderTree();
      if (!folderTree.length) {
        const emptyEl = treeEl.createEl("p", {
          text: t("settings.noShareableFolders"),
        });
        emptyEl.style.opacity = "0.72";
        emptyEl.style.margin = "6px 0 2px";
        return;
      }
      for (const folder of folderTree) {
        renderFolderNode(treeEl, folder, selectedPaths, 0);
      }
    };

    renderTree();
  }

  getAccessibleVaultLabel(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const membership =
      accessibleVault && accessibleVault.membership ? accessibleVault.membership : {};
    if (!vault.id) {
      return "";
    }
    const role = translateRole(this.plugin.settings.language, membership.role || "member");
    return `${vault.name || vault.id} (${role})`;
  }

  getAccessibleVaultScopeLabel(accessibleVault) {
    const paths = this.plugin.getAccessibleVaultSyncFolderPaths(accessibleVault);
    if (paths.includes("")) {
      return this.plugin.t("settings.wholeVaultAccess");
    }
    return this.plugin.t("settings.folderScopeAccess", {
      folders: paths.join(", "),
    });
  }

  getAccessibleVaultConnectPrompt(accessibleVault) {
    const vault = accessibleVault && accessibleVault.vault ? accessibleVault.vault : {};
    const membership =
      accessibleVault && accessibleVault.membership ? accessibleVault.membership : {};
    const vaultLabel = vault.name || vault.id || this.plugin.t("status.unknown");
    const role = translateRole(this.plugin.settings.language, membership.role || "member");
    const scope = this.getAccessibleVaultScopeLabel(accessibleVault);
    const inviter = String(membership.invited_by_user_email || "").trim();
    if (inviter) {
      return this.plugin.t("settings.sharedAccessReadyDescWithInviter", {
        vault: vaultLabel,
        role,
        scope,
        inviter,
      });
    }
    return this.plugin.t("settings.sharedAccessReadyDesc", {
      vault: vaultLabel,
      role,
      scope,
    });
  }

  shouldPromptVaultConnection() {
    return Boolean(!this.plugin.settings.vaultId && this.availableVaults.length > 0);
  }

  ensureVaultConnectionDraft() {
    if (!this.selectedVaultDraftId && this.plugin.settings.vaultId) {
      this.selectedVaultDraftId = this.plugin.settings.vaultId;
    }
    if (!this.selectedVaultDraftId && this.availableVaults.length === 1) {
      const onlyVault = this.availableVaults[0] && this.availableVaults[0].vault;
      this.selectedVaultDraftId = onlyVault && onlyVault.id ? onlyVault.id : "";
    }
    if (this.syncFolderDraft === null) {
      const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
      this.syncFolderDraft = formatSyncFolderPaths(
        selectedAccessibleVault
          ? this.plugin.getAccessibleVaultSyncFolderPaths(selectedAccessibleVault)
          : this.plugin.settings.syncFolderPaths
      );
    }
  }

  async setSelectedVaultDraftId(vaultId) {
    this.selectedVaultDraftId = String(vaultId || "").trim();
    const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
    if (!selectedAccessibleVault) {
      this.syncFolderDraft = formatSyncFolderPaths(this.plugin.settings.syncFolderPaths);
      return;
    }

    let syncFolderPaths = this.plugin.getAccessibleVaultSyncFolderPaths(selectedAccessibleVault);
    if (!this.plugin.hasEmbeddedAccessibleVaultSyncFolderPaths(selectedAccessibleVault)) {
      try {
        const syncScope = await this.plugin.loadVaultSyncScope(this.selectedVaultDraftId);
        selectedAccessibleVault.sync_scope = syncScope;
        syncFolderPaths = normalizeSyncFolderPathList(
          syncScope && Array.isArray(syncScope.sync_folder_paths)
            ? syncScope.sync_folder_paths
            : []
        );
      } catch (error) {
        console.warn("[obsidian-http-sync] Could not load vault sync scope", error);
      }
    }
    this.syncFolderDraft = formatSyncFolderPaths(syncFolderPaths);
  }

  async maybePreloadAccessibleVaults() {
    if (this.availableVaults.length > 0) {
      return;
    }
    if (
      !this.plugin.settings.baseUrl ||
      (!this.plugin.settings.userEmail && !this.plugin.settings.userId) ||
      (!this.plugin.settings.accessToken && !this.plugin.settings.refreshToken)
    ) {
      return;
    }
    await this.loadAccessibleVaults({ notify: false });
  }

  renderAuthStatus(containerEl) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    const authState = this.plugin.settings.authState || DEFAULT_AUTH_STATE;
    const authStatusKey = `auth.status.${authState.status}`;
    const authStatusLabel = t(authStatusKey);
    const syncBlockKey = `syncBlock.reason.${
      this.plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE
    }`;
    const syncBlockLabel = t(syncBlockKey);

    const statusBlock = containerEl.createDiv();
    const isConfigured = this.plugin.isConfigured();
    const isGood =
      isConfigured &&
      authState.status === AUTH_STATUS.AUTHENTICATED &&
      (this.plugin.settings.syncBlockReason === SYNC_BLOCK_REASON.NONE ||
        !this.plugin.settings.syncBlockReason);
    const isWarning =
      authState.status === AUTH_STATUS.UNKNOWN ||
      authState.status === AUTH_STATUS.MISSING_TOKEN;
    const indicator = isGood ? "🟢" : isWarning ? "🟡" : "🔴";

    statusBlock.createEl("h3", {
      text: `${indicator} ${t("auth.indicatorLabel")}`,
    });

    const statusLine = statusBlock.createEl("p");
    statusLine.createEl("strong", { text: `${authStatusLabel}` });

    if (
      this.plugin.settings.syncBlockReason &&
      this.plugin.settings.syncBlockReason !== SYNC_BLOCK_REASON.NONE
    ) {
      statusBlock.createEl("p", {
        text: `${t("syncBlock.label")}: ${syncBlockLabel}`,
      });
    }

    if (authState.lastChecked) {
      const checkedLabel =
        (this.plugin.settings.language === "ru" ? "Проверено" : "Checked") +
        ": " +
        new Date(authState.lastChecked).toLocaleString();
      statusBlock.createEl("p", {
        text: checkedLabel,
        cls: "setting-item-description",
      });
    }
  }

  renderSetupChecklist(containerEl) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    const checklist = containerEl.createDiv();
    checklist.createEl("h3", { text: t("settings.quickStart") });
    checklist.createEl("p", { text: t("settings.quickStartDesc") });
    const items = [
      {
        done: Boolean(this.plugin.settings.baseUrl),
        text: t("settings.setupStepServer"),
      },
      {
        done: Boolean(this.plugin.settings.userEmail),
        text: t("settings.setupStepAccount"),
      },
      {
        done: Boolean(
          this.plugin.settings.userId &&
            this.plugin.settings.deviceId &&
            (this.plugin.settings.accessToken || this.plugin.settings.refreshToken)
        ),
        text: t("settings.setupStepLogin"),
      },
      {
        done: Boolean(this.plugin.settings.vaultId),
        text: t("settings.setupStepVault"),
      },
      {
        done: Boolean(this.plugin.isConfigured()),
        text: t("settings.setupStepSync"),
      },
      {
        done: true,
        text: t("settings.setupStepOptional"),
      },
    ];
    const list = checklist.createEl("ul");
    for (const item of items) {
      list.createEl("li", {
        text: `${item.done ? "✓" : "○"} ${item.text}`,
      });
    }
  }

  renderPluginUpdateSettings(containerEl) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    const updateState = this.pluginUpdateState || {};
    new Setting(containerEl)
      .setName(t("settings.pluginUpdate"))
      .setDesc(this.getPluginUpdateDescription())
      .addButton((button) => {
        button
          .setButtonText(t("button.checkUpdates"))
          .setDisabled(Boolean(updateState.checking || updateState.installing))
          .onClick(async () => {
            this.pluginUpdateState = {
              ...this.pluginUpdateState,
              checking: true,
              lastError: "",
            };
            await this.display();
            try {
              const result = await this.plugin.checkForPluginUpdate();
              this.pluginUpdateState = {
                checking: false,
                installing: false,
                checkedAt: new Date().toISOString(),
                currentVersion: result.currentVersion,
                latestVersion: result.latestVersion,
                updateAvailable: result.updateAvailable,
                hasDifferentFiles: result.hasDifferentFiles,
                lastError: "",
              };
              new Notice(
                result.updateAvailable
                  ? t("notice.pluginUpdateAvailable", { version: result.latestVersion })
                  : t("notice.pluginUpdateNotAvailable")
              );
            } catch (error) {
              this.pluginUpdateState = {
                ...this.pluginUpdateState,
                checking: false,
                installing: false,
                lastError: error.message,
              };
              new Notice(t("notice.pluginUpdateCheckFailed", { message: error.message }));
            }
            await this.display();
          });
      })
      .addButton((button) => {
        button
          .setCta()
          .setButtonText(t("button.updatePlugin"))
          .setDisabled(
            Boolean(
              updateState.checking ||
                updateState.installing ||
                !updateState.updateAvailable
            )
          )
          .onClick(async () => {
            this.pluginUpdateState = {
              ...this.pluginUpdateState,
              installing: true,
              lastError: "",
            };
            await this.display();
            try {
              const result = await this.plugin.installPluginUpdate();
              this.pluginUpdateState = {
                checking: false,
                installing: false,
                checkedAt: new Date().toISOString(),
                currentVersion: result.latestVersion,
                latestVersion: result.latestVersion,
                updateAvailable: false,
                hasDifferentFiles: false,
                lastError: "",
              };
              new Notice(
                t("notice.pluginUpdateInstalled", { version: result.latestVersion }),
                8000
              );
            } catch (error) {
              this.pluginUpdateState = {
                ...this.pluginUpdateState,
                installing: false,
                lastError: error.message,
              };
              new Notice(t("notice.pluginUpdateInstallFailed", { message: error.message }));
            }
            await this.display();
          });
      });
  }

  getPluginUpdateDescription() {
    const updateState = this.pluginUpdateState || {};
    const currentVersion =
      updateState.currentVersion || this.plugin.getCurrentPluginVersion();
    let status;
    if (updateState.checking) {
      status = this.plugin.t("settings.pluginUpdateChecking");
    } else if (updateState.installing) {
      status = this.plugin.t("settings.pluginUpdateInstalling");
    } else if (updateState.lastError) {
      status = this.plugin.t("settings.pluginUpdateFailed", {
        message: updateState.lastError,
      });
    } else if (updateState.updateAvailable) {
      status = this.plugin.t(
        updateState.hasDifferentFiles
          ? "settings.pluginUpdateAvailableBuild"
          : "settings.pluginUpdateAvailable",
        {
          latestVersion: updateState.latestVersion || currentVersion,
        }
      );
    } else if (updateState.checkedAt) {
      status = this.plugin.t("settings.pluginUpdateCurrent", {
        latestVersion: updateState.latestVersion || currentVersion,
      });
    } else {
      status = this.plugin.t("settings.pluginUpdateNotChecked");
    }
    return this.plugin.t("settings.pluginUpdateDesc", {
      currentVersion,
      status,
    });
  }

  createSummaryWithStatus(detailsEl, title, initialStatus = "") {
    const summary = detailsEl.createEl("summary");
    const titleSpan = summary.createSpan({ text: title });
    const statusSpan = summary.createSpan({ text: initialStatus || "" });
    statusSpan.style.cssFloat = "right";
    statusSpan.style.opacity = "0.7";
    return statusSpan;
  }

  bindSectionOpenState(detailsEl, sectionKey) {
    const normalizedKey = String(sectionKey || "").trim();
    if (!normalizedKey) {
      return detailsEl;
    }
    detailsEl.open = Boolean(this.sectionOpenState[normalizedKey]);
    detailsEl.addEventListener("toggle", () => {
      this.sectionOpenState[normalizedKey] = detailsEl.open;
    });
    return detailsEl;
  }

  getAuthSectionStatus() {
    const authState = this.plugin.settings.authState || DEFAULT_AUTH_STATE;
    return this.plugin.t(`auth.status.${authState.status}`);
  }

  getVaultConnectionStatus() {
    return this.plugin.t(
      this.plugin.settings.vaultId
        ? "sectionStatus.connected"
        : "sectionStatus.notConnected"
    );
  }

  getSyncSectionStatus() {
    if (!this.plugin.isConfigured()) {
      return this.plugin.t("sectionStatus.notConfigured");
    }
    if (
      this.plugin.settings.syncBlockReason &&
      this.plugin.settings.syncBlockReason !== SYNC_BLOCK_REASON.NONE
    ) {
      return this.plugin.t("sectionStatus.blocked");
    }
    if (this.plugin.settings.lastError) {
      return this.plugin.t("sectionStatus.error");
    }
    if (this.plugin.getOpenConflictCount() > 0) {
      return this.plugin.t("sectionStatus.syncConflicted");
    }
    if (this.plugin.settings.autoSync) {
      return this.plugin.t("sectionStatus.autoSync");
    }
    return this.plugin.t("sectionStatus.manualSync");
  }

  getSharingSectionStatus() {
    if (
      !this.plugin.settings.baseUrl ||
      (!this.plugin.settings.userEmail && !this.plugin.settings.userId) ||
      !this.plugin.settings.vaultId
    ) {
      return this.plugin.t("sectionStatus.notConfigured");
    }
    if (
      this.plugin.settings.collaborationBlockReason &&
      this.plugin.settings.collaborationBlockReason !== COLLABORATION_BLOCK_REASON.NONE
    ) {
      return this.plugin.t("sectionStatus.blocked");
    }
    return this.plugin.t("sectionStatus.checking");
  }

  getTelegramSectionStatus() {
    if (
      !this.plugin.settings.baseUrl ||
      (!this.plugin.settings.userEmail && !this.plugin.settings.userId)
    ) {
      return this.plugin.t("sectionStatus.notConnected");
    }
    return this.plugin.t("sectionStatus.checking");
  }

  getCrdtMarkdownSettingDescription() {
    const baseDescription = this.plugin.t("settings.crdtMarkdownEnabledDesc");
    const reason = String(this.plugin.settings.collaborationBlockReason || "").trim();
    if (!reason || reason === COLLABORATION_BLOCK_REASON.NONE) {
      return baseDescription;
    }
    return `${baseDescription} ${this.plugin.t("settings.crdtMarkdownBlockedHint", {
      reason: this.plugin.t(`collaborationBlock.reason.${reason}`),
    })}`;
  }

  isCurrentUserMembership(membership) {
    const currentUserId = String(this.plugin.settings.userId || "").trim();
    const currentUserEmail = String(this.plugin.settings.userEmail || "")
      .trim()
      .toLowerCase();
    const memberUserId = String((membership && membership.user_id) || "").trim();
    const memberUserEmail = String(this.getMembershipEmail(membership))
      .trim()
      .toLowerCase();
    return Boolean(
      (currentUserId && memberUserId === currentUserId) ||
        (currentUserEmail && memberUserEmail === currentUserEmail)
    );
  }

  getMembershipEmail(membership) {
    return String(
      (membership && (membership.user_email || membership.email || membership.userEmail)) || ""
    ).trim();
  }

  getMembershipLabel(membership) {
    return (
      this.getMembershipEmail(membership) ||
      String((membership && membership.user_id) || "").trim() ||
      this.plugin.t("status.unknown")
    );
  }

  getInviteEmail(invite) {
    return String((invite && (invite.email || invite.user_email || invite.userEmail)) || "").trim();
  }

  getInviteStatusLabel(invite) {
    const status = String((invite && invite.status) || "pending").trim().toLowerCase();
    return this.plugin.t(`invite.status.${status}`);
  }

  async display() {
    const { containerEl } = this;
    const t = (key, params = {}) => this.plugin.t(key, params);
    containerEl.empty();
    const installedManifest = await this.plugin.refreshInstalledPluginManifest?.();
    const installedVersion = String(installedManifest?.version || "").trim();
    if (installedVersion) {
      this.pluginUpdateState.currentVersion = installedVersion;
    }
    await this.maybePreloadAccessibleVaults();
    this.ensureVaultConnectionDraft();

    containerEl.createEl("h2", { text: t("settings.title") });
    this.renderSetupChecklist(containerEl);
    this.renderAuthStatus(containerEl);
    this.renderPluginUpdateSettings(containerEl);
    const accountDetails = containerEl.createEl("details");
    this.bindSectionOpenState(accountDetails, "account");
    this.createSummaryWithStatus(accountDetails, t("settings.accountSetup"), this.getAuthSectionStatus());
    accountDetails.createEl("p", { text: t("settings.basicSyncDesc") });
    const accountContainer = accountDetails.createDiv();

    new Setting(accountContainer)
      .setName(t("settings.language"))
      .setDesc(t("settings.languageDesc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("ru", "Русский");
        dropdown.addOption("en", "English");
        dropdown.setValue(this.plugin.settings.language || "ru");
        dropdown.onChange(async (value) => {
          this.plugin.settings.language = value === "en" ? "en" : "ru";
          await this.plugin.saveSettings();
          await this.display();
        });
      });

    new Setting(accountContainer)
      .setName(t("settings.backendUrl"))
      .setDesc(t("settings.backendUrlDesc"))
      .addText((text) =>
        text
          .setPlaceholder("http://45.144.65.18")
          .setValue(this.plugin.settings.baseUrl)
          .onChange(async (value) => {
            this.plugin.settings.baseUrl = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(accountContainer)
      .setName(t("settings.userEmail"))
      .setDesc(t("settings.userEmailDesc"))
      .addText((text) =>
        text
          .setPlaceholder("me@example.com")
          .setValue(this.plugin.settings.userEmail || "")
          .onChange(async (value) => {
            const nextEmail = value.trim().toLowerCase();
            const previousEmail = String(this.plugin.settings.userEmail || "")
              .trim()
              .toLowerCase();
            this.plugin.settings.userEmail = nextEmail;
            if (nextEmail !== previousEmail) {
              this.plugin.settings.userId = "";
            }
            await this.plugin.saveSettings();
          })
      );

    new Setting(accountContainer)
      .setName(t("settings.requestLoginCode"))
      .setDesc(
        this.plugin.settings.authLoginExpiresAt
          ? t("settings.loginRequestExpires", {
              expiresAt: this.plugin.settings.authLoginExpiresAt,
            })
          : t("settings.requestLoginCodeDesc")
      )
      .addButton((button) =>
        button.setCta().setButtonText(t("button.requestCode")).onClick(async () => {
          try {
            await this.plugin.requestLoginCode({ notify: true });
            await this.display();
          } catch (error) {
            new Notice(t("notice.loginRequestFailed", { message: error.message }));
          }
        })
      );

    new Setting(accountContainer)
      .setName(t("settings.loginCode"))
      .setDesc(
        this.plugin.settings.authLoginCode
          ? t("settings.loginCodeDevDesc")
          : t("settings.loginCodeDesc")
      )
      .addText((text) =>
        text
          .setPlaceholder("000000")
          .setValue(this.plugin.settings.authLoginCode || "")
          .onChange(async (value) => {
            this.plugin.settings.authLoginCode = value.trim();
            await this.plugin.saveSettings();
          })
      )
      .addButton((button) =>
        button.setCta().setButtonText(t("button.completeLogin")).onClick(async () => {
          try {
            await this.plugin.completeLoginWithCode(
              this.plugin.settings.authLoginCode,
              { notify: true }
            );
            await this.loadAccessibleVaults({ notify: false });
            await this.display();
          } catch (error) {
            new Notice(t("notice.loginFailed", { message: error.message }));
          }
        })
      );

    const vaultConnectionDetails = containerEl.createEl("details");
    this.bindSectionOpenState(vaultConnectionDetails, "vaultConnection");
    if (
      this.shouldPromptVaultConnection() &&
      !this.sectionOpenState.vaultConnection &&
      !this.vaultConnectionAutoOpened
    ) {
      vaultConnectionDetails.open = true;
      this.vaultConnectionAutoOpened = true;
    }
    this.createSummaryWithStatus(vaultConnectionDetails, t("settings.vaultConnection"), this.getVaultConnectionStatus());
    const vaultConnectionContainer = vaultConnectionDetails.createDiv();
    const selectedAccessibleVault = this.getAccessibleVaultById(this.selectedVaultDraftId);
    const hasAccessibleVaults = this.availableVaults.length > 0;

    vaultConnectionContainer.createEl("p", {
      text: t("settings.currentLocalVault", {
        vaultName: this.plugin.getCurrentObsidianVaultName() || t("settings.unnamedVault"),
      }),
    });

    if (this.shouldPromptVaultConnection() && selectedAccessibleVault) {
      const sharedAccessPrompt = vaultConnectionContainer.createDiv();
      sharedAccessPrompt.createEl("p", {
        text: t("settings.sharedAccessReady"),
      });
      sharedAccessPrompt.createEl("p", {
        text: this.getAccessibleVaultConnectPrompt(selectedAccessibleVault),
      });
    }

    if (!this.plugin.settings.vaultId) {
      new Setting(vaultConnectionContainer)
        .setName(t("settings.publishCurrentVault"))
        .setDesc(
          hasAccessibleVaults
            ? t("settings.publishCurrentVaultAvailableDesc")
            : t("settings.publishCurrentVaultDesc")
        )
        .addButton((button) =>
          button
            .setCta()
            .setButtonText(t("button.publishCurrentVault"))
            .onClick(async () => {
              try {
                await this.plugin.publishCurrentVaultToServer({ notify: true });
                await this.loadAccessibleVaults({ notify: false });
                await this.display();
              } catch (error) {
                new Notice(t("notice.currentVaultPublishFailed", { message: error.message }));
              }
            })
        );
    } else {
      vaultConnectionContainer.createEl("p", {
        text: t("settings.publishCurrentVaultHiddenDesc"),
      });
    }

    new Setting(vaultConnectionContainer)
      .setName(t("settings.accessibleVaults"))
      .setDesc(t("settings.accessibleVaultsDesc"))
      .addDropdown((dropdown) => {
        dropdown.addOption(
          "",
          this.availableVaults.length ? t("dropdown.selectVault") : t("dropdown.loadVaultsFirst")
        );
        for (const accessibleVault of this.availableVaults) {
          const vault = accessibleVault.vault || {};
          if (!vault.id) {
            continue;
          }
          dropdown.addOption(vault.id, this.getAccessibleVaultLabel(accessibleVault));
        }
        dropdown.setValue(this.selectedVaultDraftId || "");
        dropdown.onChange(async (value) => {
          await this.setSelectedVaultDraftId(value);
          await this.display();
        });
      })
      .addButton((button) =>
        button.setButtonText(t("button.loadVaults")).onClick(async () => {
          await this.loadAccessibleVaults({ notify: true });
          await this.display();
        })
      );

    vaultConnectionContainer.createEl("p", {
      text: t("settings.accessibleVaultsBehavior"),
    });

    new Setting(vaultConnectionContainer)
      .setName(t("settings.serverSyncFolders"))
      .setDesc(
        selectedAccessibleVault && !selectedAccessibleVault.sync_scope
          ? t("settings.serverSyncFoldersInviteDesc")
          : t("settings.serverSyncFoldersDesc")
      )
      .addTextArea((textArea) => {
        textArea
          .setPlaceholder(t("settings.syncFoldersPlaceholder"))
          .setValue(this.syncFolderDraft)
          .onChange((value) => {
            this.syncFolderDraft = value;
          });
        if (selectedAccessibleVault && !selectedAccessibleVault.sync_scope) {
          textArea.setDisabled(true);
        }
      });

    const connectedAccessibleVault = this.getAccessibleVaultById(this.plugin.settings.vaultId);
    if (this.plugin.settings.vaultId) {
      vaultConnectionContainer.createEl("p", {
        text: t("settings.connectedServerVault", {
          vault:
            this.getAccessibleVaultLabel(connectedAccessibleVault) ||
            this.plugin.settings.vaultId,
        }),
      });
    }

    new Setting(vaultConnectionContainer)
      .setName(t("settings.connectCurrentVault"))
      .setDesc(
        this.plugin.settings.vaultId
          ? t("settings.reconnectCurrentVaultDesc")
          : selectedAccessibleVault
            ? t("settings.connectSharedVaultDesc")
            : t("settings.connectCurrentVaultDesc")
      )
      .addButton((button) => {
        button
          .setCta()
          .setButtonText(
            t(
              this.plugin.settings.vaultId
                ? "button.reconnectThisLocalVault"
                : selectedAccessibleVault
                  ? "button.connectSharedVaultHere"
                  : "button.connectThisLocalVault"
            )
          )
          .setDisabled(!this.selectedVaultDraftId)
          .onClick(async () => {
          try {
            const selectedAccessibleVault = this.getAccessibleVaultById(
              this.selectedVaultDraftId
            );
            if (!selectedAccessibleVault) {
              throw new Error(t("error.serverVaultRequired"));
            }
            await this.plugin.connectCurrentVaultToAccessibleVault(
              selectedAccessibleVault,
              String(this.syncFolderDraft || "").split("\n"),
              { notify: true }
            );
            this.selectedVaultDraftId = this.plugin.settings.vaultId || "";
            this.syncFolderDraft = formatSyncFolderPaths(
              this.plugin.settings.syncFolderPaths
            );
            await this.display();
          } catch (error) {
            new Notice(t("notice.localVaultConnectFailed", { message: error.message }));
          }
          });
      });

    const syncDetails = containerEl.createEl("details");
    this.bindSectionOpenState(syncDetails, "sync");
    this.createSummaryWithStatus(syncDetails, t("settings.sync"), this.getSyncSectionStatus());
    const syncContainer = syncDetails.createDiv();

    new Setting(syncContainer)
      .setName(t("settings.autoSync"))
      .setDesc(t("settings.autoSyncDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoSync).onChange(async (value) => {
          this.plugin.settings.autoSync = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(syncContainer)
      .setName(t("settings.syncObsidianConfig"))
      .setDesc(t("settings.syncObsidianConfigDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.syncObsidianConfig === true)
          .onChange(async (value) => {
            await this.plugin.setSyncObsidianConfig(value);
          })
      );

    new Setting(syncContainer)
      .setName(t("settings.crdtMarkdownEnabled"))
      .setDesc(this.getCrdtMarkdownSettingDescription())
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.crdtMarkdownEnabled === true)
          .onChange(async (value) => {
            this.plugin.settings.crdtMarkdownEnabled = Boolean(value);
            if (value) {
              this.plugin.settings.collaborationBlockReason =
                COLLABORATION_BLOCK_REASON.NONE;
            }
            await this.plugin.saveSettings();
            if (value) {
              await this.plugin.disableCrdtMarkdownIfCollaborationBlocked();
            }
            this.plugin.scheduleCrdtPolling();
            await this.display();
          })
      );

    new Setting(syncContainer)
      .setName(t("settings.syncInterval"))
      .setDesc(t("settings.syncIntervalDesc"))
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.syncIntervalSeconds))
          .onChange(async (value) => {
            const nextValue = Number(value);
            this.plugin.settings.syncIntervalSeconds = Number.isFinite(nextValue)
              ? Math.max(2, Math.floor(nextValue))
              : DEFAULT_SETTINGS.syncIntervalSeconds;
            await this.plugin.saveSettings();
          })
      );

    new Setting(syncContainer)
      .setName(t("settings.runSyncNow"))
      .setDesc(
        this.plugin.t("settings.lastSyncStatus", {
          lastSyncAt: this.plugin.settings.lastSyncAt || t("status.never"),
          lastErrorSuffix: this.plugin.settings.lastError
            ? t("settings.lastErrorSuffix", {
                message: this.plugin.settings.lastError,
              })
            : "",
          lastSyncWarningSuffix: this.plugin.settings.lastSyncWarning
            ? t("settings.lastSyncWarningSuffix", {
                message: this.plugin.settings.lastSyncWarning,
              })
            : "",
        })
      )
      .addButton((button) =>
        button.setCta().setButtonText(t("button.syncNow")).onClick(async () => {
          button.setDisabled(true);
          try {
            await this.plugin.syncNow({
              notify: true,
              onProgress: ({ completedFiles, totalFiles }) => {
                button.setButtonText(
                  t("button.syncProgress", {
                    completed: completedFiles,
                    total: totalFiles,
                  })
                );
              },
            });
            await this.display();
          } catch (error) {
            await this.display();
          } finally {
            button.setDisabled(false);
          }
        })
      );

    const vaultDivergenceDetails = containerEl.createEl("details");
    this.bindSectionOpenState(vaultDivergenceDetails, "vaultDivergence");
    const vaultDivergenceStatus = this.createSummaryWithStatus(
      vaultDivergenceDetails,
      t("settings.vaultDivergence"),
      ""
    );
    const vaultDivergenceContainer = vaultDivergenceDetails.createDiv();
    await this.renderVaultDivergenceSection(
      vaultDivergenceContainer,
      vaultDivergenceStatus
    );

    const conflictsDetails = containerEl.createEl("details");
    this.bindSectionOpenState(conflictsDetails, "conflicts");
    const conflictsStatus = this.createSummaryWithStatus(
      conflictsDetails,
      t("settings.syncConflicts"),
      ""
    );
    const conflictsContainer = conflictsDetails.createDiv();
    await this.renderConflictsSection(conflictsContainer, conflictsStatus);

    const sharingDetails = containerEl.createEl("details");
    this.bindSectionOpenState(sharingDetails, "sharing");
    const sharingStatus = this.createSummaryWithStatus(sharingDetails, t("settings.vaultSharing"), this.getSharingSectionStatus());
    const sharingContainer = sharingDetails.createDiv();

    sharingContainer.createEl("p", {
      text: t("settings.vaultSharingDesc"),
    });

    new Setting(sharingContainer)
      .setName(t("settings.colleagueEmail"))
      .setDesc(t("settings.colleagueEmailDesc"))
      .addText((text) =>
        text.setValue(this.sharingDraft.userEmail).onChange((value) => {
          this.sharingDraft.userEmail = value.trim().toLowerCase();
        })
      );

    const sharedFolderSetting = new Setting(sharingContainer)
      .setName(t("settings.sharedFolderScope"))
      .setDesc(t("settings.sharedFolderScopeDesc"));
    this.renderSharedFolderSelector(sharedFolderSetting.controlEl);

    new Setting(sharingContainer)
      .setName(t("settings.vaultRole"))
      .setDesc(t("settings.vaultRoleDesc"))
      .addDropdown((dropdown) => {
        dropdown.addOption("editor", t("role.editor"));
        dropdown.addOption("viewer", t("role.viewer"));
        dropdown.addOption("owner", t("role.owner"));
        dropdown.setValue(this.sharingDraft.role);
        dropdown.onChange((value) => {
          this.sharingDraft.role = value;
        });
      })
      .addButton((button) =>
        button.setCta().setButtonText(t("button.grantAccess")).onClick(async () => {
          try {
            await this.plugin.grantVaultAccess(
              this.sharingDraft.userEmail,
              this.sharingDraft.role,
              this.getSharingDraftFolderPaths()
            );
            new Notice(t("notice.vaultInviteCreated", { email: this.sharingDraft.userEmail }));
            await this.display();
          } catch (error) {
            new Notice(t("notice.sharingUpdateFailed", { message: error.message }));
          }
        })
      )
      .addButton((button) =>
        button.setButtonText(t("button.refresh")).onClick(async () => {
          await this.display();
        })
      );

    const membershipsContainer = sharingContainer.createDiv();
    await this.renderVaultMembershipsSection(membershipsContainer, sharingStatus);

    sharingContainer.createEl("h3", { text: t("settings.sharedFolders") });
    sharingContainer.createEl("p", {
      text: t("settings.sharedFoldersDesc"),
    });

    const telegramDetails = containerEl.createEl("details");
    this.bindSectionOpenState(telegramDetails, "telegram");
    const telegramStatus = this.createSummaryWithStatus(telegramDetails, "Telegram", this.getTelegramSectionStatus());
    const telegramContainer = telegramDetails.createDiv();

    telegramContainer.createEl("p", {
      text: t("settings.telegramDesc"),
    });

    new Setting(telegramContainer)
      .setName(t("settings.telegramInboxFolder"))
      .setDesc(t("settings.telegramInboxFolderDesc"))
      .addText((text) =>
        text
          .setValue(this.plugin.settings.telegramDefaultInboxFolder || "Inbox/Telegram")
          .onChange(async (value) => {
            this.plugin.settings.telegramDefaultInboxFolder =
              value.trim() || "Inbox/Telegram";
            await this.plugin.saveSettings();
          })
      )
      .addButton((button) =>
        button.setCta().setButtonText(t("button.createLinkCode")).onClick(async () => {
          try {
            const payload = await this.plugin.createTelegramLinkRequest(
              this.plugin.settings.telegramDefaultInboxFolder
            );
            const code =
              payload &&
              payload.telegram_link_request &&
              payload.telegram_link_request.one_time_code
                ? payload.telegram_link_request.one_time_code
                : "";
            new Notice(
              code
                ? t("notice.telegramCodeCreatedWithCode", { code })
                : t("notice.telegramCodeCreated")
            );
            await this.display();
          } catch (error) {
            new Notice(t("notice.telegramCodeFailed", { message: error.message }));
          }
        })
      );

    if (this.plugin.settings.telegramLastLinkCode) {
      telegramContainer.createEl("p", {
        text: t("settings.lastCode", { code: this.plugin.settings.telegramLastLinkCode }),
      });
      if (this.plugin.settings.telegramLastLinkExpiresAt) {
        telegramContainer.createEl("p", {
          text: t("settings.expiresAt", {
            expiresAt: this.plugin.settings.telegramLastLinkExpiresAt,
          }),
        });
      }
    }

    const telegramLinksContainer = telegramContainer.createDiv();
    await this.renderTelegramLinksSection(telegramLinksContainer, telegramStatus);
  }

  async loadAccessibleVaults(options = {}) {
    try {
      this.availableVaults = await this.plugin.listAccessibleVaults();
      if (!this.selectedVaultDraftId) {
        this.selectedVaultDraftId = this.plugin.settings.vaultId || "";
      }
      if (!this.selectedVaultDraftId && this.availableVaults.length === 1) {
        const onlyVault = this.availableVaults[0] && this.availableVaults[0].vault;
        this.selectedVaultDraftId = onlyVault && onlyVault.id ? onlyVault.id : "";
      }
      this.syncFolderDraft = null;
      this.ensureVaultConnectionDraft();
      if (options.notify !== false) {
        new Notice(this.plugin.t("notice.loadedVaults", { count: this.availableVaults.length }));
      }
      return this.availableVaults;
    } catch (error) {
      this.availableVaults = [];
      if (options.notify !== false) {
        new Notice(this.plugin.t("notice.loadVaultsFailed", { message: error.message }));
      }
      return [];
    }
  }

  async renderVaultMembershipsSection(containerEl, statusSpan = null) {
    containerEl.empty();
    if (
      !this.plugin.settings.baseUrl ||
      (!this.plugin.settings.userEmail && !this.plugin.settings.userId) ||
      !this.plugin.settings.vaultId
    ) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.membershipsNeedConfig"),
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.notConfigured"));
      }
      return;
    }

    try {
      const [memberships, invites] = await Promise.all([
        this.plugin.listVaultMemberships(),
        this.plugin.listVaultMembershipInvites(),
      ]);
      const pendingInvites = invites.filter(
        (invite) => String((invite && invite.status) || "").toLowerCase() === "pending"
      );
      containerEl.createEl("h4", { text: this.plugin.t("settings.currentMembers") });
      if (!memberships.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noMembers") });
      }

      if (statusSpan) {
        const hasOtherMembers = memberships.some(
          (membership) => !this.isCurrentUserMembership(membership)
        );
        const hasPendingInvites = pendingInvites.length > 0;
        statusSpan.setText(
          this.plugin.t(
            hasOtherMembers || hasPendingInvites
              ? "sectionStatus.configured"
              : "sectionStatus.notConfigured"
          )
        );
      }

      for (const membership of memberships) {
        const memberLabel = this.getMembershipLabel(membership);
        const memberReference = this.plugin.t("settings.memberReference", {
          role: translateRole(this.plugin.settings.language, membership.role),
        });
        const scopeReference = formatSharedFolderScope(
          this.plugin.settings.language,
          membership.sync_folder_paths
        );
        const row = new Setting(containerEl)
          .setName(`${memberLabel}`)
          .setDesc(`${memberReference} - ${scopeReference}`);

        if (membership.role !== "owner" && membership.user_id !== this.plugin.settings.userId) {
          row.addButton((button) =>
            button.setWarning().setButtonText(this.plugin.t("button.remove")).onClick(async () => {
              try {
                await this.plugin.revokeVaultAccess(membership.user_id);
                new Notice(this.plugin.t("notice.removedAccess", { member: memberLabel }));
                await this.display();
              } catch (error) {
                new Notice(
                  this.plugin.t("notice.removeAccessFailed", { message: error.message })
                );
              }
            })
          );
        }
      }

      containerEl.createEl("h4", { text: this.plugin.t("settings.pendingInvites") });
      if (!pendingInvites.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noPendingInvites") });
        return;
      }
      for (const invite of pendingInvites) {
        const inviteEmail = this.getInviteEmail(invite) || this.plugin.t("status.unknown");
        const inviteStatus = this.getInviteStatusLabel(invite);
        const inviteReference = this.plugin.t("settings.inviteSentReference", {
          role: translateRole(this.plugin.settings.language, invite.role),
          status: inviteStatus,
        });
        const scopeReference = formatSharedFolderScope(
          this.plugin.settings.language,
          invite.sync_folder_paths
        );
        const row = new Setting(containerEl)
          .setName(inviteEmail)
          .setDesc(`${inviteReference} - ${scopeReference}`);
        row.addButton((button) =>
          button.setWarning().setButtonText(this.plugin.t("button.revoke")).onClick(async () => {
            try {
              await this.plugin.revokeVaultInvite(invite.id);
              new Notice(this.plugin.t("notice.vaultInviteRevoked", { email: inviteEmail }));
              await this.display();
            } catch (error) {
              new Notice(
                this.plugin.t("notice.revokeInviteFailed", { message: error.message })
              );
            }
          })
        );
      }
    } catch (error) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.loadMembershipsFailed", { message: error.message }),
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.error"));
      }
    }
  }

  async renderTelegramLinksSection(containerEl, statusSpan = null) {
    containerEl.empty();
    if (!this.plugin.settings.baseUrl || (!this.plugin.settings.userEmail && !this.plugin.settings.userId)) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.telegramNeedConfig"),
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.notConnected"));
      }
      return;
    }

    try {
      const links = await this.plugin.listTelegramLinks();
      containerEl.createEl("h4", { text: this.plugin.t("settings.connectedTelegramChats") });
      if (!links.length) {
        containerEl.createEl("p", { text: this.plugin.t("settings.noTelegramChats") });
        if (statusSpan) {
          statusSpan.setText(this.plugin.t("sectionStatus.notConnected"));
        }
        return;
      }

      if (statusSpan) {
        const hasActiveLink = links.some((l) => l.status !== "revoked");
        statusSpan.setText(
          this.plugin.t(
            hasActiveLink ? "sectionStatus.connected" : "sectionStatus.notConnected"
          )
        );
      }

      for (const link of links) {
        new Setting(containerEl)
          .setName(this.plugin.t("settings.telegramChat", { chatId: link.telegram_chat_id }))
          .setDesc(this.plugin.t("settings.status", { status: link.status }))
          .addButton((button) =>
            button.setWarning().setButtonText(this.plugin.t("button.revoke")).onClick(async () => {
              try {
                await this.plugin.revokeTelegramLink(link.id);
                new Notice(
                  this.plugin.t("notice.telegramRevoked", {
                    chatId: link.telegram_chat_id,
                  })
                );
                await this.display();
              } catch (error) {
                new Notice(
                  this.plugin.t("notice.telegramRevokeFailed", { message: error.message })
                );
              }
            })
          );
      }
    } catch (error) {
      containerEl.createEl("p", {
        text: this.plugin.t("settings.loadTelegramFailed", { message: error.message }),
      });
      if (statusSpan) {
        statusSpan.setText(this.plugin.t("sectionStatus.error"));
      }
    }
  }

  async renderVaultDivergenceSection(containerEl, statusSpan = null) {
    containerEl.empty();
    const t = (key, params = {}) => this.plugin.t(key, params);

    if (!this.plugin.isConfigured()) {
      containerEl.createEl("p", { text: t("settings.vaultDivergenceNeedConfig") });
      if (statusSpan) {
        statusSpan.setText(t("sectionStatus.notConfigured"));
      }
      return;
    }

    const report = this.vaultDivergenceReport;
    const totalDifferences = report
      ? report.localOnly.length + report.remoteOnly.length + report.changed.length
      : null;
    if (statusSpan) {
      if (!report) {
        statusSpan.setText(t("sectionStatus.configured"));
      } else if (totalDifferences === 0) {
        statusSpan.setText(t("sectionStatus.noVaultDivergence"));
      } else {
        statusSpan.setText(
          t("sectionStatus.vaultDiverged", { count: totalDifferences })
        );
      }
    }

    containerEl.createEl("p", { text: t("settings.vaultDivergenceDesc") });
    new Setting(containerEl)
      .setName(t("settings.checkVaultDivergence"))
      .setDesc(t("settings.checkVaultDivergenceDesc"))
      .addButton((button) =>
        button.setCta().setButtonText(t("button.checkVaultDivergence")).onClick(async () => {
          try {
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.checking"));
            }
            button.setDisabled(true);
            this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          } catch (error) {
            this.vaultDivergenceReport = null;
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.error"));
            }
            new Notice(t("settings.loadVaultDivergenceFailed", { message: error.message }));
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          }
        })
      );

    if (!report) {
      return;
    }

    const checkedAt = report.checkedAt
      ? new Date(report.checkedAt).toLocaleString()
      : t("status.unknown");
    containerEl.createEl("p", {
      text: t("settings.vaultDivergenceCheckedAt", { checkedAt }),
    });
    containerEl.createEl("p", {
      text: t("settings.vaultDivergenceCounts", {
        localCount: report.localCount,
        remoteCount: report.remoteCount,
        localOnlyCount: report.localOnly.length,
        remoteOnlyCount: report.remoteOnly.length,
        changedCount: report.changed.length,
      }),
    });
    containerEl.createEl("p", { text: t("settings.vaultDivergenceTimeHint") });

    if (totalDifferences === 0) {
      containerEl.createEl("p", { text: t("settings.vaultDivergenceNoDiff") });
      return;
    }

    this.renderVaultDivergenceActions(containerEl, statusSpan, report, totalDifferences);
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceLocalOnly"),
      report.localOnly,
      report.details || {}
    );
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceRemoteOnly"),
      report.remoteOnly,
      report.details || {}
    );
    this.renderVaultDivergencePathList(
      containerEl,
      t("settings.vaultDivergenceChanged"),
      report.changed,
      report.details || {}
    );
  }

  renderVaultDivergenceActions(containerEl, statusSpan, report, totalDifferences) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    const mergeCount = report.localOnly.length + report.remoteOnly.length;

    new Setting(containerEl)
      .setName(t("settings.mergeVaultDivergence"))
      .setDesc(t("settings.mergeVaultDivergenceDesc", { changed: report.changed.length }))
      .addButton((button) =>
        button
          .setCta()
          .setButtonText(t("button.mergeVaultDivergence"))
          .setDisabled(mergeCount === 0)
          .onClick(async () => {
            if (
              !confirm(
                t("confirm.mergeVaultDivergence", {
                  count: mergeCount,
                  changed: report.changed.length,
                })
              )
            ) {
              return;
            }
            try {
              if (statusSpan) {
                statusSpan.setText(t("sectionStatus.checking"));
              }
              button.setDisabled(true);
              const result = await this.plugin.mergeVaultDivergenceFileSets();
              this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
              new Notice(
                t("notice.vaultDivergenceMerged", {
                  downloaded: result.downloadedRemoteOnly,
                  uploaded: result.uploadedLocalOnly,
                  directories: result.createdRemoteDirectories,
                  missing: result.missingRemoteObjectContent,
                  conflicts: result.conflicts,
                  changed: result.skippedChanged,
                })
              );
              await this.renderVaultDivergenceSection(containerEl, statusSpan);
            } catch (error) {
              if (statusSpan) {
                statusSpan.setText(t("sectionStatus.error"));
              }
              new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
              await this.renderVaultDivergenceSection(containerEl, statusSpan);
            }
          })
      );

    new Setting(containerEl)
      .setName(t("settings.acceptServerVaultState"))
      .setDesc(t("settings.acceptServerVaultStateDesc"))
      .addButton((button) =>
        button.setWarning().setButtonText(t("button.acceptServerVaultState")).onClick(async () => {
          if (!confirm(t("confirm.acceptServerVaultState", { count: totalDifferences }))) {
            return;
          }
          try {
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.checking"));
            }
            button.setDisabled(true);
            const result = await this.plugin.acceptServerVaultState();
            this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
            new Notice(
              t("notice.vaultDivergenceServerAccepted", {
                applied: result.appliedRemote,
                removed: result.removedLocalOnly,
                preserved: result.preservedLocalCopies,
              })
            );
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          } catch (error) {
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.error"));
            }
            new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          }
        })
      );

    new Setting(containerEl)
      .setName(t("settings.publishLocalVaultState"))
      .setDesc(t("settings.publishLocalVaultStateDesc"))
      .addButton((button) =>
        button.setWarning().setButtonText(t("button.publishLocalVaultState")).onClick(async () => {
          if (!confirm(t("confirm.publishLocalVaultState", { count: totalDifferences }))) {
            return;
          }
          try {
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.checking"));
            }
            button.setDisabled(true);
            const report = await this.plugin.publishLocalVaultStateAsSource();
            this.vaultDivergenceReport = await this.plugin.buildVaultDivergenceReport();
            new Notice(
              t("notice.vaultDivergenceLocalPublished", {
                pushed: report.pushedOperations,
                conflicts: report.conflicts,
              })
            );
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          } catch (error) {
            if (statusSpan) {
              statusSpan.setText(t("sectionStatus.error"));
            }
            new Notice(t("notice.vaultDivergenceResolveFailed", { message: error.message }));
            await this.renderVaultDivergenceSection(containerEl, statusSpan);
          }
        })
      );
  }

  renderVaultDivergencePathList(containerEl, title, paths, details = {}) {
    const visiblePaths = (paths || []).slice(0, 25);
    if (visiblePaths.length === 0) {
      return;
    }
    containerEl.createEl("h4", { text: title });
    const listEl = containerEl.createEl("ul");
    for (const path of visiblePaths) {
      const itemEl = listEl.createEl("li");
      itemEl.createEl("code", { text: path });
      const pathDetails = details[path] || {};
      itemEl.createEl("div", {
        cls: "sync-vault-divergence-meta",
        text: this.formatVaultDivergenceSideDetail(
          this.plugin.t("settings.vaultDivergenceSideLocal"),
          pathDetails.local
        ),
      });
      itemEl.createEl("div", {
        cls: "sync-vault-divergence-meta",
        text: this.formatVaultDivergenceSideDetail(
          this.plugin.t("settings.vaultDivergenceSideServer"),
          pathDetails.server
        ),
      });
    }
    const hiddenCount = (paths || []).length - visiblePaths.length;
    if (hiddenCount > 0) {
      const itemEl = listEl.createEl("li");
      itemEl.setText(
        this.plugin.t("settings.vaultDivergenceMore", { count: hiddenCount })
      );
    }
  }

  formatVaultDivergenceSideDetail(sideLabel, detail) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    if (!detail) {
      return t("settings.vaultDivergenceSideMissing", { side: sideLabel });
    }
    return t("settings.vaultDivergenceSideMeta", {
      side: sideLabel,
      modifiedAt: formatVaultDivergenceTimestamp(detail.modifiedAt, t("status.unknown")),
      type: detail.entryType || t("status.unknown"),
      size: formatVaultDivergenceSize(detail.sizeBytes),
      hash: shortContentHash(detail.contentHash),
    });
  }

  async renderConflictsSection(containerEl, statusSpan = null) {
    containerEl.empty();
    const t = (key, params = {}) => this.plugin.t(key, params);

    if (!this.plugin.isConfigured()) {
      containerEl.createEl("p", { text: t("settings.syncConflictsNeedConfig") });
      if (statusSpan) {
        statusSpan.setText(t("sectionStatus.notConfigured"));
      }
      return;
    }

    let openConflicts;
    let usedCachedConflicts = false;
    try {
      openConflicts = await this.plugin.syncConflictState();
    } catch (error) {
      usedCachedConflicts = true;
      containerEl.createEl("p", {
        text: t("settings.loadConflictsUsingCache", { message: error.message }),
      });
      openConflicts = this.plugin.getCachedOpenConflicts();
    }

    if (openConflicts.length === 0) {
      if (!usedCachedConflicts) {
        containerEl.createEl("p", { text: t("settings.noConflicts") });
      }
      if (statusSpan) {
        statusSpan.setText(
          usedCachedConflicts ? t("sectionStatus.error") : t("sectionStatus.noConflicts")
        );
      }
      return;
    }

    if (statusSpan) {
      statusSpan.setText(t("sectionStatus.conflictsOpen", { count: openConflicts.length }));
    }

    containerEl.createEl("p", {
      text: t("settings.syncConflictsDesc"),
    });

    for (const conflict of openConflicts) {
      const pathLabel = conflict.path || conflict.id || "?";
      const createdAt = conflict.created_at
        ? new Date(conflict.created_at).toLocaleString()
        : t("status.unknown");
      const reasonLabel = conflict.reason || t("status.unknown");
      const opTypeLabel = conflict.operation_type || t("status.unknown");
      const statusLabel = conflict.status || "";

      const conflictItem = new Setting(containerEl)
        .setName(pathLabel)
        .setDesc(
          t("settings.conflictItemDesc", {
            createdAt,
            reason: reasonLabel,
            opType: opTypeLabel,
            status: statusLabel,
          })
        );

      if (conflict.id) {
        const detailContainer = containerEl.createDiv({
          cls: "sync-conflict-detail-container",
        });
        conflictItem.addButton((button) =>
          button
            .setButtonText(t("button.viewConflictDetails"))
            .onClick(async () => {
              if (detailContainer.children.length > 0) {
                detailContainer.empty();
                return;
              }
              await this.renderConflictDetail(detailContainer, conflict);
              detailContainer.scrollIntoView({ block: "nearest" });
            })
        );
      }
    }
  }

  async renderConflictDetail(containerEl, conflict) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    const detailDiv = containerEl.createDiv({ cls: "sync-conflict-detail" });

    detailDiv.createEl("h4", { text: t("settings.conflictDetailTitle") });
    detailDiv.createEl("p", { text: `${t("settings.conflictPath")}: ${conflict.path || "?"}` });
    detailDiv.createEl("p", {
      text: `${t("settings.conflictCreatedAt")}: ${
        conflict.created_at ? new Date(conflict.created_at).toLocaleString() : t("status.unknown")
      }`,
    });
    detailDiv.createEl("p", {
      text: `${t("settings.conflictOperationType")}: ${conflict.operation_type || t("status.unknown")}`,
    });
    if (conflict.target_path) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictTargetPath")}: ${conflict.target_path}`,
      });
    }
    detailDiv.createEl("p", {
      text: `${t("settings.conflictReason")}: ${conflict.reason || t("status.unknown")}`,
    });
    if (conflict.expected_content_hash) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictExpectedHash")}: ${conflict.expected_content_hash}`,
      });
    }
    if (conflict.actual_content_hash) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictActualHash")}: ${conflict.actual_content_hash}`,
      });
    }
    detailDiv.createEl("p", {
      text: `${t("settings.conflictStatus")}: ${conflict.status || t("status.unknown")}`,
    });
    if (conflict.device_id) {
      detailDiv.createEl("p", {
        text: `${t("settings.conflictDeviceId")}: ${conflict.device_id}`,
      });
    }

    this.renderResolutionActions(detailDiv, conflict);
  }

  renderResolutionActions(containerEl, conflict) {
    if (!conflict || conflict.status !== "open") {
      return;
    }

    const t = (key, params = {}) => this.plugin.t(key, params);
    const actionsDiv = containerEl.createDiv({ cls: "sync-conflict-actions" });

    actionsDiv.createEl("h4", { text: "Resolve" });
    if (this.plugin.isMoveTargetOccupiedConflict(conflict)) {
      new Setting(actionsDiv)
        .setName(t("button.resolveKeepLocal"))
        .setDesc(t("resolution.keepLocalDesc"))
        .addButton((button) =>
          button
            .setButtonText(t("button.resolveKeepLocal"))
            .onClick(async () => {
              await this.executeResolution(
                () => this.plugin.resolveKeepLocal(conflict),
                conflict
              );
            })
        );
      return;
    }
    if (!this.plugin.isConflictResolutionSupported(conflict)) {
      actionsDiv.createEl("p", {
        text: t("settings.conflictResolutionUnsupported", {
          entryType: conflict.entry_type || "unknown",
          operationType: conflict.operation_type || "unknown",
        }),
      });
      return;
    }

    const keepLocalDescKey = this.plugin.isDeleteHashMismatchConflict(conflict)
      ? "resolution.keepLocalDeleteHashMismatchDesc"
      : "resolution.keepLocalDesc";
    new Setting(actionsDiv)
      .setName(t("button.resolveKeepLocal"))
      .setDesc(t(keepLocalDescKey))
      .addButton((button) =>
        button
          .setButtonText(t("button.resolveKeepLocal"))
          .onClick(async () => {
            await this.executeResolution(
              () => this.plugin.resolveKeepLocal(conflict),
              conflict
            );
          })
      );

    new Setting(actionsDiv)
      .setName(t("button.resolveAcceptRemote"))
      .setDesc(t("resolution.acceptRemoteDesc"))
      .addButton((button) =>
        button
          .setButtonText(t("button.resolveAcceptRemote"))
          .onClick(async () => {
            await this.executeResolution(
              () => this.plugin.resolveAcceptRemote(conflict),
              conflict
            );
          })
      );

    new Setting(actionsDiv)
      .setName(t("button.resolveKeepBoth"))
      .setDesc(t("resolution.keepBothDesc"))
      .addButton((button) =>
        button
          .setButtonText(t("button.resolveKeepBoth"))
          .onClick(async () => {
            await this.executeResolution(
              () => this.plugin.resolveKeepBoth(conflict),
              conflict
            );
          })
      );

    new Setting(actionsDiv)
      .setName(t("button.materializeRemote"))
      .setDesc(t("resolution.materializeDesc"))
      .addButton((button) =>
        button
          .setButtonText(t("button.materializeRemote"))
          .onClick(async () => {
            try {
              const materializedPath =
                await this.plugin.materializeRemoteVersion(conflict);
              new Notice(
                t("notice.remoteMaterialized", { path: materializedPath })
              );
            } catch (error) {
              new Notice(
                t("notice.remoteMaterializeFailed", { message: error.message })
              );
            }
          })
      );
  }

  async executeResolution(resolveFn, conflict) {
    const t = (key, params = {}) => this.plugin.t(key, params);
    try {
      await resolveFn();
      new Notice(t("notice.conflictResolved"));
      await this.display();
    } catch (error) {
      console.error(
        "[obsidian-http-sync] Resolution failed for",
        conflict.path,
        error
      );
      new Notice(
        t("notice.conflictResolveFailed", {
          message: error.message || String(error),
        })
      );
    }
  }
}

function detectPlatform() {
  if (Platform && Platform.isAndroidApp) {
    return "android";
  }
  if (Platform && Platform.isIosApp) {
    return "ios";
  }
  if (Platform && Platform.isMacOS) {
    return "macos";
  }
  if (Platform && Platform.isWin) {
    return "windows";
  }
  if (Platform && Platform.isLinux) {
    return "linux";
  }
  if (Platform && Platform.isMobileApp) {
    return "mobile";
  }
  if (Platform && Platform.isDesktopApp) {
    return "desktop";
  }
  return "obsidian";
}

function generateDeviceInstanceId() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeDeviceNameForInstance(deviceName, deviceInstanceId) {
  const normalizedName = String(deviceName || "").trim();
  const baseName = normalizedName || DEFAULT_SETTINGS.deviceName;
  if (String(baseName).includes(String(deviceInstanceId || ""))) {
    return baseName;
  }
  if (isLegacyDefaultDeviceName(baseName)) {
    return `${DEFAULT_SETTINGS.deviceName} ${deviceInstanceId}`;
  }
  return baseName;
}

function isLegacyDefaultDeviceName(deviceName) {
  const normalizedName = String(deviceName || "").trim();
  return !normalizedName || normalizedName === DEFAULT_SETTINGS.deviceName;
}

async function hashBinary(binaryPayload) {
  if (
    typeof globalThis.crypto === "undefined" ||
    !globalThis.crypto ||
    !globalThis.crypto.subtle
  ) {
    throw new Error("Web Crypto API недоступен");
  }
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    toArrayBuffer(binaryPayload)
  );
  return `sha256:${toHex(new Uint8Array(digest))}`;
}

function toArrayBuffer(binaryPayload) {
  if (binaryPayload instanceof Uint8Array) {
    return binaryPayload.buffer.slice(
      binaryPayload.byteOffset,
      binaryPayload.byteOffset + binaryPayload.byteLength
    );
  }
  if (binaryPayload instanceof ArrayBuffer) {
    return binaryPayload;
  }
  throw new Error("Неподдерживаемый тип бинарных данных");
}

function toHex(byteArray) {
  return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function comparePluginVersions(leftVersion, rightVersion) {
  const leftParts = parsePluginVersionParts(leftVersion);
  const rightParts = parsePluginVersionParts(rightVersion);
  const maxLength = Math.max(leftParts.length, rightParts.length, 3);
  for (let index = 0; index < maxLength; index += 1) {
    const left = leftParts[index] || 0;
    const right = rightParts[index] || 0;
    if (left > right) {
      return 1;
    }
    if (left < right) {
      return -1;
    }
  }
  return 0;
}

function parsePluginVersionParts(version) {
  return String(version || "")
    .split(/[.+-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function comparePluginBuildIds(leftBuildId, rightBuildId) {
  const left = normalizePluginBuildId(leftBuildId);
  const right = normalizePluginBuildId(rightBuildId);
  if (!left && !right) {
    return 0;
  }
  if (left && !right) {
    return 1;
  }
  if (!left && right) {
    return -1;
  }
  return left.localeCompare(right);
}

function normalizePluginBuildId(buildId) {
  return String(buildId || "").trim();
}

async function readPluginZipFiles(archivePayload, wantedFileNames) {
  const archiveBytes = new Uint8Array(toArrayBuffer(archivePayload));
  const wanted = new Set((wantedFileNames || []).map((name) => String(name || "")));
  const entries = new Map();
  const view = new DataView(toArrayBuffer(archiveBytes));
  const endOffset = findZipEndOfCentralDirectory(view);
  if (endOffset < 0) {
    throw new Error("Plugin archive is not a valid ZIP file");
  }
  const entryCount = view.getUint16(endOffset + 10, true);
  const centralDirectoryOffset = view.getUint32(endOffset + 16, true);
  let cursor = centralDirectoryOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(cursor, true) !== 0x02014b50) {
      throw new Error("Plugin archive central directory is invalid");
    }
    const compressionMethod = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    const fileNameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localHeaderOffset = view.getUint32(cursor + 42, true);
    const fileNameStart = cursor + 46;
    const fileName = decodeUtf8(
      archiveBytes.slice(fileNameStart, fileNameStart + fileNameLength)
    );
    const normalizedFileName = normalizePluginArchiveFileName(fileName);
    if (wanted.has(normalizedFileName)) {
      const payload = await extractZipFilePayload(
        archiveBytes,
        view,
        localHeaderOffset,
        compressionMethod,
        compressedSize,
        uncompressedSize
      );
      entries.set(normalizedFileName, payload);
      if (entries.size === wanted.size) {
        break;
      }
    }
    cursor += 46 + fileNameLength + extraLength + commentLength;
  }
  return entries;
}

function normalizePluginArchiveFileName(fileName) {
  const normalized = String(fileName || "").replace(/\\/g, "/").replace(/^\/+/, "");
  for (const pluginId of [PLUGIN_ID, ...LEGACY_PLUGIN_IDS]) {
    const pluginPrefix = `${pluginId}/`;
    if (normalized.startsWith(pluginPrefix)) {
      return normalized.slice(pluginPrefix.length);
    }
  }
  return normalized;
}

function pluginArchiveSupportsSelfUpdate(mainPayload) {
  try {
    const mainSource = decodeUtf8(mainPayload);
    return (
      mainSource.includes("PLUGIN_UPDATE_LATEST_ARCHIVE_PATH") ||
      mainSource.includes("obsidian-http-sync-latest.zip")
    );
  } catch (error) {
    return false;
  }
}

function extractPluginBuildId(mainPayload) {
  try {
    const mainSource = decodeUtf8(mainPayload);
    const match = mainSource.match(
      /\bPLUGIN_BUILD_ID\b\s*=\s*["']([^"']+)["']/
    );
    return match ? normalizePluginBuildId(match[1]) : "";
  } catch (error) {
    return "";
  }
}

function findZipEndOfCentralDirectory(view) {
  const minimumLength = 22;
  const maximumCommentLength = 65535;
  const startOffset = Math.max(0, view.byteLength - minimumLength - maximumCommentLength);
  for (let offset = view.byteLength - minimumLength; offset >= startOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      return offset;
    }
  }
  return -1;
}

async function extractZipFilePayload(
  archiveBytes,
  view,
  localHeaderOffset,
  compressionMethod,
  compressedSize,
  uncompressedSize
) {
  if (view.getUint32(localHeaderOffset, true) !== 0x04034b50) {
    throw new Error("Plugin archive local file header is invalid");
  }
  const localFileNameLength = view.getUint16(localHeaderOffset + 26, true);
  const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
  const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
  const compressedPayload = archiveBytes.slice(dataStart, dataStart + compressedSize);
  let payload;
  if (compressionMethod === 0) {
    payload = compressedPayload;
  } else if (compressionMethod === 8) {
    payload = await inflateRawDeflate(compressedPayload);
  } else {
    throw new Error(`Unsupported plugin archive compression method: ${compressionMethod}`);
  }
  if (Number(uncompressedSize) > 0 && payload.byteLength !== Number(uncompressedSize)) {
    throw new Error("Plugin archive file size mismatch");
  }
  return payload;
}

async function inflateRawDeflate(compressedPayload) {
  if (
    typeof DecompressionStream === "undefined" ||
    typeof Blob === "undefined" ||
    typeof Response === "undefined"
  ) {
    throw new Error("DecompressionStream is not available");
  }
  const stream = new Blob([toArrayBuffer(compressedPayload)])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function isAlreadyExistsError(error) {
  const message = String(error && error.message ? error.message : error).toLowerCase();
  return message.includes("already exists");
}

function isConflictDetectedError(error) {
  const statusCode = Number(error && error.statusCode);
  const payloadError =
    error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  const message = String(error && error.message ? error.message : error).toLowerCase();
  return (
    statusCode === 409 &&
    (payloadError === "conflict_detected" || message.includes("conflict"))
  );
}

function isRecordOperationConflictError(error, payload) {
  const statusCode = Number(error && error.statusCode);
  if (statusCode !== 409) {
    return false;
  }
  const operationType = String(payload && payload.operation_type ? payload.operation_type : "");
  if (operationType === "mkdir") {
    return false;
  }
  const payloadError =
    error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  if (payloadError) {
    return payloadError === "conflict_detected";
  }
  return ["upsert", "delete", "move"].includes(operationType);
}

function isRecordOperationNoteLockError(error) {
  const statusCode = Number(error && error.statusCode);
  if (statusCode !== 409) {
    return false;
  }
  const payloadError =
    error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  return payloadError === "note_edit_locked";
}

function extractOperationNoteLock(error) {
  const payload = error && error.payload && typeof error.payload === "object" ? error.payload : {};
  const lock = payload.lock && typeof payload.lock === "object" ? payload.lock : {};
  const lease = lock.lease && typeof lock.lease === "object" ? lock.lease : {};
  return {
    path: normalizePath(String(payload.path || lease.path || "")),
    readonlyReason: String(payload.readonly_reason || lock.readonly_reason || "held_by_other_device"),
    lock,
  };
}

function extractOperationConflict(error) {
  const conflict = error && error.payload ? error.payload.conflict : null;
  return conflict && typeof conflict === "object" ? conflict : {};
}

function isAlreadyAppliedOperationConflictCandidate(payload, conflict) {
  if (!payload || !conflict || typeof conflict !== "object") {
    return false;
  }
  const operationType = String(payload.operation_type || "");
  if (!["upsert", "delete"].includes(operationType)) {
    return false;
  }
  const conflictOperationType = String(conflict.operation_type || operationType);
  if (conflictOperationType !== operationType) {
    return false;
  }
  const entryType = String(payload.entry_type || conflict.entry_type || "");
  const conflictEntryType = String(conflict.entry_type || entryType);
  if (entryType !== "file" || conflictEntryType !== "file") {
    return false;
  }
  if (String(conflict.reason || "") !== "base_content_hash_mismatch") {
    return false;
  }
  const payloadPath = normalizePath(String(payload.path || ""));
  const conflictPath = normalizePath(String(conflict.path || payload.path || ""));
  if (payloadPath && conflictPath && payloadPath !== conflictPath) {
    return false;
  }
  if (operationType === "upsert") {
    const desiredHash = normalizeContentHashForCompare(payload.content_hash);
    const actualHash = normalizeContentHashForCompare(conflict.actual_content_hash);
    return Boolean(desiredHash && actualHash && desiredHash === actualHash);
  }
  return !normalizeContentHashForCompare(conflict.actual_content_hash);
}

function isAlreadyMissingDirectoryError(error) {
  const message = String(error && error.message ? error.message : error).toLowerCase();
  const payloadError =
    error && error.payload && error.payload.error ? String(error.payload.error).toLowerCase() : "";
  return (
    Number(error && error.statusCode) === 400 &&
    payloadError === "validation_error" &&
    message.includes("rmdir requires an existing active directory")
  );
}

function isMissingRemoteObjectContentError(error) {
  return Number(error && error.statusCode) === 404;
}

function annotateError(error, context) {
  const message = String(error && error.message ? error.message : error);
  const annotated = new Error(`${context}: ${message}`);
  if (error && typeof error === "object") {
    annotated.statusCode = error.statusCode;
    annotated.payload = error.payload;
    annotated.stack = error.stack || annotated.stack;
  }
  return annotated;
}

function classifyAuthError(error, hasAccessToken, hasRefreshToken) {
  if (!error || typeof error !== "object") {
    return {
      authStatus: AUTH_STATUS.ERROR,
      syncBlockReason: SYNC_BLOCK_REASON.SERVER_ERROR,
    };
  }

  const statusCode = Number(error.statusCode) || 0;
  const message = String(error.message || "").toLowerCase();
  const payload = error.payload && typeof error.payload === "object" ? error.payload : {};
  const payloadError = String(payload.error || "").toLowerCase();
  const payloadCode = String(payload.code || "").toLowerCase();

  if (!hasAccessToken && !hasRefreshToken) {
    return {
      authStatus: AUTH_STATUS.MISSING_TOKEN,
      syncBlockReason: SYNC_BLOCK_REASON.MISSING_TOKEN,
    };
  }

  if (!hasAccessToken && hasRefreshToken) {
    return {
      authStatus: AUTH_STATUS.REFRESH_FAILED,
      syncBlockReason: SYNC_BLOCK_REASON.REFRESH_FAILED,
    };
  }

  if (statusCode === 401) {
    if (
      payloadError === "auth_session_revoked" ||
      payloadCode === "auth_session_revoked" ||
      message.includes("session revoked") ||
      message.includes("auth_session_revoked")
    ) {
      return {
        authStatus: AUTH_STATUS.SESSION_REVOKED,
        syncBlockReason: SYNC_BLOCK_REASON.SESSION_REVOKED,
      };
    }
    if (
      payloadError === "auth_session_expired" ||
      payloadCode === "auth_session_expired" ||
      message.includes("session expired") ||
      message.includes("auth_session_expired")
    ) {
      return {
        authStatus: AUTH_STATUS.SESSION_EXPIRED,
        syncBlockReason: SYNC_BLOCK_REASON.SESSION_EXPIRED,
      };
    }
    return {
      authStatus: AUTH_STATUS.SESSION_EXPIRED,
      syncBlockReason: SYNC_BLOCK_REASON.SESSION_EXPIRED,
    };
  }

  if (statusCode === 402 || statusCode === 403) {
    const billingIndicators = [
      "billing",
      "payment",
      "past_due",
      "suspended",
      "grace",
      "quota",
      "account_status",
      "billing_blocked",
    ];
    const collaborationIndicators = [
      "collaboration_blocked",
      "collaboration_not_in_plan",
      "member_limit_exceeded",
    ];
    const matchesBilling = billingIndicators.some(
      (indicator) =>
        message.includes(indicator) ||
        payloadError.includes(indicator) ||
        payloadCode.includes(indicator)
    );
    const matchesCollaboration = collaborationIndicators.some(
      (indicator) =>
        message.includes(indicator) ||
        payloadError.includes(indicator) ||
        payloadCode.includes(indicator)
    );
    if (matchesBilling || matchesCollaboration) {
      return {
        authStatus: AUTH_STATUS.BILLING_BLOCKED,
        syncBlockReason: SYNC_BLOCK_REASON.BILLING_BLOCKED,
      };
    }
  }

  if (isNetworkError(error)) {
    return {
      authStatus: AUTH_STATUS.ERROR,
      syncBlockReason: SYNC_BLOCK_REASON.NETWORK_ERROR,
    };
  }

  return {
    authStatus: AUTH_STATUS.ERROR,
    syncBlockReason: SYNC_BLOCK_REASON.SERVER_ERROR,
  };
}

function getCollaborationBlockReasonFromAccountStatus(accountStatus) {
  const reasons =
    accountStatus && Array.isArray(accountStatus.collaboration_block_reasons)
      ? accountStatus.collaboration_block_reasons
      : [];
  const knownReasons = new Set(Object.values(COLLABORATION_BLOCK_REASON));
  const reason = reasons.find(
    (item) => knownReasons.has(String(item)) && item !== COLLABORATION_BLOCK_REASON.NONE
  );
  if (reason) {
    return String(reason);
  }
  if (accountStatus && accountStatus.billing_blocked_collaboration === true) {
    return COLLABORATION_BLOCK_REASON.BILLING_BLOCKED;
  }
  return COLLABORATION_BLOCK_REASON.NOT_IN_PLAN;
}

function isNetworkError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const message = String(error.message || "").toLowerCase();
  const networkIndicators = [
    "fetch",
    "network",
    "timeout",
    "abort",
    "econnrefused",
    "enotfound",
    "econnreset",
    "dns",
    "socket",
    "offline",
  ];
  return (
    networkIndicators.some((indicator) => message.includes(indicator)) ||
    (Number(error.statusCode) || 0) === 0
  );
}

function classifyAndUpdateAuthState(plugin, error) {
  const existingStatus = (plugin.settings.authState || {}).status || AUTH_STATUS.UNKNOWN;
  const errorStatusCode = Number(error && error.statusCode) || 0;

  const hasAccessToken = Boolean(plugin.settings.accessToken);
  const hasRefreshToken = Boolean(plugin.settings.refreshToken);
  const classified = classifyAuthError(error, hasAccessToken, hasRefreshToken);

  if (
    existingStatus === AUTH_STATUS.MISSING_TOKEN ||
    existingStatus === AUTH_STATUS.REFRESH_FAILED ||
    existingStatus === AUTH_STATUS.SESSION_EXPIRED ||
    existingStatus === AUTH_STATUS.SESSION_REVOKED ||
    existingStatus === AUTH_STATUS.BILLING_BLOCKED
  ) {
    plugin.settings.authState.lastChecked = new Date().toISOString();
    return {
      authStatus: existingStatus,
      syncBlockReason: plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE,
    };
  }

  if (
    existingStatus === AUTH_STATUS.AUTHENTICATED &&
    errorStatusCode !== 401 &&
    errorStatusCode !== 403 &&
    classified.authStatus !== AUTH_STATUS.SESSION_EXPIRED &&
    classified.authStatus !== AUTH_STATUS.SESSION_REVOKED &&
    classified.authStatus !== AUTH_STATUS.BILLING_BLOCKED &&
    classified.authStatus !== AUTH_STATUS.MISSING_TOKEN
  ) {
    plugin.settings.authState.lastChecked = new Date().toISOString();
    return {
      authStatus: existingStatus,
      syncBlockReason: plugin.settings.syncBlockReason || SYNC_BLOCK_REASON.NONE,
    };
  }

  plugin.settings.authState = {
    status: classified.authStatus,
    reason: classified.syncBlockReason,
    lastChecked: new Date().toISOString(),
  };
  plugin.settings.syncBlockReason = classified.syncBlockReason;
  return classified;
}

function clearAuthBlock(plugin) {
  plugin.settings.authState = {
    status: plugin.settings.accessToken
      ? AUTH_STATUS.AUTHENTICATED
      : AUTH_STATUS.MISSING_TOKEN,
    reason: plugin.settings.accessToken ? "" : SYNC_BLOCK_REASON.MISSING_TOKEN,
    lastChecked: new Date().toISOString(),
  };
  plugin.settings.syncBlockReason = plugin.settings.accessToken
    ? SYNC_BLOCK_REASON.NONE
    : SYNC_BLOCK_REASON.MISSING_TOKEN;
  plugin.settings.collaborationBlockReason = COLLABORATION_BLOCK_REASON.NONE;
}

function buildAuthFailureNotice(plugin, error) {
  const language = plugin.settings.language;
  const hasAccessToken = Boolean(plugin.settings.accessToken);
  const hasRefreshToken = Boolean(plugin.settings.refreshToken);
  const classified = classifyAuthError(error, hasAccessToken, hasRefreshToken);
  if (!isAuthFailureNoticeStatus(classified.authStatus)) {
    return null;
  }

  const noticeKey = `auth.status.${classified.authStatus}`;
  const noticeMessage = translate(language, noticeKey);
  if (noticeMessage === noticeKey) {
    return null;
  }

  const reasonKey = `syncBlock.reason.${classified.syncBlockReason}`;
  const reasonMessage = translate(language, reasonKey);
  if (reasonMessage !== reasonKey) {
    return `${noticeMessage}: ${reasonMessage}`;
  }
  return noticeMessage;
}

function isAuthFailureNoticeStatus(authStatus) {
  return (
    authStatus === AUTH_STATUS.MISSING_TOKEN ||
    authStatus === AUTH_STATUS.REFRESH_FAILED ||
    authStatus === AUTH_STATUS.SESSION_EXPIRED ||
    authStatus === AUTH_STATUS.SESSION_REVOKED ||
    authStatus === AUTH_STATUS.BILLING_BLOCKED
  );
}

function buildSyncBlockedBillingMessage(plugin, payload) {
  const language = plugin && plugin.settings ? plugin.settings.language : "en";
  const effectiveStatus = String(
    payload && (payload.effective_billing_status || payload.billing_status || "")
  ).toLowerCase();
  const reasonKey = `error.syncBlockedBilling.${effectiveStatus || "generic"}`;
  const translatedReason = translate(language, reasonKey);
  if (translatedReason !== reasonKey) {
    return translatedReason;
  }
  if (payload && payload.user_message) {
    return String(payload.user_message);
  }
  if (payload && payload.message) {
    return String(payload.message);
  }
  return translate(language, "error.syncBlockedBilling.generic");
}

function formatErrorWithContext(language, stage, error) {
  const message = String(error && error.message ? error.message : error);
  if (!stage) {
    return message;
  }
  const stageKey = `stage.${stage}`;
  const stageLabel = translate(language, stageKey);
  return `${stageLabel === stageKey ? stage : stageLabel}: ${message}`;
}

function hasRequiredConfig(value) {
  return Boolean(
    value &&
      value.baseUrl &&
      (value.userEmail || value.userId) &&
      value.vaultId &&
      value.deviceId &&
      (value.accessToken || value.refreshToken)
  );
}

function mergeIgnorePaths(paths) {
  const rawPaths = Array.isArray(paths) ? paths : [];
  const merged = [];
  for (const path of DEFAULT_IGNORE_PATHS.concat(rawPaths)) {
    const normalizedPath = normalizeIgnorePath(path);
    if (normalizedPath && !merged.includes(normalizedPath)) {
      merged.push(normalizedPath);
    }
  }
  return merged.length > 0 ? merged : DEFAULT_IGNORE_PATHS.slice();
}

function normalizeIgnorePath(path) {
  return String(path || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^\/+/, "");
}

function normalizePluginPath(path) {
  return String(path || "")
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .trim();
}

function isRootObsidianConfigPath(path) {
  const normalizedPath = normalizePluginPath(path);
  return (
    normalizedPath === OBSIDIAN_CONFIG_DIR ||
    normalizedPath.startsWith(`${OBSIDIAN_CONFIG_DIR}/`)
  );
}

function isNestedObsidianConfigPath(path) {
  const segments = normalizePluginPath(path).split("/");
  return segments.slice(1).includes(OBSIDIAN_CONFIG_DIR);
}

function isAlwaysLocalObsidianConfigPath(path) {
  const normalizedPath = normalizePluginPath(path);
  return OBSIDIAN_CONFIG_ALWAYS_LOCAL_PATHS.some(
    (localPath) =>
      normalizedPath === localPath || normalizedPath.startsWith(`${localPath}/`)
  );
}

function shouldIncludeVaultSnapshotPath(path, includeObsidianConfig = false) {
  const normalizedPath = normalizePluginPath(path);
  if (!normalizedPath) {
    return false;
  }
  const segments = normalizedPath.split("/");
  if (
    segments.includes(".trash") ||
    segments.some((segment) => segment.includes(".sync-conflict-"))
  ) {
    return false;
  }
  const obsidianSegmentIndex = segments.indexOf(OBSIDIAN_CONFIG_DIR);
  if (obsidianSegmentIndex < 0) {
    return true;
  }
  return (
    includeObsidianConfig === true &&
    obsidianSegmentIndex === 0 &&
    !isAlwaysLocalObsidianConfigPath(normalizedPath)
  );
}

function filterPathKeyedMap(value, predicate) {
  return Object.fromEntries(
    Object.entries(value && typeof value === "object" ? value : {}).filter(
      ([path]) => predicate(normalizePluginPath(path))
    )
  );
}

function remoteOperationToSnapshotEntry(operation) {
  const operationType = String(operation && operation.operation_type ? operation.operation_type : "");
  const entryType = String(operation && operation.entry_type ? operation.entry_type : "");
  if (operationType === "mkdir" || entryType === "directory") {
    return {
      entryType: "directory",
      contentHash: null,
      sizeBytes: 0,
      mtimeMs: null,
    };
  }
  if (operationType !== "upsert") {
    return null;
  }
  const contentHash =
    operation.content_hash !== null && operation.content_hash !== undefined
      ? String(operation.content_hash)
      : "";
  if (!contentHash) {
    return null;
  }
  return {
    entryType: "file",
    contentHash,
    sizeBytes: Number(operation.resulting_entry_size_bytes || 0),
    mtimeMs: null,
  };
}

function normalizeContentHashForCompare(contentHash) {
  const value = String(contentHash || "").trim().toLowerCase();
  return value.startsWith("sha256:") ? value.slice("sha256:".length) : value;
}

async function computeVaultSnapshotFingerprint(entries, options = {}) {
  const includeObsidianConfig = options.includeObsidianConfig === true;
  const normalizedEntries = Object.entries(entries || {})
    .map(([path, entry]) => {
      const entryType = String(entry && entry.entryType ? entry.entryType : "")
        .trim()
        .toLowerCase();
      const contentHash =
        entryType === "file" && entry && entry.contentHash
          ? normalizeContentHashForCompare(entry.contentHash)
          : "";
      return [
        normalizePluginPath(path),
        entryType,
        contentHash,
      ];
    })
    .filter(
      ([path, entryType]) =>
        Boolean(path) &&
        Boolean(entryType) &&
        shouldIncludeVaultSnapshotPath(path, includeObsidianConfig)
    )
    .sort((left, right) => {
      if (left[0] < right[0]) {
        return -1;
      }
      if (left[0] > right[0]) {
        return 1;
      }
      return 0;
    });

  const payload = normalizedEntries
    .map(([path, entryType, contentHash]) => {
      const marker = entryType === "file" ? contentHash : "directory";
      return `${path}\u0000${entryType}\u0000${marker}\n`;
    })
    .join("");

  const input = new TextEncoder().encode(payload);
  const subtle =
    globalThis.crypto && globalThis.crypto.subtle
      ? globalThis.crypto.subtle
      : null;
  if (subtle && typeof subtle.digest === "function") {
    try {
      const digest = await subtle.digest("SHA-256", input);
      return `sha256:${Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("")}`;
    } catch (_error) {
      return "";
    }
  }
  return "";
}

async function computeCrdtHeadsFingerprint(crdtFiles, stateEntries) {
  const heads = Object.entries(crdtFiles || {})
    .map(([path, state]) => [
      normalizePluginPath(path),
      Math.max(0, Number(state && state.sequenceNumber) || 0),
    ])
    .filter(
      ([path, sequenceNumber]) =>
        Boolean(path) &&
        sequenceNumber > 0 &&
        Boolean(stateEntries && stateEntries[path]) &&
        !path
          .split("/")
          .some(
            (segment) =>
              segment === ".obsidian" ||
              segment === ".trash" ||
              segment.includes(".sync-conflict-")
          )
    )
    .sort((left, right) => left[0].localeCompare(right[0]));
  const payload = heads
    .map(([path, sequenceNumber]) => `${path}\u0000${sequenceNumber}\n`)
    .join("");
  const input = new TextEncoder().encode(payload);
  const subtle =
    globalThis.crypto && globalThis.crypto.subtle
      ? globalThis.crypto.subtle
      : null;
  if (subtle && typeof subtle.digest === "function") {
    try {
      const digest = await subtle.digest("SHA-256", input);
      return `sha256:${Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("")}`;
    } catch (_error) {
      return "";
    }
  }
  return "";
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

function normalizeSyncFolderPathList(paths) {
  const rawPaths = Array.isArray(paths) ? paths : [""];
  const normalized = [];
  for (const path of rawPaths) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath) {
      continue;
    }
    if (!normalized.includes(normalizedPath)) {
      normalized.push(normalizedPath);
    }
  }
  if (normalized.length === 0) {
    return [""];
  }
  const sorted = normalized.sort((left, right) => {
    const leftDepth = left.split("/").filter(Boolean).length;
    const rightDepth = right.split("/").filter(Boolean).length;
    if (leftDepth !== rightDepth) {
      return leftDepth - rightDepth;
    }
    return left.localeCompare(right);
  });
  const collapsed = [];
  for (const path of sorted) {
    if (
      collapsed.some(
        (existingPath) => path === existingPath || path.startsWith(`${existingPath}/`)
      )
    ) {
      continue;
    }
    collapsed.push(path);
  }
  return collapsed;
}

function normalizePendingDeletes(pendingDeletes) {
  const normalized = {};
  const entries =
    pendingDeletes && typeof pendingDeletes === "object"
      ? Object.entries(pendingDeletes)
      : [];
  for (const [path, item] of entries) {
    const normalizedPath = normalizePluginPath(path);
    if (!normalizedPath || !item || typeof item !== "object") {
      continue;
    }
    const entryType = String(item.entryType || item.entry_type || "")
      .trim()
      .toLowerCase();
    if (entryType !== "file" && entryType !== "directory") {
      continue;
    }
    normalized[normalizedPath] = {
      entryType,
      contentHash:
        item.contentHash !== null && item.contentHash !== undefined
          ? String(item.contentHash)
          : null,
      sizeBytes: Number(item.sizeBytes || item.size_bytes || 0),
      firstSeenAt: Number(item.firstSeenAt || item.first_seen_at || Date.now()),
      lastSeenAt: Number(item.lastSeenAt || item.last_seen_at || Date.now()),
    };
  }
  return normalized;
}

function normalizeOperationSource(source) {
  const normalized = String(source || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (!normalized) {
    return "sync_diff";
  }
  if (
    [
      "sync_diff",
      "conflict_resolution",
      "publish_source",
      "merge_divergence",
      "manual",
    ].includes(normalized)
  ) {
    return normalized;
  }
  return "manual";
}

function formatSyncFolderPaths(paths) {
  const normalized = normalizeSyncFolderPathList(paths);
  if (normalized.includes("")) {
    return "";
  }
  return normalized.join("\n");
}

function applyTextDiff(yText, previousText, nextText) {
  if (previousText === nextText) {
    return;
  }
  let prefixLength = 0;
  const maxPrefixLength = Math.min(previousText.length, nextText.length);
  while (
    prefixLength < maxPrefixLength &&
    previousText.charCodeAt(prefixLength) === nextText.charCodeAt(prefixLength)
  ) {
    prefixLength += 1;
  }

  let previousEnd = previousText.length;
  let nextEnd = nextText.length;
  while (
    previousEnd > prefixLength &&
    nextEnd > prefixLength &&
    previousText.charCodeAt(previousEnd - 1) === nextText.charCodeAt(nextEnd - 1)
  ) {
    previousEnd -= 1;
    nextEnd -= 1;
  }

  if (previousEnd > prefixLength) {
    yText.delete(prefixLength, previousEnd - prefixLength);
  }
  if (nextEnd > prefixLength) {
    yText.insert(prefixLength, nextText.slice(prefixLength, nextEnd));
  }
}

function uint8ArrayToBase64(bytes) {
  const normalizedBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < normalizedBytes.length; offset += chunkSize) {
    const chunk = normalizedBytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function base64ToUint8Array(payload) {
  const binary = atob(String(payload || ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function utf8ToBase64(text) {
  return uint8ArrayToBase64(new TextEncoder().encode(String(text || "")));
}

function base64ToUtf8(payload) {
  return new TextDecoder().decode(base64ToUint8Array(payload));
}

function buildVaultDivergenceLocalDetail(entry) {
  return {
    entryType: String(entry && entry.entryType ? entry.entryType : ""),
    sizeBytes: Number(entry && entry.sizeBytes ? entry.sizeBytes : 0),
    contentHash: entry && entry.contentHash ? String(entry.contentHash) : "",
    modifiedAt: isoFromMtimeMs(entry && entry.mtimeMs),
  };
}

function buildVaultDivergenceServerDetail(snapshotEntry, remoteEntry) {
  return {
    entryType: String(snapshotEntry && snapshotEntry.entryType ? snapshotEntry.entryType : ""),
    sizeBytes: Number(snapshotEntry && snapshotEntry.sizeBytes ? snapshotEntry.sizeBytes : 0),
    contentHash: snapshotEntry && snapshotEntry.contentHash ? String(snapshotEntry.contentHash) : "",
    modifiedAt: String(
      (remoteEntry && (remoteEntry.updated_at || remoteEntry.created_at)) || ""
    ),
  };
}

function isoFromMtimeMs(mtimeMs) {
  const timestamp = Number(mtimeMs);
  if (!Number.isFinite(timestamp)) {
    return "";
  }
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function formatVaultDivergenceTimestamp(value, fallback) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return fallback;
  }
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }
  return date.toLocaleString();
}

function formatVaultDivergenceSize(sizeBytes) {
  const size = Number(sizeBytes || 0);
  if (!Number.isFinite(size)) {
    return "0 B";
  }
  return `${Math.max(0, Math.round(size))} B`;
}

function shortContentHash(contentHash) {
  const value = String(contentHash || "").trim();
  if (!value) {
    return "-";
  }
  return value.length > 24 ? `${value.slice(0, 24)}...` : value;
}

function sameSyncIdentity(left, right) {
  const leftEntryType = String(left && left.entryType ? left.entryType : "")
    .trim()
    .toLowerCase();
  const rightEntryType = String(right && right.entryType ? right.entryType : "")
    .trim()
    .toLowerCase();
  if (leftEntryType !== rightEntryType) {
    return false;
  }
  if (Number((left && left.sizeBytes) || 0) !== Number((right && right.sizeBytes) || 0)) {
    return false;
  }
  if (leftEntryType !== "file") {
    return true;
  }
  return (
    normalizeContentHashForCompare(left && left.contentHash) ===
    normalizeContentHashForCompare(right && right.contentHash)
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
  const conflictRoot = ".sync-conflict-local";
  const conflictName = `${baseName}.${suffix}`;
  return parentPath
    ? `${conflictRoot}/${parentPath}/${conflictName}`
    : `${conflictRoot}/${conflictName}`;
}

function isConflictArtifactPath(path) {
  const normalizedPath = normalizePath(path);
  if (!normalizedPath) {
    return false;
  }
  return normalizedPath.split("/").some((segment) => segment.includes(".sync-conflict-"));
}

function isShareableFolderPath(path) {
  const normalizedPath = normalizePath(String(path || ""));
  if (!normalizedPath) {
    return false;
  }
  return !normalizedPath.split("/").some(
    (segment) =>
      DEFAULT_IGNORE_PATH_SEGMENTS.includes(segment) ||
      segment.includes(".sync-conflict-")
  );
}

function cloneEntries(entries) {
  return JSON.parse(JSON.stringify(entries || {}));
}

function snapshotEntryIdentity(entry) {
  const entryType = String(entry && entry.entryType ? entry.entryType : "")
    .trim()
    .toLowerCase();
  if (!entryType) {
    return "";
  }
  if (entryType === "file") {
    return `${entryType}\u0000${normalizeContentHashForCompare(entry.contentHash)}`;
  }
  return `${entryType}\u0000directory`;
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
