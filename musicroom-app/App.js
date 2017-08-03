import React, {Component} from 'react';
import { Animated, Button, StyleSheet, Text, View, ScrollView, StatusBar, TouchableHighlight } from 'react-native';
import Header from './components/Header.js';
import PaneContent from './components/PaneContent.js';
import Dimensions from 'Dimensions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      title: 'MUSICROOM',
      textmt: new Animated.Value(Dimensions.get('window').height/100 * 35),

      chatwidth: new Animated.Value(Dimensions.get('window').width/100 * 80),
      chatheight: new Animated.Value(Dimensions.get('window').height/100 * 80),
      chatmargin: new Animated.Value(Dimensions.get('window').width/100 * 10),

      videowidth: new Animated.Value(Dimensions.get('window').width/100 * 80),
      videoheight: new Animated.Value(Dimensions.get('window').height/100 * 80),
      videomargin: new Animated.Value(Dimensions.get('window').width/100 * 10),

      musicwidth: new Animated.Value(Dimensions.get('window').width/100 * 80),
      musicheight: new Animated.Value(Dimensions.get('window').height/100 * 80),
      musicmargin: new Animated.Value(Dimensions.get('window').width/100 * 10)
    }
    this.openPane = this.openPane.bind(this);
    this.closePane = this.closePane.bind(this);
  }
  openPane(paneName) {
    this.setState({
      title: paneName.toString().toUpperCase(),
      [paneName]: true
    })
    Animated.timing(
      this.state[`${paneName}width`],
      {
        toValue: Dimensions.get('window').width,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state[`${paneName}height`],
      {
        toValue: Dimensions.get('window').height/100 * 92,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state[`${paneName}margin`],
      {
        toValue: 0,
        duration: 250
      }
    ).start();
  }
  closePane() {
    var pane = '';
    if (this.state.music) {
      pane = 'music';
    } else if (this.state.video) {
      pane = 'video';
    } else if (this.state.chat) {
      pane = 'chat';
    }
    Animated.timing(
      this.state[`${pane}width`],
      {
        toValue: Dimensions.get('window').width/100 * 80,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state[`${pane}height`],
      {
        toValue: Dimensions.get('window').height/100 * 80,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state[`${pane}margin`],
      {
        toValue: Dimensions.get('window').width/100 * 10,
        duration: 250
      }
    ).start();
    this.setState({
      title:"MUSICROOM",
      music: false,
      chat: false,
      video: false
    })
  }
  render() {
    return (
      <View>
        <StatusBar animated={true} hidden={true} />
        <Header
          title={this.state.title}
          backHandler={this.closePane}
          canGoBack={this.state.music || this.state.video || this.state.chat ? true : false} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          scrollEnabled={this.state.music || this.state.video || this.state.chat ? false : true}
          contentContainerStyle={styles.panes}
          horizontal={true}
          pagingEnabled={true}>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={()=>{this.openPane('music')}}>
            <Animated.View style={{
              backgroundColor: 'rgba(100,100,150,1)',
              height: this.state.musicheight,
              width: this.state.musicwidth,
              marginTop: this.state.musicmargin,
              marginLeft: this.state.musicmargin,
              marginRight: this.state.musicmargin
            }}>
              {
                this.state.music === true ? 
                <PaneContent type="music" /> :
                <Animated.Text style={{
                  textAlign: 'center',
                  color: 'white',
                  marginTop: this.state.textmt
                }}>
                  MUSIC
                </Animated.Text>
              }
            </Animated.View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={()=>{this.openPane('video')}}>
            <Animated.View style={{
              backgroundColor: 'rgba(100,150,100,1)',
              height: this.state.videoheight,
              width: this.state.videowidth,
              marginTop: this.state.videomargin,
              marginLeft: this.state.videomargin,
              marginRight: this.state.videomargin
            }}>
              {
                this.state.video === true ? 
                <PaneContent type="video" /> :
                <Animated.Text style={{
                  textAlign: 'center',
                  color: 'white',
                  marginTop: this.state.textmt
                }}>
                  VIDEO
                </Animated.Text>
              }
            </Animated.View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={()=>{this.openPane('chat')}}>
            <Animated.View style={{
              backgroundColor: 'rgba(150,100,100,1)',
              height: this.state.chatheight,
              width: this.state.chatwidth,
              marginTop: this.state.chatmargin,
              marginLeft: this.state.chatmargin,
              marginRight: this.state.chatmargin
            }}>
              {
                this.state.chat === true ? 
                <PaneContent type="chat" /> :
                <Animated.Text style={{
                  textAlign: 'center',
                  color: 'white',
                  marginTop: this.state.textmt
                }}>
                  CHAT
                </Animated.Text>
              }
            </Animated.View>
          </TouchableHighlight>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(230,230,230,0.2)',
    flexDirection: 'row'
  },
  header: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center'
  },
  panes: {
    flexDirection: 'row'
  },
  closebutton: {
    flex: 2,
    alignItems: 'center',
    position: 'relative',
    marginTop: 180
  }
})

export default App;
