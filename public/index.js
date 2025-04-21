const http = require('http');
const fs = require('fs');
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
  console.log('Client connected');

  // Spuštění Python skriptu jako pseudoterminál
  const shell = Pty.spawn('python3', ['run.py'], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.PWD,
    env: process.env,
  });

  // Posílání dat z Pythonu klientovi
  shell.on('data', (data) => {
    ws.send(data);
  });

  // Posílání dat od klienta Python skriptu
  ws.on('message', (msg) => {
    shell.write(msg);
  });

  // Zavření spojení
  ws.on('close', () => {
    console.log('Client disconnected');
    shell.kill();
  });

  // Ošetření chyb
  shell.on('error', (err) => {
    console.error('Shell error:', err);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// Start serveru
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
