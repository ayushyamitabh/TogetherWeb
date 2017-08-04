import React, {Component} from 'react';
import io from 'socket.io-client';
import {Avatar, Button, Chip, TextField} from 'material-ui';
import SendIcon from 'material-ui-icons/Send';
import $ from 'jquery';
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
    $('.message input').focusin(()=>{
      $('.send-btn').css('transform','rotate(-90deg)');
    });
    $('.message input').focusout(()=>{
      $('.send-btn').css('transform','rotate(0deg)');
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
        <div className="message-display">

          <div className="message-chip-left">
            <Avatar className="user-avatar">{this.props.name.toUpperCase().charAt(0)}</Avatar>
            <Chip label="Basic Chip" className="user-chip" />
          </div>
          <div className="message-chip-right">
            <Chip label="Basic Chip" className="user-chip" />
            <Avatar className="user-avatar">{this.props.name.toUpperCase().charAt(0)}</Avatar>
          </div>
        </div>
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
            <SendIcon />
          </Button>
        </form>
      </div>
    );
  }
}

export default Chat;
