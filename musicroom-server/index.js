var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var jsmediatags = require("jsmediatags");
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

app.get('/', function(req, res){
  res.send('the response');
  if (req) {
    res.send(req.toString());
  }
});

var play = false;
var time = 0;

var rooms = {
  /*
  roomName: {
    users: [],
    messages : [
      {
        msg: '',
        from: ''
      }
    ]
  }
  */
};

io.sockets.on('connection', function(socket){
  console.log('User joined');
  socket.on('disconnect', function(){
    console.log('User left.')
  })
  socket.on('join', function(data){
    // socket.username = data.name;
    // socket.room = data.room;
    socket.join(data.room);
    if (rooms[data.room]) {
      console.log(data.name,'joined room',data.room);
      rooms[data.room]['users'].push(data.name);
      io.sockets.in(data.room).emit('userJoined', data);
    } else {
      console.log(data.name,'created room',data.room);
      rooms[data.room] = {
        users: [data.name],
        messages: []
      };
    }
  })
  socket.on('leave',function(data) {
    io.sockets.in(data.room).emit('userLeft', data);
    var index = rooms[data.room]['users'].indexOf(data.name);
    if (index > -1) {
      rooms[data.room]['users'].splice(index, 1);
    }
    if (rooms[data.room]['users'].length < 1) {
      console.log('Deleted room.');
      delete rooms[data.key];
      rimraf(`${__dirname}/rooms/${data.room}`, function () { console.log('done'); });
    }
  });
  //MUSIC
  socket.on('songAdded', function(song, data){
    var location = `${__dirname}/rooms/${data.room}/music/`;
    mkdirp(location, function(err){
      if (err) console.log(err);
      fs.writeFile(location + `${data.name}`, song, (err)=>{
        if (err) console.log(err);
        console.log('File Saved.');
      })
    })
    jsmediatags.read(song, {
      onSuccess: function(tag) {
        io.sockets.in(data.room).emit('addToQ', tag, data.name);
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      }
    });
  });
  socket.on('getStream',function(data){
    var stream = ss.createStream();
    ss(socket.in(data.room)).emit('startStream', stream);
    var filename =  `${__dirname}/rooms/${data.room}/music/${data.name}`;
    fs.createReadStream(filename).pipe(stream);
  })
  // CHAT
  socket.on('message', function(data){
    console.log(data.name,'says', data.msg);
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
  //to signal video change from the queue
  socket.on('change-src', function() {
    io.sockets.in(socket.room).emit('change-src', {});
  });
  //to signal video add in the queue 
  // socket.on('add-video', function(data) {
  //   io.sockets.in(socket.room).emit('add-video', data);
  // });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
