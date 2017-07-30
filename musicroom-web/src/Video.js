import React, { Component } from 'react';
import io from 'socket.io-client';
import MediaElement from './MediaElement.js';
import './Video.css';

let socket = io(`http://localhost:8080`);
let timeBar;
let playerInstance;
let playerElement;

class Video extends Component {

  componentDidMount() {
    const { MediaElementPlayer } = global;
    playerInstance = new MediaElementPlayer('player_html5');
    playerElement = document.getElementById('player');
    timeBar = document.getElementsByClassName('mejs__time-slider')[0];

    playerElement.addEventListener('pause', function () {
      socket.emit('play-pause-video', false);
    });
    playerElement.addEventListener('playing', function () {
      socket.emit('play-pause-video', true);
    });
    timeBar.addEventListener('click', function () {
      socket.emit('update-time', playerInstance.getCurrentTime());
    });

    socket.on('play-pause-video', function (curPlay) {
      if (curPlay) playerInstance.play();
      else playerInstance.pause();
    });
    socket.on('update-time', function (curTime) {
      playerInstance.setCurrentTime(curTime);
    });
  }

  render() {
    const
      sources = [
        { src: 'http://www.streambox.fr/playlists/test_001/stream.m3u8', type: 'application/x-mpegURL' },
        { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' },
        { src: 'rtmp://firehose.cul.columbia.edu:1935/vod/mp4:sample.mp4', type: 'video/rtmp' }
      ],
      config = {},
      tracks = {}
      ;

    return (
      <div className="video-content">
        <MediaElement
          id="player"
          ref={elem => this.mediaelement = elem}
          mediaType="video"
          preload="none"
          controls
          width="640"
          height="360"
          poster=""
          sources={JSON.stringify(sources)}
          options={JSON.stringify(config)}
          tracks={JSON.stringify(tracks)}
        />
      </div>
    );
  }
}

export default Video;
