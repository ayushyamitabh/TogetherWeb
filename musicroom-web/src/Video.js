import React, { Component } from 'react';
import io from 'socket.io-client';
import './Video.css';

const sources = {
  sintelTrailer: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
  bunnyTrailer: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
  bunnyMovie: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  test: 'http://media.w3.org/2010/05/video/movie_300.webm',
};

class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: sources['bunnyMovie'],
    };

    this.socket = this.props.socket;
  }
  componentDidMount() {
    
  }

  componentWillUnmount() {
  
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default Video;
