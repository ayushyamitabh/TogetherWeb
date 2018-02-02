import React, { Component } from 'react';
import { Text, TouchableHighlight, TextInput, Button, View } from 'react-native';
import io from 'socket.io-client';
import Dimensions from 'Dimensions';

class Chat extends Component{
    constructor(props) {
        super(props);
        /* ToDo: Replace 192.168.1.140 with your own local IP */
        this.socket = io('http://192.168.56.1:8080');
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
        var data = {
            from: 'test',
            msg: 'test message'
        }
        this.socket.emit('message',data);
        return false;
    }
    render() {
        return(
            <View 
                style={{
                    height: Dimensions.get('window').height / 100 * 92,
                    justifyContent: 'flex-end',
                    backgroundColor: 'white'
                }}
            >
                <TextInput
                    style={{
                        width: Dimensions.get('window').width
                    }}
                    placeholder="Start typing..."
                />
                <TouchableHighlight
                    style={{
                        backgroundColor: "#b0e0e6",
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height/100 * 7,
                        justifyContent: 'center'
                    }}
                    activeOpacity={1}
                    underlayColor="rgba(146,194,200,0.8)"
                    onPress={this.sendMessage}
                >
                    <Text
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        Send Message
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

export default Chat;