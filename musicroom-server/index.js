var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var jsmediatags = require("jsmediatags");
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');

var play = false;
var time = 0;

var rooms = {};

io.sockets.on('connection', function(socket){

  socket.on('join_link', function(data) {
    rooms['420'] = 'video';
    socket.join(data.room);
    console.log('Joined room: ', rooms[data.room]);
    socket.emit('user_joined', rooms[data.room]);
  });

  socket.emit('play-pause-video', false);
  
  socket.on('disconnect', function(){

  });

  socket.on('join', function(data){
     socket.username = data.name;
     socket.room = data.room;
     socket.join(data.room);
  //   if (rooms[data.room]) {
  //     rooms[data.room]['users'].push(data.name);
  //     io.sockets.in(data.room).emit('userJoined', data);
  //     if (data.type === 'music') {
  //       socket.emit('getSongQ',rooms[data.room]['songQ']);
  //     }
  //   } else {
  //     rooms[data.room] = {
  //       users: [data.name]
  //     };
  //     if (data.type === 'music') {
  //       rooms[data.room]['songQ'] = [];
  //     } else if (data.type === 'chat') {
  //       rooms[data.room]['messages'] = [];
  //     }
  //   }
  // })
  // socket.on('leave',function(data) {
  //   io.sockets.in(data.room).emit('userLeft', data);
  //   var index = rooms[data.room]['users'].indexOf(data.name);
  //   if (index > -1) {
  //     rooms[data.room]['users'].splice(index, 1);
  //   }
  //   if (rooms[data.room]['users'].length < 1) {
  //     delete rooms[data.room];
  //     rimraf(`${__dirname}/rooms/${data.room}`, function () {  });
  //   }
  });

  //MUSIC
  socket.on('songAdded', function(song, data){
    var location = `${__dirname}/rooms/${data.room}/music/`;
    mkdirp(location, function(err){
      if (err) console.log(err);
      fs.writeFile(location + `${data.name}`, song, (err)=>{
        if (err) console.log(err);
      })
    })
    jsmediatags.read(song, {
      onSuccess: function(tag) {
        var meta = {
          name: data.name, 
          title: tag.tags.title,
          artist: tag.tags.artist,
          cover: tag.tags.picture
        };
        rooms[data.room]['songQ'].push(meta);
        io.sockets.in(data.room).emit('addToQ', meta);
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      }
    });
  });
  socket.on('syncStream',function(data){
    io.sockets.in(data.room).emit('friendStart', data.index);
  });
  socket.on('playPause', function(data){
    io.sockets.in(data.room).emit('playControl',data.isPlaying);
  });
  socket.on('getStream',function(data){
    var stream = ss.createStream();
    var filename =  `${__dirname}/rooms/${data.room}/music/${data.name}`;
    socket.join(data.room);
    ss(socket).emit('startStream', stream, {name: filename});
    fs.createReadStream(filename).pipe(stream);
  })
  socket.on('seeked', function(data){
    io.sockets.in(data.room).emit('setTime',data.to);
  })
  socket.on('endQ',function(data){
    io.sockets.in(data).emit('reachedEnd', true);
  })
  socket.on('ytAdded', function(data){
    var filename = `${__dirname}/tempFiles/${data.title}.mp4`;
    var location = `${__dirname}/rooms/${data.room}/music/`;
    var song = `${__dirname}/rooms/${data.room}/music/${data.title}.mp3`;
    ytdl(data.url).pipe(fs.createWriteStream(filename)).on('finish',function(){
      mkdirp(location, function(err){
        if (err) console.log(err);
        var process = new ffmpeg({source:filename});
        process.setFfmpegPath(`${__dirname}/Applications/ffmpeg.exe`);
        process.saveToFile(song, function(out, err){
          if (err) console.log(err);
        });
        process.on('end', function(){
          fs.unlink(filename);
          var meta = {
            name: `${data.title}.mp3`, 
            title: data.title,
            artist: data.channel,
            cover: ''
          };
          rooms[data.room]['songQ'].push(meta);
          io.sockets.in(data.room).emit('addToQ', meta);
        });
      })
    });
  })

  // CHAT
  socket.on('message', function(data){
    io.sockets.in(data.room).emit('updateChat', data);
  })
  
  // VIDEO 
  socket.emit('play-pause-video', false);
  socket.emit('update-time', time);
  //to signal play/pause
  socket.on('play-pause-video', function(curPlay) {
    play = curPlay;
    io.emit('play-pause-video', curPlay);
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
  socket.on('video-state', function(state) {
    io.sockets.in(socket.room).emit('video-state', state);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
