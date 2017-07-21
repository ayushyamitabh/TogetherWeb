import React, {Component} from 'react';
import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="chat-content">
        {this.props.co}
      </div>
    );
  }
}

export default Chat;
