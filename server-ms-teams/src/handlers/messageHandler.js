const WebSocket = require('ws');

function handleMessage(ws, message, wss) {
    const parsedMessage = JSON.parse(message);
    console.log('Received message:', parsedMessage); 

    switch (parsedMessage.type) {
        case 'subscribe':
            handleSubscribe(ws, parsedMessage, wss);
            break;
        case 'sendMessage':
            handleSendMessage(ws, parsedMessage, wss);
            break;
        case 'videoCallRequest':
            handleVideoCallRequest(ws, parsedMessage, wss);
            break;
        case 'videoCallResponse':
            handleVideoCallResponse(ws, parsedMessage, wss);
            break;
        default:
            console.log('Unknown message type:', parsedMessage.type);
            break;
    }
}

function handleSubscribe(ws, parsedMessage, wss) {
    console.log('Subscribe:', parsedMessage);
    ws.user_from_chat = parsedMessage.user_from_chat;
}


function handleSendMessage(ws, parsedMessage, wss) {
    console.log('Received message to send:', parsedMessage);
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if ( client.user_from_chat === parsedMessage.user_to || client.user_from_chat === parsedMessage.user_from) {
                client.send(JSON.stringify(parsedMessage));
            }
        }
    });
}

function handleVideoCallRequest(ws, parsedMessage, wss) {
    console.log('Video call request:', parsedMessage);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (client.user_from_chat === parsedMessage.user_to) {
                client.send(JSON.stringify(parsedMessage));
            }
        }
    });
}

function handleVideoCallResponse(ws, parsedMessage, wss) {
    console.log('Video call response:', parsedMessage);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (client.user_from_chat === parsedMessage.user_to) {
                client.send(JSON.stringify(parsedMessage));
            }
        }
    });
}

module.exports = {
    handleMessage,
};
