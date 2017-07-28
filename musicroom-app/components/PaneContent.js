import React, {Component} from 'react';
import { Text, View } from 'react-native';
import Music from './Music.js';
import Video from './Video.js';
import Chat from './Chat.js';

class PaneContent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <View style={{
                justifyContent: 'center'
            }} >
                {
                    this.props.type === 'music' ?
                    <Music />:
                    this.props.type === 'video' ?
                    <Video />:
                    this.props.type === 'chat' ?
                    <Chat />:
                    <Text style={{
                        color: 'white',
                        textAlign: 'center'
                    }} >
                        This is embarasing, but looks like something went wrong.
                    </Text>
                }
            </View>
        );
    }
}

export default PaneContent;