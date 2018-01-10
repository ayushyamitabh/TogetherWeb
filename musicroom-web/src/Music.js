import React, {Component} from 'react';
import {Avatar,
        Card, 
        CardContent,
        Drawer, 
        IconButton, 
        List,
        ListItem,
        ListItemText,
        Snackbar, 
        TextField,
        Typography} from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import './Music.css';
import io from 'socket.io-client';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import SearchIcon from 'material-ui-icons/Search';
import ss from 'socket.io-stream';
import Chat from './Chat.js';
import * as youtubeSearch from 'youtube-search';

class Music extends Component {
  constructor(props) {
    super(props);
    this.state= {
      notification:false,
      notificationMessage:'',
      // MUSIC CONTROLS
      title: '',
      artist: '',
      cover: null,
      duration: 1,
      playing: false,
      progress: 0,
      queue:[],
      index: 0,
      searchDialog: false,
      results: []
    };
    this.socket = this.props.socket;
    this.seek = this.seek.bind(this);
    this.changeSong = this.changeSong.bind(this);
    this.playPause = this.playPause.bind(this);
    this.goBack = this.goBack.bind(this);
    this.addSong = this.addSong.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }
  componentDidMount() {
    // this.socket.emit('join', {name: this.props.name, room: this.props.room, type: 'music'});
    // this.socket.on('userJoined',(data)=>{
    //   if (data.name !== this.props.name) {
    //     this.setState({
    //       notification:true,
    //       notificationMessage:`${data.name} joined.`
    //     })
    //   }
    // });
    // this.socket.on('userLeft',(data)=>{
    //   this.setState({
    //     notification:true,
    //     notificationMessage:`${data.name} left.`
    //   })
    // });
    this.socket.on('getSongQ', (data)=>{
      var songQ = [];
      data.map((song, index)=>{
        var image = '';
        var base64String = '';
        var base64='';
        if (song.cover) {
          image = song.cover;
          for (var i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
          }
          base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
        }
        song.cover = base64;
        songQ.push(song);
      })
      this.setState({
        queue: songQ
      })
    });
    this.socket.on('addToQ', (meta, data)=>{
      var image = '';
      var base64String = '';
      var base64='';
      if (meta.cover) {
        image = meta.cover;
        for (var i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
        }
        base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
      }
      var curr = this.state.queue;
      curr.push({
        name: meta.name,
        title: meta.title,
        artist: meta.artist,
        cover: base64
      });
      this.setState({
        queue: curr
      })
    });
    ss(this.socket).on('startStream', (stream, data)=>{
      var parts= [];
      stream.on('data', (chunk)=>{
        parts.push(chunk);
      })
      stream.on('end', ()=>{
        document.getElementById('player').src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
        document.getElementById('player').load();
        this.setState({
          duration: document.getElementById('player').duration
        })
        document.getElementById('player').play();
      })
    })
    this.socket.on('friendStart',(index)=>{
      this.changeSong(index);
    })
    this.socket.on('playControl',(isPlaying)=>{
      var player= document.getElementById('player');
      if (isPlaying === true) {
        player.pause();
        this.setState({
          playing: player.paused
        })
      } else if (isPlaying === false) {
        player.play();
        this.setState({
          playing: player.paused
        })
      }
    })
    this.socket.on('setTime',(time)=>{
      var player = document.getElementById('player');
      player.currentTime = time;
      this.setState({
        notification: true,
        notificationMessage: 'Synced time to room...'
      })
    })
    this.socket.on('reachedEnd',(data)=>{
      this.setState({
        notification: true,
        notificationMessage: 'That was the last song, start from the top or add a song.'
      })
    })
  }
  componentWillUnmount() {
    // this.socket.emit('leave', {name: this.props.name, room: this.props.room});
    // this.socket.disconnect();
  }
  addSong(e){
    var file = e.target.files[0];
    this.socket.emit('songAdded', file, {room:this.props.room,name:file.name});
  }
  // MUSIC PLAYER CONTROLS
  sendSync(index) {
    this.socket.emit('syncStream',{
      room: this.props.room,
      index: index
    });
  }
  changeSong(index) {
    this.setState({
      currentIndex: index
    })
    var player = document.getElementById('player');
    var song = this.state.queue[index];
    this.socket.emit('getStream',{name:song.name,room:this.props.room,index:index});
    player.currentTime = 0;
    document.getElementById('cover-art').src = song.cover;
    this.setState({
      progress: player.currentTime,
      duration: player.duration,
      title: song.title,
      artist: song.artist
    })
  }
  playPause() {
    var player = document.getElementById('player');
    this.socket.emit('playPause', {
      isPlaying:!player.paused,
      room: this.props.room
    });
  }
  goBack() {
    var player = document.getElementById('player');
    if (player.currentTime < 0.7) {
      const prevIndex = this.state.currentIndex - 1;
      if (prevIndex < 0) {
        this.setState({
          notification: true,
          notificationMessage: 'Reached start of playist.'
        })
      } else {
        this.sendSync(prevIndex);
      }
    } else {
      this.socket.emit('seeked', {
        to: 0,
        room: this.props.room
      })
    }
  }
  seek () {
    var player = document.getElementById('player');
    if (this.state.seeking === false) {
    } else if (this.state.seeking === true) {
      this.socket.emit('seeked', {
        to: player.currentTime,
        room: this.props.room
      })
      this.setState({
        notification: true,
        notificationMessage: 'Syncing others...please wait.'
      })
    }
  }
  nextSong () {
    const nextIndex = this.state.currentIndex + 1;
    if (nextIndex < this.state.queue.length) {
      this.sendSync(nextIndex);
    } else {
      this.socket.emit('endQ',this.props.room);
    }
  }
  handleChange (event, index) {
    this.setState({ index });
  }
  search (e) {
    if (e.target.value !== '') {
      youtubeSearch(e.target.value, 
      youtubeSearch.YouTubeSearchOptions = {
        maxResults: 15,
        key: 'AIzaSyADFAaSJJm7h2kIj0SPzPH8TLNmfndPx04'
      }, 
      (err, results) => {
        if(err) return console.log(err);
        this.setState({
          results: results
        })
      });
    } else {
      this.setState({
        results:[]
      })
    }
  }
  addYT(data) {
    this.socket.emit('ytAdded',{
      room: this.props.room,
      url: data.link,
      title: data.title,
      channel: data.channelTitle
    });
    this.setState({
      searchDialog: false,
      results: [],
      notification: true,
      notificationMessage: 'Adding YouTube sources may take a while...'
    });
  }
  render () {
    return (
      <div className="music-page">
        <Drawer
          className="search-dialog"
          anchor="bottom"
          open={this.state.searchDialog}
          onRequestClose={()=>{this.setState({searchDialog:false,results:[]})}}
        >
          <div className="search-dialog-content">
            <TextField
              className="ytsearch"
              label="Search"
              fullWidth
              margin="normal"
              onChange={this.search}
            />
            <h4>Results</h4>
            <List>
              {
                this.state.results.map((data, index)=>{
                  if (data.kind === "youtube#video") {
                    return (
                      <ListItem key={index} button onClick={()=>{this.addYT(data)}}>
                        <img alt={data.title} src={data.thumbnails.default.url} />
                        <ListItemText primary={data.title} secondary={data.channelTitle} />
                      </ListItem>
                    );
                  }
                })
              }
            </List>
          </div>
        </Drawer>
        <div className="music-content">
          <Snackbar 
            anchorOrigin={{vertical:'bottom',horizontal:'left'}}
            open={this.state.notification}
            onRequestClose={()=>{this.setState({notification:false})}}
            transition={<Slide direction='right' />}
            autoHideDuration={4000}
            message={<div>{this.state.notificationMessage}</div>}
          />
          <Card className="now-playing-card">
            <div className="details">
              <CardContent className="content">
                <Typography type="headline">
                  {this.state.title}
                </Typography>
                <Typography type="subheading" color="secondary">
                  {this.state.artist}
                </Typography>
              </CardContent>
              <div className="seek">
                <audio 
                  controls 
                  id="player" 
                  preload="none" 
                  onTimeUpdate={this.timeupdate}
                  onInput={this.seek}
                  onVolumeChange={()=>{this.setState({seeking:false})}}
                  onSeeking={()=>{this.setState({seeking:true})}}
                  onEnded={this.nextSong}
                >
                  <source src={null} type="audio/mp3" />
                </audio> 
              </div>
              <div className="controls">
                <IconButton aria-label="Previous" onClick={this.goBack}>
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton aria-label="Play/pause" onClick={this.playPause}>
                {
                  this.state.playing === true ? 
                  <PlayArrowIcon className="play-icon" /> :
                  <PauseIcon className="play-icon" />
                }
                </IconButton>
                <IconButton aria-label="Next" onClick={this.nextSong}>
                  <SkipNextIcon />
                </IconButton>
              </div>
            </div>
            <div className="cover">
              <img alt='' id="cover-art" src={this.state.cover} />
            </div>
          </Card>
        </div>
        <h4>HOLD AND DRAG TIME SLIDER TO SYNC WITH OTHERS</h4>
        <List className="music-queue">
          {
            this.state.queue.map((data, index) => {
              return (
                <ListItem key={index} button onClick={()=>{this.sendSync(index)}}>
                  <Avatar>
                    <PlayArrowIcon />
                  </Avatar>
                  <ListItemText primary={data.title} secondary={data.artist}/>
                </ListItem>
              );
            })
          }
          <ListItem button onClick={()=>{document.getElementById('file').click();}} >
            <Avatar>
              <FileUploadIcon />
            </Avatar>
            <ListItemText primary="Add A Song" secondary="Pick one from your collection" />
          </ListItem>
          <ListItem button onClick={()=>{this.setState({searchDialog:true})}} >
            <Avatar>
              <SearchIcon />
            </Avatar>
            <ListItemText primary="Add A Song" secondary="Search YouTube For A Song" />
          </ListItem>
        </List>
        <input 
          multiple 
          type="file" 
          id="file" 
          style={{display:'none'}} 
          onChange={this.addSong}
          accept="audio/mp3"
        />
        {/* <div id="nested-chat" className="nested-chat">
          <Chat room={this.props.room} name={this.props.name} />
        </div> */}
      </div>
    );
  }
}

export default Music;
