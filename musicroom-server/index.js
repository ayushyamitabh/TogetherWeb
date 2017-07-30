var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('the response');
  if (req) {
    res.send(req.toString());
  }
});

var play = false;
var time = 0;
io.on('connection', function(socket) {
  console.log('user connected');
  socket.emit('play-pause-video', play);
  socket.emit('update-time', time);

  socket.on('play-pause-video', function(curPlay) {
    play = curPlay;
    io.emit('play-pause-video', curPlay);
  });

  socket.on('update-time', function(curTime) {
    time = curTime;
    io.emit('update-time', curTime);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
