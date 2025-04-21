const Pty = require('node-pty');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const static = require('node-static');

const fileServer = new static.Server('./public');

const server = http.createServer((req, res) => {
    req.addListener('end', () => {
        fileServer.serve(req, res);
    }).resume();
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
    const shell = Pty.spawn('python3', ['run.py'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.PWD,
        env: process.env,
    });

    shell.on('data', function (data) {
        ws.send(data);
    });

    ws.on('message', function (msg) {
        shell.write(msg);
    });

    ws.on('close', function () {
        shell.kill();
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port ' + (process.env.PORT || 3000));
});
