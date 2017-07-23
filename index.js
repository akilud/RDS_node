var Twit = require('twit')

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var TwitApi = new Twit({
  consumer_key:         '1hMSzBseJvjC5EPROxcCxIGOD',
  consumer_secret:      'PKS7sEsJJP3U67recLtDq4gnwYWorjV4WzXE1q5jQt5hZdMWsr',
  access_token:         '97910595-UZ8SI3acU0XYdBNoCHqITnylM5REy9PmPkarPAhXJ',
  access_token_secret:  'QFiNQ92NhKhWYGFBkLRAdtxz43BxlXjycEIcAd7bsQ9oE',
  //timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})


//function to keep track of open sockets
function heartbeat() {
  this.isAlive = true;
}

//listen for new connections and messages
wss.on('connection', function connection(ws, req) {

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});



//kill all closed sockets every 30 seconds
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 30000);



//get all tweets with #f1
var stream = TwitApi.stream('statuses/filter', { track: '#f1', language: 'en' })
stream.on('tweet', function (tweet) {
  console.log(tweet)
})




app.use(function (req, res) {
  res.send({ msg: "hello" });
});





server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});