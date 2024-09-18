const WebSocket = require('ws');

function handleStream(ws, message, wss) {
    console.log('Received stream data:', message);

    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

module.exports = {
    handleStream,
};
