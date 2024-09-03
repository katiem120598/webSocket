const WebSocket = require('ws');

//const serverAddress = 'ws://127.0.0.1:5000'
const serverAddress = 'wss://simplewebsocketserver.glitch.me/'

//const ws = new WebSocket(serverAddress);

const ws = new WebSocket(serverAddress,{
    headers:{
        'user-agent':'Mozilla'
    }
});


ws.on('open',function(){
    ws.send('hey server');
});

ws.on('message',function(msg){
    console.log('received msg from the server: '+msg);
})