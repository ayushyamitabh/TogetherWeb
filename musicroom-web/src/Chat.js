import React, {Component} from 'react';
import io from 'socket.io-client';
import {Avatar, Button, Chip, Snackbar, TextField} from 'material-ui';
import Slide from 'material-ui/transitions/Slide';
import SendIcon from 'material-ui-icons/Send';
import $ from 'jquery';
import './Chat.css';


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
      messages: [],
      notification:false
    }
    this.socket = io(`http://localhost:8080`);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    this.socket.emit('join', {name: this.props.name, room: this.props.room});
    this.socket.on('updateChat', (data) => {
      var oldlist = this.state.messages;
      oldlist.push(data);
      this.setState({
        messages: oldlist
      })
    });
    this.socket.on('userJoined',(data)=>{
      if (data.name !== this.props.name) {
        this.setState({
          notification:true,
          notificationMessage:`${data.name} joined.`
        })
      }
    });
    this.socket.on('userLeft',(data)=>{
      this.setState({
        notification:true,
        notificationMessage:`${data.name} left.`
      })
    });
    $('.message input').focusin(()=>{
      $('.send-btn').css('transform','rotate(-90deg)');
    });
    $('.message input').focusout(()=>{
      $('.send-btn').css('transform','rotate(0deg)');
    });
  }
  componentWillUnmount() {
    this.socket.emit('leave', {name: this.props.name, room: this.props.room});
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
        <Snackbar 
          anchorOrigin={{vertical:'bottom',horizontal:'left'}}
          open={this.state.notification}
          onRequestClose={()=>{this.setState({notification:false})}}
          transition={<Slide direction='right' />}
          autoHideDuration={900}
          message={<div>{this.state.notificationMessage}</div>}
        />
        <div className="message-display">
          {
            this.state.messages.map((data,key)=>{
              if (data.from === this.props.name) {
                return (
                  <div key={key} className="message-chip-right">
                    <Chip label={data.msg} className="user-chip" />
                    <Avatar className="user-avatar">{data.from.toUpperCase().charAt(0)}</Avatar>
                  </div>
                );
              } else {
                return (
                  <div key={key} className="message-chip-left">
                    <Avatar className="user-avatar">{data.from.toUpperCase().charAt(0)}</Avatar>
                    <Chip label={data.msg} className="user-chip" />
                  </div>
                );
              }
            })
          }

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
