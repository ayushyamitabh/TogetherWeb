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
      width: new Animated.Value(Dimensions.get('window').width/100 * 80),
      height: new Animated.Value(Dimensions.get('window').height/100 * 80),
      margin: new Animated.Value(Dimensions.get('window').width/100 * 10)
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
      this.state.width,
      {
        toValue: Dimensions.get('window').width,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state.height,
      {
        toValue: Dimensions.get('window').height/100 * 92,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state.margin,
      {
        toValue: 0,
        duration: 250
      }
    ).start();
  }
  closePane() {
    Animated.timing(
      this.state.width,
      {
        toValue: Dimensions.get('window').width/100 * 80,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state.height,
      {
        toValue: Dimensions.get('window').height/100 * 80,
        duration: 250
      }
    ).start();
    Animated.timing(
      this.state.margin,
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
              height: this.state.height,
              width: this.state.width,
              marginTop: this.state.margin,
              marginLeft: this.state.margin,
              marginRight: this.state.margin
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
              height: this.state.height,
              width: this.state.width,
              marginTop: this.state.margin,
              marginLeft: this.state.margin,
              marginRight: this.state.margin
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
              height: this.state.height,
              width: this.state.width,
              marginTop: this.state.margin,
              marginLeft: this.state.margin,
              marginRight: this.state.margin
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
