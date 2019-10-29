'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

let server = express()
  .use((req, res) => res.sendFile(INDEX) );

// for dev only
if (process.env.LOCAL_DEV_SSL) {
  const https = require('https');
  const fs = require('fs');
  server = https.createServer({
    key: fs.readFileSync('__server.key'),
    cert: fs.readFileSync('__server.cert')
  }, server)
}

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// TODO Support accounts!
let ids = 11;

const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
  ws._ID = ids;
  ids += 1;
  console.log('new client connected', ws._ID);
  ws.on('message', function incoming(message) {
    wss.clients.forEach((client) => {
      if (ws._ID !== client._ID) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => console.log('Client disconnected'));
});
