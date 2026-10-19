// Web Serial transport for a real ELM327 adapter (laptop Chrome/Edge only). Half-duplex: one command
// at a time, each terminated with '\r'; a response ends at the ELM327 '>' prompt. We only ever WRITE
// commands the ELM327 layer already cleared as read-only, and never open the port for anything else.
export const serialSupported = () => typeof navigator !== 'undefined' && 'serial' in navigator;

export async function requestPort() {
  // ELM327 clones mostly use these USB-serial bridges; the filter just pre-selects them in the picker.
  const filters = [{ usbVendorId: 0x0403 }, { usbVendorId: 0x10c4 }, { usbVendorId: 0x1a86 }, { usbVendorId: 0x067b }];
  try { return await navigator.serial.requestPort({ filters }); } catch { return null; }
}

export async function createSerialTransport(port, { baudRate = 38400, timeoutMs = 5000 } = {}) {
  await port.open({ baudRate });
  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let pending = null;           // { resolve, reject, timer }
  let running = true;

  (async () => {
    try {
      while (running) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const i = buf.indexOf('>');
        if (i >= 0 && pending) {
          const chunk = buf.slice(0, i);
          buf = buf.slice(i + 1);
          const lines = chunk.split(/[\r\n]+/).map((l) => l.trim()).filter((l) => l && l !== '>');
          const p = pending; pending = null; clearTimeout(p.timer); p.resolve(lines);
        }
      }
    } catch (e) { if (pending) { pending.reject(e); pending = null; } }
  })();

  let chain = Promise.resolve();
  function request(cmd) {
    chain = chain.then(() => new Promise((resolve, reject) => {
      buf = '';
      pending = { resolve, reject, timer: setTimeout(() => { if (pending) { pending = null; reject(new Error(`Timed out waiting for the adapter (${cmd}).`)); } }, timeoutMs) };
      writer.write(new TextEncoder().encode(cmd + '\r')).catch(reject);
    }));
    return chain;
  }

  async function close() {
    running = false;
    try { await reader.cancel(); } catch { /* */ }
    try { reader.releaseLock(); } catch { /* */ }
    try { await writer.close(); } catch { /* */ } finally { try { writer.releaseLock(); } catch { /* */ } }
    try { await port.close(); } catch { /* */ }
  }
  return { request, close, demo: false };
}
