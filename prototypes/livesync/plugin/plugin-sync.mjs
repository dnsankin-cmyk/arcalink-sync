const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g,'\\x20').replace(/,/g,'\\x2c');

// The engine applies these filters to both upload and download. Never send
// a synchroniser's credentials, update journal or local connection to a peer.
export function pluginSyncSettings(enabled, configDir, pluginId) {
  const root = escapeRegExp(configDir + '/plugins/');
  // The scanner tests directories before descending: allow the ancestors too.
  const ancestors = configDir.split('/').map((_,i,parts)=>escapeRegExp(parts.slice(0,i+1).join('/'))+'$');
  const excluded = [...new Set([pluginId, 'arcalink-sync', 'obsidian-livesync'])].map(escapeRegExp).join('|');
  return {
    syncInternalFiles: !!enabled,
    syncInternalFilesTargetPatterns: /** @type {import('@vrtmrz/livesync-commonlib/compat/common/types').ObsidianLiveSyncSettings['syncInternalFilesTargetPatterns']} */ ('^(?:' + [...ancestors,escapeRegExp(configDir+'/plugins')+'(?:/|$)'].join('|') + ')'),
    syncInternalFilesIgnorePatterns: /** @type {import('@vrtmrz/livesync-commonlib/compat/common/types').ObsidianLiveSyncSettings['syncInternalFilesIgnorePatterns']} */ ('^' + root + '(?:' + excluded + ')(?:/|$)'),
    watchInternalFileChanges: !!enabled,
    syncInternalFilesBeforeReplication: !!enabled,
    syncInternalFilesInterval: enabled ? 30 : 0,
    usePluginSync: false,
  };
}
