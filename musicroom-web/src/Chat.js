import React, {Component} from 'react';
import io from 'socket.io-client';
import {Button, TextField} from 'material-ui';
import './Chat.css';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: ''
    }
    this.socket = io(`http://localhost:8080`);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    this.socket.emit('join', {name: this.props.name, room: this.props.room});
    this.socket.on('updateChat', (data) => {
      console.log(data);
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  sendMessage(e) {
    e.preventDefault();
    if (this.state.newMessage === ''){
      return false;
    }
    var message = {
      from: this.props.name,
      msg: this.state.newMessage,
      room: this.props.room
    };
    this.socket.emit('message', message);
    this.setState({
      newMessage: ''
    })
    return false;
  }
  render () {
    return (
      <div className="chat-content">
        <form className="message-area" onSubmit={this.sendMessage}>
          <TextField
            required
            id="new-message"
            className="message"
            label="Message"
            margin="normal"
            value={this.state.newMessage}
            onChange={event => {this.setState({newMessage:event.target.value})}}
            InputProps={{ placeholder: 'Start typing...' }}
          />
          <Button 
            className="send-btn"
            color="primary" 
            type="submit"
          >
            SEND MESSAGE
          </Button>
        </form>
      </div>
    );
  }
}

export default Chat;
