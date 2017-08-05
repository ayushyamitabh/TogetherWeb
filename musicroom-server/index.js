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

io.sockets.on('connection', function(socket){
  console.log('User joined');
  socket.on('disconnect', function(){
    console.log('User left.')
  })
  socket.on('join', function(data){
    console.log(data.name, ' joined ', data.room);
    socket.username = data.name;
    socket.room = data.room;
    socket.join(data.room);
  })
  // CHAT
  socket.on('message', function(data){
    console.log(socket.username, ' says ', data.msg);
    io.sockets.in(data.room).emit('updateChat', data);
  })
  // VIDEO 
  socket.emit('play-pause-video', play);
  socket.emit('update-time', time);
  //to signal play/pause
  socket.on('play-pause-video', function(curPlay) {
    play = curPlay;
    io.sockets.in(socket.room).emit('play-pause-video', curPlay);
  });
  //to signal video time update
  socket.on('update-time', function(curTime) {
    time = curTime;
    io.sockets.in(socket.room).emit('update-time', curTime);
  });
  //to signal video add in the queue 
  socket.on('add-video', function(data) {
    io.sockets.in(socket.room).emit('add-video', data);
  })
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
