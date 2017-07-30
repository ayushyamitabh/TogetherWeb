import React, {Component} from 'react';
import io from 'socket.io-client';
import {Button, TextField} from 'material-ui';
import './Chat.css';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.socket = io(`http://localhost:8080`);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    this.socket.on('message', (data) => {
      console.log(data);
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  sendMessage() {
    this.socket.emit('message','tes message');
    return false;
  }
  render () {
    return (
      <div className="chat-content">
        <TextField fullWidth={true} floatingLabelText={true} />
        <Button fullWidth={true} color="primary" onClick={this.sendMessage}>
          SEND MESSAGE
        </Button>
      </div>
    );
  }
}

export default Chat;
