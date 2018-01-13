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

var rooms = {};

io.sockets.on('connection', function(socket){

  socket.on('join_link', function(data) {
    var type = data.type;

    //create new room
    if(data.room === 'new') {
      var room = randomName();
      rooms[room] = type;
      socket.emit('redirect', room)
      return;
    } 

    //otherwise join  (if room not created -> error)
    var room = data.room;
    if(!rooms.hasOwnProperty(room)) {
      socket.emit('redirect', 'not_found')
      return;
    }

    socket.join(room);
    socket.emit('user_joined', rooms[room]);
  });
  
  socket.on('disconnect', function(){

  });

  //VIDEO
  socket.on('play-pause-video-s', function(data) {
    var name = data.name;
    var room = data.room;
    var playing = data.playing;
    io.in(room).emit('play-pause-video-c', playing);
  });

  socket.on('seek-s', function(data) {
    var name = data.name;
    var room = data.room;
    var time = data.time;
    io.in(room).emit('seek-c', time);
  })

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
  

});

function randomName() {
  var random = 'new';
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while(rooms.hasOwnProperty(random) || random === 'new' || random === 'not_found') {
    random = "";
    for (var i = 0; i < 6; i++) {
      random += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }

  return random;
}

http.listen(8080, function(){
  console.log('listening on *:8080');
});
