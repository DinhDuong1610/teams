const http = require('http');
// const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { handleMessage } = require('./handlers/messageHandler');
const { handleStream } = require('./handlers/streamHandler');

const serverOptions = {
    cert: fs.readFileSync('certs/server.crt'),
    key: fs.readFileSync('certs/server.key'),
};

const server = http.createServer();
// const server = https.createServer(serverOptions);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type) {
                handleMessage(ws, message, wss);
            }
        } catch (error) {
            handleStream(ws, message, wss);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8081, () => {
    console.log('WebSocket server is running on https://localhost:8081');
});
