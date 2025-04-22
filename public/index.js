const http = require('http');
const fs = require('fs');
const path = require('path');
const static = require('node-static');
const WebSocket = require('ws');
const Pty = require('node-pty');

// Slouží statické soubory (např. index.html, style.css, atd.) z ./public
const fileServer = new static.Server('./public');

// HTTP server pro načtení webové stránky
const server = http.createServer((req, res) => {
  req.addListener('end', () => {
    fileServer.serve(req, res);
  }).resume();
});

// WebSocket server propojený s HTTP serverem
const wss = new WebSocket.Server({ server });

// Když se klient připojí přes WebSocket
wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  // Ověření existence run.py
  const scriptPath = path.join(__dirname, 'run.py');
  if (!fs.existsSync(scriptPath)) {
    const errMsg = '❌ Error: run.py not found in root directory.';
    console.error(errMsg);
    ws.send(errMsg);
    ws.close();
    return;
  }

  try {
    // Spuštění Python skriptu jako pseudoterminál
    const shell = Pty.spawn('python3', ['run.py'], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.PWD,
      env: process.env,
    });

    shell.on('data', (data) => {
      console.log('[PTY]', data);
      ws.send(data);
    });

    shell.on('exit', (code, signal) => {
      console.log(`📤 PTY exited | code: ${code}, signal: ${signal}`);
    });

    ws.on('message', (msg) => {
      shell.write(msg);
    });

    ws.on('close', () => {
      console.log('❎ Client disconnected');
      shell.kill();
    });

    shell.on('error', (err) => {
      console.error('Shell error:', err);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });

  } catch (error) {
    console.error('🔥 Failed to start PTY:', error.message);
    ws.send(`Error: ${error.message}`);
    ws.close();
  }
});

// Start serveru
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
