// --- Injection Script with Debug Logging ---

// Log that our custom script is injected.
console.log("Delta-like WebSocket interceptor script injected.");

// Check if pako is loaded; if not, log an error.
if (typeof pako === "undefined") {
  console.error("pako is not loaded! Please include pako before this script runs.");
} else {
  console.log("pako is available.");
}

// --- Decompression Module ---
function decompress(buffer) {
  try {
    const uint8Buffer = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    // Our custom protocol flag: if first byte is 0xFF, then it's compressed.
    if (uint8Buffer[0] === 0xFF) {
      console.log("Compressed packet detected; decompressing...");
      const compressedData = uint8Buffer.slice(1);
      const decompressed = pako.inflate(compressedData);
      return decompressed; // Uint8Array
    } else {
      return uint8Buffer;
    }
  } catch (e) {
    console.error("Decompression failed:", e);
    return null;
  }
}

// --- Dynamic Opcode Mapping Module ---
let opcodeMap = {};
function generateOpcodeMap() {
  const knownTypes = ["worldUpdate", "leaderboard", "chat"];
  knownTypes.forEach(type => {
    const randomOpcode = Math.floor(Math.random() * 256);
    opcodeMap[randomOpcode] = type;
  });
  console.log("Generated Opcode Map:", opcodeMap);
}
generateOpcodeMap();

function resolveOpcode(opcodeByte) {
  return opcodeMap.hasOwnProperty(opcodeByte) ? opcodeMap[opcodeByte] : "unknown";
}

// --- Buffer Utility Functions ---
function readUInt32(buffer, offset) {
  const view = new DataView(buffer.buffer || buffer);
  return view.getUint32(offset, true);
}

function readUInt16(buffer, offset) {
  const view = new DataView(buffer.buffer || buffer);
  return view.getUint16(offset, true);
}

function readUTF16StringZero(buffer, offset) {
  let chars = [];
  let i = offset;
  while (i < buffer.length) {
    let codeUnit = buffer[i] | (buffer[i + 1] << 8);
    if (codeUnit === 0) break;
    chars.push(String.fromCharCode(codeUnit));
    i += 2;
  }
  return { str: chars.join(''), nextOffset: i + 2 };
}

function readUTF8StringZero(buffer, offset) {
  let bytes = [];
  let i = offset;
  while (i < buffer.length) {
    let byte = buffer[i];
    if (byte === 0) break;
    bytes.push(byte);
    i++;
  }
  const decoder = new TextDecoder("utf-8");
  const str = decoder.decode(new Uint8Array(bytes));
  return { str, nextOffset: i + 1 };
}

// --- Packet Decoders ---
function decodeWorldUpdate(buffer) {
  let offset = 0;
  const view = new DataView(buffer.buffer);
  const count = view.getUint16(offset, true);
  offset += 2;
  let objects = [];
  for (let i = 0; i < count; i++) {
    const id = view.getUint16(offset, true); offset += 2;
    const x = view.getInt16(offset, true); offset += 2;
    const y = view.getInt16(offset, true); offset += 2;
    const size = view.getUint16(offset, true); offset += 2;
    objects.push({ id, x, y, size });
  }
  return { type: "worldUpdate", count, objects };
}

function decodeLeaderboard(buffer) {
  let offset = 0;
  const view = new DataView(buffer.buffer);
  const count = view.getUint32(offset, true);
  offset += 4;
  let leaderboard = [];
  for (let i = 0; i < count; i++) {
    const playerId = view.getUint16(offset, true); offset += 2;
    const result = readUTF16StringZero(buffer, offset);
    const name = result.str;
    offset = result.nextOffset;
    leaderboard.push({ playerId, name });
  }
  return { type: "leaderboard", count, leaderboard };
}

function decodeChat(buffer) {
  let offset = 0;
  const view = new DataView(buffer.buffer);
  const senderId = view.getUint16(offset, true); offset += 2;
  const result = readUTF8StringZero(buffer, offset);
  const message = result.str;
  offset = result.nextOffset;
  return { type: "chat", senderId, message };
}

// --- Main Message Handler ---
function handleRawMessage(data) {
  const rawBuffer = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  console.log("Raw message received:", rawBuffer);
  const processedBuffer = decompress(rawBuffer) || rawBuffer;
  if (!processedBuffer) return;
  const opcode = processedBuffer[0];
  const payload = processedBuffer.slice(1);
  const messageType = resolveOpcode(opcode);
  let decoded;
  switch (messageType) {
    case "worldUpdate":
      decoded = decodeWorldUpdate(payload);
      break;
    case "leaderboard":
      decoded = decodeLeaderboard(payload);
      break;
    case "chat":
      decoded = decodeChat(payload);
      break;
    default:
      decoded = { type: "unknown", opcode: opcode, rawPayload: payload };
  }
  console.log("[WS] Received " + messageType + ":", decoded);
}

// --- Override WebSocket ---
(function() {
  const NativeWebSocket = window.WebSocket;
  function CustomWebSocket(url, protocols) {
    console.log("Creating new WebSocket connection to:", url);
    const ws = new NativeWebSocket(url, protocols);
    ws.addEventListener('message', event => {
      console.log("WebSocket message event intercepted.");
      handleRawMessage(event.data);
    });
    return ws;
  }
  CustomWebSocket.prototype = NativeWebSocket.prototype;
  CustomWebSocket.CONNECTING = NativeWebSocket.CONNECTING;
  CustomWebSocket.OPEN = NativeWebSocket.OPEN;
  CustomWebSocket.CLOSING = NativeWebSocket.CLOSING;
  CustomWebSocket.CLOSED = NativeWebSocket.CLOSED;
  window.WebSocket = CustomWebSocket;
  console.log("Custom WebSocket override for Delta message processing is active.");
})();

// End of injected script.
