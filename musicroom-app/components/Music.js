import React, { Component } from 'react';
import { Text, View } from 'react-native';
import io from 'socket.io-client';

class Music extends Component{
    constructor(props) {
        super(props);
        this.socket = io(`http://localhost:8080`);
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