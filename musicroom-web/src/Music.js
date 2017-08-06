import React, {Component} from 'react';
import {Avatar,
        Card, 
        CardContent, 
        IconButton, 
        LinearProgress,
        List,
        ListItem,
        ListItemText,
        Snackbar, 
        Typography} from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import './Music.css';
import logo from './logo.svg';
import io from 'socket.io-client';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import MediaElement from './MediaElement.js';
import song from './res/song.mp3';
import next from './res/song2.mp3';
import $ from 'jquery';

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
      queue:[]
    }
    this.socket = io(`http://localhost:8080`);
    this.seek = this.seek.bind(this);
    this.timeupdate = this.timeupdate.bind(this);
    this.changeSong = this.changeSong.bind(this);
    this.playPause = this.playPause.bind(this);
    this.goBack = this.goBack.bind(this);
    this.addSong = this.addSong.bind(this);
  }
  componentDidMount() {
    this.socket.emit('join', {name: this.props.name, room: this.props.room});
    this.socket.on('userJoined',(data)=>{
      if (data.name !== this.props.name) {
        this.setState({
          notification:true,
          notificationMessage:`${data.name} joined.`
        })
      }
    });
    this.socket.on('userLeft',(data)=>{
      this.setState({
        notification:true,
        notificationMessage:`${data.name} left.`
      })
    });
    this.socket.on('addToQ', (meta, song)=>{
      var image = '';
      var base64String = '';
      var base64='';
      if (song) {
        if (meta.tags.picture) {
          image = meta.tags.picture;
          for (var i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
          }
          base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
          var curr = this.state.queue;
          curr.push({
            song: song,
            title: meta.tags.title,
            artist: meta.tags.artist,
            cover: base64
          });
          this.setState({
            queue: curr
          })
        } else {
          var curr = this.state.queue;
          curr.push({
            song: song,
            title: meta.tags.title,
            artist: meta.tags.artist,
            cover: base64
          });
          this.setState({
            queue: curr
          })
        }
      }
    });
  }
  componentWillUnmount() {
    this.socket.emit('leave', {name: this.props.name, room: this.props.room});
    this.socket.disconnect();
  }
  timeupdate() {
    var cT = document.getElementById('player').currentTime;
    var dT = document.getElementById('player').duration;
    var pT = (cT / dT) * 100;
    this.setState({
      progress: pT
    })
  }
  addSong(e){
    var file = e.target.files[0];
    this.socket.emit('songAdded', file, this.props.room);
    var reader = new FileReader();
    if (e.target.files && file) {
      var reader = new FileReader();
      reader.onload = (e)=>{
        this.socket.emit('songAdded', file, this.props.room, e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }
  // MUSIC PLAYER CONTROLS
  changeSong(index) {
    var player = document.getElementById('player');
    var song = this.state.queue[index];
    player.src = song.song;
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
    if (player.src === '') {
      this.setState({
        notification: true,
        notificationMessage: 'There\'s no song in your playlist.'
      })
      return false;
    }
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
    this.setState({
      playing: !this.state.playing
    })
  }
  goBack() {
    var player = document.getElementById('player');
    player.currentTime = 0;
    this.setState({
      progress: player.currentTime
    })
  }
  seek(e) {
    var player = document.getElementById('player');
    player.currentTime = e.target.value;
    this.setState({
      progress: player.currentTime
    })
  }
  render () {
    return (
      <div>
      <div className="music-content">
        <Snackbar 
          anchorOrigin={{vertical:'bottom',horizontal:'left'}}
          open={this.state.notification}
          onRequestClose={()=>{this.setState({notification:false})}}
          transition={<Slide direction='right' />}
          autoHideDuration={900}
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
              <input 
                type="range" 
                max={this.state.duration} 
                value={this.state.progress} 
                step={0.1}
                onChange={this.seek}
              />
            </div>
            <div className="controls">
              <IconButton aria-label="Previous" onClick={this.goBack}>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label="Play/pause" onClick={this.playPause}>
              {
                this.state.playing === false ? 
                <PlayArrowIcon className="play-icon" /> :
                <PauseIcon className="play-icon" />
              }
              </IconButton>
              <IconButton aria-label="Next">
                <SkipNextIcon />
              </IconButton>
            </div>
          </div>
          <div className="cover">
            <img id="cover-art" src={this.state.cover} />
          </div>
        </Card>
      </div>
      <List className="add-song">
      <List className="music-queue">
        {
          this.state.queue.map((data, index) => {
            return (
              <ListItem key={index} button onClick={()=>{this.changeSong(index)}}>
                <Avatar>
                  <PlayArrowIcon />
                </Avatar>
                <ListItemText primary={data.title} secondary={data.artist}/>
              </ListItem>
            );
          })
        }
      </List>
        <ListItem button onClick={()=>{document.getElementById('file').click();}} >
          <Avatar>
            <FileUploadIcon />
          </Avatar>
          <ListItemText primary="Add A Song" secondary="Pick one from your collection" />
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
      <audio id="player" preload="none" onTimeUpdate={this.timeupdate}>
        <source src={null} type="audio/mp3" />
      </audio> 
      </div>
    );
  }
}

export default Music;
