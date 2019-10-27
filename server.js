'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
let ids = 11;
wss.on('connection', (ws) => {
  ws._ID = ids;
  ids += 1;
  ws.on('message', function incoming(message) {
    wss.clients.forEach((client) => {
      console.log('each client', client._ID);
      if (ws._ID !== client._ID) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => console.log('Client disconnected'));
});
