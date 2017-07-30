import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import io from 'socket.io-client';
import Dimensions from 'Dimensions';

class Chat extends Component{
    constructor(props) {
        super(props);
        /* ToDo: Replace 192.168.1.140 with your own local IP */
        this.socket = io('http://192.168.1.140:8080');
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidMount() {
        this.socket.on('message', (data) => {
            console.log(data);
        })
    }
    componentWillUnmount(){
        this.socket.disconnect();
    }
    sendMessage() {
        this.socket.emit('message','test message');
        return false;
    }
    render() {
        return(
            <View>
                
            </View>
        );
    }
}

export default Chat;