// The upstream cache retains fetch callbacks. They must belong to the current
// credentials and transport, rather than just the database URL.
export async function syncParametersCacheKey(settings){
 const keys=['couchDB_DBNAME','couchDB_USER','couchDB_PASSWORD','useJWT','jwtAlgorithm','jwtKey','jwtExpDuration','jwtKid','jwtSub','useRequestAPI','disableRequestURI','couchDB_CustomHeaders','encrypt','passphrase','useDynamicIterationCount','enableCompression','E2EEAlgorithm','encryptInternalMetadata'];
 const identity=[settings.couchDB_URI.replace(/\/+$/,''),...keys.map(key=>settings[key]??null)];
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(identity)));
 return 'arcalink-sync-parameters:'+Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
}
