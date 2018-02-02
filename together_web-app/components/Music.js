import React, { Component } from 'react';
import { Text, View } from 'react-native';
import io from 'socket.io-client';

class Music extends Component{
    constructor(props) {
        super(props);
        this.socket = io(`http://192.168.1.140:8080`);
    }
    componentDidMount() {
        this.socket.on('message', (data) => {
            console.log(data);
        })
    }
    componentWillUnmount(){
        this.socket.disconnect();
    }
    render() {
        return(
            <View>
                <Text>MUSIC PAGE</Text>
            </View>
        );
    }
}

export default Music;