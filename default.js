const pty = require('node-pty');
const fs = require('fs');

exports.install = function () {
  // Serve static files from the public folder
  STATIC('public');

  // Define the route for homepage
  ROUTE('/');

  // WebSocket on root path
  WEBSOCKET('/', handleSocket, ['raw']);
};

function handleSocket() {
  this.encodedecode = false;
  this.autodestroy();

  this.on('open', function (client) {
    console.log('🟢 WebSocket client connected');

    // Start the Python CLI application using a pseudo-terminal
    client.pty = pty.spawn('python3', ['run.py'], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
      env: process.env,
    });

    client.pty.on('data', function (data) {
      client.send(data);
    });

    client.pty.on('exit', function () {
      console.log('📤 Python process exited');
      client.pty = null;
      client.close();
    });
  });

  this.on('message', function (client, message) {
    if (client.pty) {
      client.pty.write(message);
    }
  });

  this.on('close', function (client) {
    if (client.pty) {
      client.pty.kill();
      client.pty = null;
      console.log('❌ Terminal closed and client disconnected');
    }
  });
}

// Automatically create creds.json from environment variable if running on Heroku
if (process.env.CREDS) {
  console.log('📝 Creating creds.json from environment variable...');
  fs.writeFileSync('creds.json', process.env.CREDS, 'utf8');
}
