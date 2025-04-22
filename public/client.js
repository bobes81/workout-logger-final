window.addEventListener('DOMContentLoaded', () => {
    const term = new Terminal({
      cols: 80,
      rows: 24,
      cursorBlink: true,
    });
  
    term.open(document.getElementById('terminal'));
    term.writeln('Running startup command: python3 run.py\n');
  
    const ws = new WebSocket(
      location.protocol.replace('http', 'ws') + '//' +
      location.hostname +
      (location.port ? ':' + location.port : '')
    );
  
    ws.onopen = () => {
      // Použijeme AttachAddon (správně připojí terminál k WS)
      const attachAddon = new window.AttachAddon.AttachAddon(ws);
      term.loadAddon(attachAddon);
      term.focus();
  
      // ❌ TOTO ZDE ODSTRAŇ — už to řeší AttachAddon
      // term.onData((data) => {
      //   ws.send(data);
      // });
    };
  
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  });