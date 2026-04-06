const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// ---- HTTP server to serve static files ----
const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);
  const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg' };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': contentType }); res.end(data);
  });
});

// ---- WebSocket server ----
const wss = new WebSocketServer({ server });

// ---- Lobbies ----
const lobbies = new Map(); // code -> { players: Map<id, {ws, name, color, ready}>, hostId, started, seed, mode }
const playerToLobby = new Map(); // ws -> { code, id }
let nextPlayerId = 1;

const PLAYER_COLORS = ['#4af', '#f44', '#4f4', '#fa4'];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (lobbies.has(code));
  return code;
}

function broadcastToLobby(code, msg, excludeWs = null) {
  const lobby = lobbies.get(code);
  if (!lobby) return;
  const data = JSON.stringify(msg);
  for (const [id, p] of lobby.players) {
    if (p.ws !== excludeWs && p.ws.readyState === 1) {
      p.ws.send(data);
    }
  }
}

function sendLobbyUpdate(code) {
  const lobby = lobbies.get(code);
  if (!lobby) return;
  const playerList = [];
  for (const [id, p] of lobby.players) {
    playerList.push({ id, name: p.name, color: p.color });
  }
  broadcastToLobby(code, {
    type: 'lobby_update',
    players: playerList,
    hostId: lobby.hostId,
    code,
    mode: lobby.mode,
  });
}

function cleanupLobby(code) {
  const lobby = lobbies.get(code);
  if (!lobby) return;
  if (lobby.players.size === 0) {
    lobbies.delete(code);
    console.log(`Lobby ${code} deleted (empty)`);
  }
}

wss.on('connection', (ws) => {
  const playerId = nextPlayerId++;
  console.log(`Player ${playerId} connected`);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'create_lobby': {
        const code = generateCode();
        const name = (msg.name || `Player ${playerId}`).substring(0, 16);
        const lobby = {
          players: new Map(),
          hostId: playerId,
          started: false,
          seed: Math.floor(Math.random() * 999999),
          mode: 'dungeon',
        };
        lobby.players.set(playerId, { ws, name, color: PLAYER_COLORS[0] });
        lobbies.set(code, lobby);
        playerToLobby.set(ws, { code, id: playerId });

        ws.send(JSON.stringify({ type: 'lobby_created', code, playerId, seed: lobby.seed }));
        sendLobbyUpdate(code);
        console.log(`Lobby ${code} created by ${name} (host: ${playerId})`);
        break;
      }

      case 'join_lobby': {
        const code = (msg.code || '').toUpperCase().trim();
        const lobby = lobbies.get(code);
        if (!lobby) { ws.send(JSON.stringify({ type: 'error', message: 'Lobby not found' })); return; }
        if (lobby.started) { ws.send(JSON.stringify({ type: 'error', message: 'Game already started' })); return; }
        if (lobby.players.size >= 4) { ws.send(JSON.stringify({ type: 'error', message: 'Lobby is full' })); return; }

        const name = (msg.name || `Player ${playerId}`).substring(0, 16);
        const colorIdx = lobby.players.size;
        lobby.players.set(playerId, { ws, name, color: PLAYER_COLORS[colorIdx] });
        playerToLobby.set(ws, { code, id: playerId });

        ws.send(JSON.stringify({ type: 'lobby_joined', code, playerId, seed: lobby.seed }));
        sendLobbyUpdate(code);
        console.log(`${name} joined lobby ${code} (${lobby.players.size}/4)`);
        break;
      }

      case 'start_game': {
        const info = playerToLobby.get(ws);
        if (!info) return;
        const lobby = lobbies.get(info.code);
        if (!lobby || lobby.hostId !== info.id) return;
        if (lobby.players.size < 2) { ws.send(JSON.stringify({ type: 'error', message: 'Need at least 2 players' })); return; }

        lobby.started = true;
        broadcastToLobby(info.code, { type: 'game_start', seed: lobby.seed, mode: lobby.mode });
        console.log(`Game started in lobby ${info.code}`);
        break;
      }

      case 'request_lobby_update': {
        const info = playerToLobby.get(ws);
        if (info) sendLobbyUpdate(info.code);
        break;
      }

      case 'set_mode': {
        const info2 = playerToLobby.get(ws);
        if (!info2) return;
        const lobby2 = lobbies.get(info2.code);
        if (!lobby2 || lobby2.hostId !== info2.id || lobby2.started) return;
        if (msg.mode === 'dungeon' || msg.mode === 'survival' || msg.mode === 'horde' || msg.mode === 'gauntlet' || msg.mode === 'descent') {
          lobby2.mode = msg.mode;
          sendLobbyUpdate(info2.code);
        }
        break;
      }

      // ---- In-game message relay ----
      case 'game_state':
      case 'player_input':
      case 'player_died':
      case 'game_over': {
        const info = playerToLobby.get(ws);
        if (!info) return;
        msg.fromId = info.id;
        broadcastToLobby(info.code, msg, ws);
        break;
      }
    }
  });

  ws.on('close', () => {
    const info = playerToLobby.get(ws);
    if (info) {
      const lobby = lobbies.get(info.code);
      if (lobby) {
        const playerData = lobby.players.get(info.id);
        console.log(`${playerData?.name || info.id} disconnected from lobby ${info.code}`);
        lobby.players.delete(info.id);

        // If host left and game hasn't started, promote or delete
        if (lobby.hostId === info.id && !lobby.started) {
          const remaining = [...lobby.players.keys()];
          if (remaining.length > 0) {
            lobby.hostId = remaining[0];
            sendLobbyUpdate(info.code);
          }
        }

        // Notify remaining players
        if (lobby.started) {
          broadcastToLobby(info.code, { type: 'player_disconnected', playerId: info.id });
        } else {
          sendLobbyUpdate(info.code);
        }

        cleanupLobby(info.code);
      }
      playerToLobby.delete(ws);
    }
    console.log(`Player ${playerId} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`DEAD ZONE server running on http://localhost:${PORT}`);
});
