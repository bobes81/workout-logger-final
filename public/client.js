document.addEventListener('DOMContentLoaded', () => {
    const term = new window.Terminal({ cols: 80, rows: 24, cursorBlink: true });
    term.open(document.getElementById('terminal'));
    term.writeln('Running startup command: python3 run.py\n');
  
    const ws = new WebSocket(
      location.protocol.replace('http', 'ws') +
      '//' + location.hostname +
      (location.port ? ':' + location.port : '') + '/'
    );
  
    ws.onopen = () => {
      const attach = new window.AttachAddon(ws);
      term.loadAddon(attach);
      term.focus();
    };
  
    ws.onerror = (err) => console.error('WebSocket error:', err);
  });
  