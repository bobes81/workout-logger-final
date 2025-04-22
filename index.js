const http = require('http');
const fs = require('fs');
const path = require('path');
const static = require('node-static');
const WebSocket = require('ws');
const pty = require('node-pty');

// Statický server pro složku /public
const fileServer = new static.Server('./public');

// Vytvoření HTTP serveru (pro HTML stránku)
const server = http.createServer((req, res) => {
  req.addListener('end', () => {
    fileServer.serve(req, res);
  }).resume();
});

// WebSocket server napojený na HTTP server
const wss = new WebSocket.Server({ server });

// Spuštění WebSocket spojení
wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  const scriptPath = path.join(__dirname, 'run.py');

  // Ověření existence skriptu
  if (!fs.existsSync(scriptPath)) {
    const msg = '❌ Error: run.py not found.';
    console.error(msg);
    ws.send(msg);
    ws.close();
    return;
  }

  try {
    // Spuštění run.py jako pseudoterminálu
    const shell = pty.spawn('python3', ['run.py'], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
      env: process.env
    });

    shell.on('data', (data) => {
      ws.send(data);
    });

    shell.on('exit', (code, signal) => {
      console.log(`📤 PTY exited (code: ${code}, signal: ${signal})`);
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

  } catch (err) {
    console.error('🔥 PTY spawn failed:', err.message);
    ws.send(`Error: ${err.message}`);
    ws.close();
  }
});

// Start serveru (pro Heroku port nebo localhost)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
