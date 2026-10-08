// Text extensions can contain Windows-1251 or UTF-16 attachments. Decode only
// lossless UTF-8; otherwise retain the original bytes as binary content.
export function decodeFilePreservingBytes(bytes, textExtension) {
    if (!textExtension) return bytes;
    try { return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
    catch { return bytes; }
}
