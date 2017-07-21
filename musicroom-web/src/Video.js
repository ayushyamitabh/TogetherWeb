import React, {Component} from 'react';
import './Video.css';

class Video extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="video-content">
        {this.props.co}
      </div>
    );
  }
}

export default Video;
