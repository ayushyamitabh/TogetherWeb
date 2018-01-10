import React, { Component } from 'react';
import io from 'socket.io-client';
import Video from './Video.js';
import Music from './Music.js';
import Chat from './Chat.js';
import RoomNotFound from './RoomNotFound.js';
import {Redirect} from 'react-router-dom';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.socket = io('http://localhost:8080');
        this.name = 'Temp Name';
        this.room = props.match.params.name;
        this.type = (props.location.state && props.location.state.type) ? props.location.state.type : 'video'; //default type is video
    }

    componentWillMount() {
        this.socket.on('redirect', (room_name) => {
            this.redirect(room_name);
        });
        this.socket.on('user_joined', (room_type) => {
            this.setInitialRoomType(room_type);
        });

        
        this.socket.emit('join_link', {room: this.room, type: this.type});
    }

    componentWillUnmount() {
        //Disconnect socket and delete room if empty 
    }

    setInitialRoomType(room_type) {
        this.type = room_type;
        this.setState({
            type: room_type
        })
    }

    redirect(room) {
        if(room === 'not_found') {
            this.props.history.push('/not_found');
            return;
        }

        this.props.history.push(room);
        window.location.reload();
    }

    render() {
        return(
            <div>
               {this.state.type === 'video' ? <Video socket={this.socket} room={this.room} name={this.name}/> : 
                this.state.type === 'music' ? <Music socket={this.socket} room={this.room} name={this.name}/> :
                this.state.type === 'chat' ? <Chat socket={this.socket} room={this.room} name={this.name}/> :
                <h1></h1>}
            </div>
        )
    }
}

export default Room;