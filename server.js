'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// // for dev only
// if (process.env.LOCAL_DEV_SSL) {
//   const https = require('https');
//   const fs = require('fs');
//   server = https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, server)
// }

const wss = new SocketServer({ server });

// TODO Support accounts!
let NEXT_ID = 11;
wss.on('connection', (ws) => {
  ws._ID = NEXT_ID;
  NEXT_ID += 1;
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
