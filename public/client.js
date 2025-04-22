window.addEventListener('DOMContentLoaded', () => {
    var term = new Terminal({
        cols: 80,
        rows: 24,
        cursorBlink: true,
    });

    term.open(document.getElementById('terminal'));
    term.writeln('Running startup command: python3 run.py\n');

    var ws = new WebSocket(
        location.protocol.replace('http', 'ws') + '//' +
        location.hostname +
        (location.port ? ':' + location.port : '') + '/'
    );

    ws.onopen = function () {
        new attach.attach(term, ws); // ✅ použije starý attach.js
    };

    ws.onerror = function (e) {
        console.error('WebSocket error:', e);
    };

    // Focus do terminálu
    document.getElementsByClassName("xterm-helper-textarea")[0].focus();
});
