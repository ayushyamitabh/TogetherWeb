import React, {Component} from 'react';
import './Music.css';

class Music extends Component {
  constructor(props) {
    super(props);
    this.state= {
      a: false
    }
  }
  render () {
    return (
      <div className="music-content">
        {this.props.co}
      </div>
    );
  }
}

export default Music;
