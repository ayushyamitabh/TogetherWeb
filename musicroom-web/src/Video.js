import React, { Component } from 'react'
import io from 'socket.io-client'
import './Video.css'
import Player from 'react-player'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'

import './video_res/reset.scss'
import './video_res/defaults.scss'
import './video_res/Video.scss'
import './video_res/Range.scss'

import Duration from './video_res/Duration'

const MULTIPLE_SOURCES = [
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' },
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', type: 'video/ogv' },
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', type: 'video/webm' }
]

export default class Video extends Component {
  state = {
    url: 'https://www.youtube.com/watch?v=SkerOgIfpGU',
    playing: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  }

  socket = this.props.socket;

  componentWillMount() {
    this.socket.on('play-pause-video-c', (playing) => {
      this.playPauseByValue(playing);
    })
    this.socket.on('seek-c', (time) => {
      this.seekByValue(time);
    })
  }

  playPauseByValue = (play) => {
    this.setState({ playing: play })
  }   
  
  seekByValue = (time) => {
    this.setState({ played: time })
    this.player.seekTo(time)
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

  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }

  onSeekChange = e => {
    const data = { 
      name: this.props.name,
      room: this.props.room, 
      time: parseFloat(e.target.value),
    }
    this.socket.emit('seek-s', data);
  }

  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    const data = { 
      name: this.props.name,
      room: this.props.room, 
      time: parseFloat(e.target.value),
    }
    this.socket.emit('seek-s', data);
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  stop = () => {
    this.setState({ url: null, playing: false })
  }
  toggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  onProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onEnded = () => {
    console.log('onEnded')
    this.setState({ playing: this.state.loop })
  }
  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }
  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }


  ref = player => {
    this.player = player
  }

  render () {
    const { url, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
    const SEPARATOR = ' · '

    return (
      <div className='app'>
        <section className='section'>
          <div className='player-wrapper'>
            <Player
              ref={this.ref}
              className='react-player'
              
              url={url}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onPlay={this.onPlay}
              onPause={this.onPause}
              // onSeek={e => this.onSeek(e)}
              // onSeek={console.log('Seek')}
              // onError={e => console.log('onError', e)}
              // onReady={() => console.log('onReady')}
              // onStart={() => console.log('onStart')}
              // onBuffer={() => console.log('onBuffer')}
              // onEnded={this.onEnded}
              // onProgress={this.onProgress}
              // onDuration={this.onDuration}
            />
          </div>

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                {/* <button onClick={this.stop}>Stop</button> */}
                {/* <button onClick={this.onClickFullscreen}>Fullscreen</button> */}
                {/* <button onClick={this.setPlaybackRate} value={1}>1</button> */}
                {/* <button onClick={this.setPlaybackRate} value={1.5}>1.5</button> */}
                {/* <button onClick={this.setPlaybackRate} value={2}>2</button> */}
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
              <tr>
                <th>Played</th>
                <td><progress max={1} value={played} /></td>
              </tr>
            {/* <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='muted'>Muted</label>
              </th>
              <td>
                <input id='muted' type='checkbox' checked={muted} onChange={this.toggleMuted} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='loop'>Loop</label>
              </th>
              <td>
                <input id='loop' type='checkbox' checked={loop} onChange={this.toggleLoop} />
              </td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr> */}
          </tbody></table>
        </section>
      </div>
    )
  }
}
   