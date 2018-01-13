import React, { Component } from 'react'
import io from 'socket.io-client'
import './Video.css'
import Player from 'react-player'

const sources = {
  sintelTrailer: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
  bunnyTrailer: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
  bunnyMovie: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  test: 'http://media.w3.org/2010/05/video/movie_300.webm',
};

export default class Video extends Component {
  state = {
    playing: false,
    source: 'https://www.youtube.com/watch?v=YWZWsEM6jug'
  };

  socket = this.props.socket;

  componentWillMount() {
    this.socket.on('play-pause-video-c', (playing) => {
      this.playPause(playing);
    })
  }

  playPause = (play) => {
    this.setState({ playing: play })
  }                               

  onPlay = () => {
    const data = { 
      name: this.props.name,
      room: this.props.room, 
      playing: true,
    }
    this.socket.emit('play-pause-video-s', data);
  }

  onPause = () => {
    const data = { 
      name: this.props.name,
      room: this.props.room, 
      playing: false,
    }
    this.socket.emit('play-pause-video-s', data);
  }

  ref = (player) => {
    this.player = player
  }

  render () {
    return <Player 
      ref={this.ref}
      playing={this.state.playing} 
      url={this.state.source} 
      onPlay={this.onPlay}
      onPause={this.onPause}
    />
  }
}