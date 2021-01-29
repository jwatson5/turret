//const express = require('express');
import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const port = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {

  console.log('received a connection');
  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    //log the received message and send it back to the client
    console.log('received: %s', data);
    //data.serverStr = "You sent this to me";
    //ws.send(JSON.stringify(data));
  });

  //const d = {data: 'Hi there, I am a WebSocket server'};
  //send immediatly a feedback to the incoming connection    
  //ws.send(JSON.stringify(d));
});




server.listen(port, () => {
  console.info('Express server running on port ' + port);
});