import React, {Component} from 'react';
import io from 'socket.io-client';
import {Button, TextField} from 'material-ui';
import './Chat.css';

let socket = io(`http://localhost:8080`);

class Chat extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    socket.on('message', (data) => {
      console.log(data);
    });
  }
  sendMessage() {
    socket.emit('message','test message');
    return false;
  }
  render () {
    return (
      <div className="chat-content">
        {this.props.co}
        <Button color="primary" onClick={this.sendMessage}>
          SEND MESSAGE
        </Button>
      </div>
    );
  }
}

export default Chat;
