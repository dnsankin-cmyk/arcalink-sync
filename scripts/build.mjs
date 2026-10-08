import {execFileSync} from 'node:child_process';
import {copyFileSync} from 'node:fs';
execFileSync(process.execPath,['prototypes/livesync/scripts/build-plugin.mjs'],{env:{...process.env,ARCALINK_RELEASE_CHANNEL:'community'},stdio:'inherit'});
for(const name of ['main.js','manifest.json','styles.css','THIRD_PARTY_NOTICES.txt','UPSTREAM.json'])copyFileSync('prototypes/livesync/dist/arcalink-sync/'+name,name);
