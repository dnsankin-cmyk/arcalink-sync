// Large first downloads may keep applying files for several minutes. Allow
// progress to extend the wait, while bounding a stuck queue and the whole job.
export async function waitForReplicationDrain(readCounts, {
    now = Date.now,
    sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
    idleTimeout = 120000,
    totalTimeout = 1800000,
    pollInterval = 100,
} = {}) {
    const started = now();
    let lastProgress = started, previous = '';
    while (true) {
        const counts = readCounts();
        if (counts.every(count => count === 0)) return true;
        const current = now(), signature = counts.join(':');
        if (signature !== previous) { previous = signature; lastProgress = current; }
        if (current - lastProgress >= idleTimeout || current - started >= totalTimeout) return false;
        await sleep(pollInterval);
    }
}
