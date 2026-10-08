// Public Nostr connections are intentionally reusable. Ticketed Free connections
// must release their authenticated device slot when the last room leaves.
export function patchTicketRelayLifecycle(utils, nostr) {
 const init='\tconst init = () => {\n\t\tisReconnectPending = false;';
 const close='\t\tsocket.onclose = () => {\n\t\t\tif (isReconnectPending) return;';
 const start='\tinit();\n\treturn client;';
 const sockets='\t\tgetSockets: () => fromEntries(entries(relays).flatMap';
 const cleanup='\t\tdelete batchers[client.url];';
 for(const [source,marker] of [[utils,init],[utils,close],[utils,start],[utils,sockets],[nostr,cleanup]])if(source.split(marker).length!==2)throw Error('Unexpected ticketed relay lifecycle');
 utils=utils.replace(init,'\tlet disposed = false;\n'+init.replace('isReconnectPending = false;','if (disposed) return;\n\t\tisReconnectPending = false;'))
  .replace(close,close.replace('if (isReconnectPending) return;','if (disposed || isReconnectPending) return;\n\t\t\tif (url.startsWith("wss://arcalink.ru/sync-lab/free/signal?ticket=")) { disposed = true; resolveReady(client); globalThis.dispatchEvent?.(new Event("arcalink-free-signal-change")); return; }'))
  .replace(start,'\tclient.dispose = () => { disposed = true; client.socket?.close(); };\n'+start)
  .replace(sockets,'\t\trelease: key => { const relay = relays[key]; delete relays[key]; relay?.dispose?.(); },\n'+sockets);
 nostr=nostr.replace(cleanup,cleanup+'\n\t\tif (client.url.startsWith("wss://arcalink.ru/sync-lab/free/signal?ticket=")) relayManager.release(client.url);');
 return {utils,nostr};
}
// Missing-chunk requests may include chunks the slow sender has not sent yet.
// Free opts in to postponing resends and cancelling stale resend loops on ACK.
export function patchFreeChunkRetries(source) {
 const outgoing='    this.outgoingChunkMap.set(streamId, { peerId, chunks });';
 const end='    }\n  }\n  scheduleMissingAck(streamId, peerId) {';
 const resend=`    for (const index of message.missing) {
      const payload = state.chunks[index];
      if (payload === void 0) continue;
      await this.options.transport.send(
        {
          wire: "chunk",
          streamId: message.streamId,
          index,
          total: state.chunks.length,
          payload
        },
        state.peerId
      );
    }`;
 for(const marker of [outgoing,end,resend])if(source.split(marker).length!==2)throw Error('Unexpected RPC chunk retry boundary');
 return source.replace(outgoing,'    const outgoing = { peerId, chunks, sending: true, resending: false };\n    this.outgoingChunkMap.set(streamId, outgoing);')
  .replace(end,'    }\n    outgoing.sending = false;\n  }\n  scheduleMissingAck(streamId, peerId) {')
  .replace(resend,`    const defer = this.options.deferChunkRetriesUntilSent;
    if (defer && (state.sending || state.resending)) return;
    state.resending = true;
    try {
${resend.replace('      const payload = state.chunks[index];','      if (defer && this.outgoingChunkMap.get(message.streamId) !== state) return;\n      const payload = state.chunks[index];')}
    } finally { state.resending = false; }`);
}

// Ticketed rooms are retired when credentials or the signal socket change. A
// detached shared RTC connection must not outlive that authenticated session.
// Public rooms still reuse their idle connections; peers bound to another room
// are retained even when a Free room leaves.
export function patchTicketedPeerCleanup(source) {
 const boundary='\t\t\tif (hasActiveRooms()) return;';
 if(source.split(boundary).length!==2)throw Error('Unexpected shared-peer room retirement boundary');
 return source.replace(boundary,`\t\t\tif (config.relayConfig?.urls?.some(url => url.startsWith("wss://arcalink.ru/sync-lab/free/signal?ticket="))) {
\t\t\t\tentries(sharedPeers.getMap(appId)).forEach(([peerId, shared]) => {
\t\t\t\t\tif (peerId in ctx.peerStates && keys(shared.bindings).length === 0) sharedPeers.clear(appId, peerId, { destroyPeer: true });
\t\t\t\t});
\t\t\t}
${boundary}`);
}

// Trystero emits its close callback on a failed/disconnected RTC without closing
// the native connection. Free must release the TURN allocation on that boundary,
// rather than depending on garbage collection while reconnection creates peers.
export function patchTicketedRtcRelease(source) {
 const config='trickleIce, rtcConfig, rtcPolyfill, turnConfig, _test_only_mdnsHostFallbackToLoopback';
 const closed='\t\tdidEmitClose = true;\n\t\tclearDisconnectedCloseTimer();';
 for(const marker of [config,closed])if(source.split(marker).length!==2)throw Error('Unexpected native RTC close boundary');
 return source.replace(config,config+', relayConfig').replace(closed,closed+`
\t\tif (relayConfig?.urls?.some(url => url.startsWith("wss://arcalink.ru/sync-lab/free/signal?ticket=")) && pc.connectionState !== "closed") {
\t\t\tdataChannel?.close();
\t\t\tpc.close();
\t\t}`);
}

// A failed warmup never registers a room, so onSelfLeave cannot retire its pool.
// Free must not inherit that pool's captured RTC/credentials on the next join.
export function patchTicketedFreshJoin(source) {
 const pool='\t\tconst makeOffer = () => peer_default(true, config);';
 const init='\t\tif (!didInit) {';
 for(const marker of [pool,init])if(source.split(marker).length!==2)throw Error('Unexpected Free offer initialization boundary');
 return source.replace(pool,`\t\tconst ticketedFree = config.relayConfig?.urls?.some(url => url.startsWith("wss://arcalink.ru/sync-lab/free/signal?ticket="));
\t\tif (ticketedFree && !hasActiveRooms() && offerPool) {
\t\t\tofferPool.destroy();
\t\t\tofferPool = null;
\t\t\tdidInit = false;
\t\t\tcleanupWatchOnline();
\t\t}
${pool}`).replace(init,`\t\t// Validate native RTC before allocating an authenticated signalling slot.
\t\tif (ticketedFree && !isPassive && !pool.isActive) pool.warmup();
${init}`);
}
