import React, {Component} from 'react';
import { Animated, Button, StyleSheet, Text, View, ScrollView, StatusBar, TouchableHighlight } from 'react-native';
import Header from './components/Header.js';
import Dimensions from 'Dimensions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      title: 'MUSICROOM',
      // MUSIC PANE
      mw: new Animated.Value(Dimensions.get('window').width/100 * 80), // music width
      mh: new Animated.Value(Dimensions.get('window').height/100 * 80), // music height
      mt: new Animated.Value(Dimensions.get('window').height/100 * 5), // music marginTop
      ml: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginLeft
      mr: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginRight
      // VIDEO PANE
      vw: new Animated.Value(Dimensions.get('window').width/100 * 80), // music width
      vh: new Animated.Value(Dimensions.get('window').height/100 * 80), // music height
      vt: new Animated.Value(Dimensions.get('window').height/100 * 5), // music marginTop
      vl: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginLeft
      vr: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginRight
      // CHAT PANE
      cw: new Animated.Value(Dimensions.get('window').width/100 * 80), // music width
      ch: new Animated.Value(Dimensions.get('window').height/100 * 80), // music height
      ct: new Animated.Value(Dimensions.get('window').height/100 * 5), // music marginTop
      cl: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginLeft
      cr: new Animated.Value(Dimensions.get('window').width/100 * 10), // music marginRight
    }
    this.openPane = this.openPane.bind(this);
    this.closePane = this.closePane.bind(this);
  }
  openPane(paneName) {
    this.setState({
      title: paneName.toString().toUpperCase(),
      [paneName]: true
    })
    var p = paneName.charAt(0);
    Animated.timing(
      this.state[`${p}w`],
      {
        toValue: Dimensions.get('window').width,
        duration: 500
      }
    ).start();
    Animated.timing(
      this.state[`${p}h`],
      {
        toValue: Dimensions.get('window').height,
        duration: 500
      }
    ).start();
    Animated.timing(
      this.state[`${p}t`],
      {
        toValue: 0,
        duration: 500
      }
    ).start();
    Animated.timing(
      this.state[`${p}l`],
      {
        toValue: 0,
        duration: 500
      }
    ).start();
    Animated.timing(
      this.state[`${p}r`],
      {
        toValue: 0,
        duration: 500
      }
    ).start();
  }
  closePane() {
    var p
    if (this.state.music === true) {
      p = 'm';
      this.setState({music: false})
    } else if (this.state.video === true) {
      p = 'v';
      this.setState({video: false})
    } else if (this.state.chat === true) {
      p = 'c';
      this.setState({chat: false})
    }
      Animated.timing(
        this.state[`${p}w`],
        {
          toValue: Dimensions.get('window').width/100 * 80,
          duration: 500
        }
      ).start();
      Animated.timing(
        this.state[`${p}h`],
        {
          toValue: Dimensions.get('window').height/100 * 80,
          duration: 500
        }
      ).start();
      Animated.timing(
        this.state[`${p}t`],
        {
          toValue: Dimensions.get('window').height/100 * 5,
          duration: 500
        }
      ).start();
      Animated.timing(
        this.state[`${p}l`],
        {
          toValue: Dimensions.get('window').width/100 * 10,
          duration: 500
        }
      ).start();
      Animated.timing(
        this.state[`${p}r`],
        {
          toValue: Dimensions.get('window').width/100 * 10,
          duration: 500
        }
      ).start();
    this.setState({title:"MUSICROOM"})
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
              marginTop: this.state.mt,
              marginLeft: this.state.ml,
              marginRight: this.state.mr,
              width: this.state.mw,
              height: this.state.mh,
              justifyContent: 'center'
            }}>
              <Text style={styles.musicText}>MUSIC</Text>
            </Animated.View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={()=>{this.openPane('video')}}>
            <Animated.View style={{
              backgroundColor: 'rgba(100,150,100,1)',
              marginTop: this.state.vt,
              marginLeft: this.state.vl,
              marginRight: this.state.vr,
              width: this.state.vw,
              height: this.state.vh,
              justifyContent: 'center'
            }}>
              <Text style={styles.musicText}>VIDEO</Text>
            </Animated.View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="rgba(0,0,0,0.1)"
            onPress={()=>{this.openPane('chat')}}>
            <Animated.View style={{
              backgroundColor: 'rgba(150,100,100,1)',
              marginTop: this.state.ct,
              marginLeft: this.state.cl,
              marginRight: this.state.cr,
              width: this.state.cw,
              height: this.state.ch,
              justifyContent: 'center'
            }}>
              <Text style={styles.musicText}>CHAT</Text>
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
    height: Dimensions.get('window').height,
    flexDirection: 'row'
  },
  paneMusic: {
    backgroundColor: 'rgba(100,100,150,1)',
    marginTop: Dimensions.get('window').height/100 * 5,
    marginLeft: Dimensions.get('window').width/100 * 10,
    marginRight: Dimensions.get('window').width/100 * 10,
    width: Dimensions.get('window').width/100 * 80,
    height: Dimensions.get('window').height/100 * 80,
    justifyContent: 'center'
  },
  paneMusicOpen: {
    backgroundColor: 'rgba(100,100,150,1)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  paneVideo: {
    backgroundColor: 'rgba(150,100,100,1)',
    marginTop: Dimensions.get('window').height/100 * 5,
    marginLeft: Dimensions.get('window').width/100 * 10,
    marginRight: Dimensions.get('window').width/100 * 10,
    width: Dimensions.get('window').width/100 * 80,
    height: Dimensions.get('window').height/100 * 80,
    justifyContent: 'center'
  },
  paneVideoOpen: {
    backgroundColor: 'rgba(150,100,100,1)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  paneChat: {
    backgroundColor: 'rgba(100,150,100,1)',
    marginTop: Dimensions.get('window').height/100 * 5,
    marginLeft: Dimensions.get('window').width/100 * 10,
    marginRight: Dimensions.get('window').width/100 * 10,
    width: Dimensions.get('window').width/100 * 80,
    height: Dimensions.get('window').height/100 * 80,
    justifyContent: 'center'
  },
  paneChatOpen: {
    backgroundColor: 'rgba(100,150,100,1)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  musicText: {
    textAlign: 'center',
    color: 'white'
  },
  videoText: {
    textAlign: 'center',
    color: 'white'
  },
  chatText: {
    textAlign: 'center',
    color: 'white'
  },
  closebutton: {
    flex: 2,
    alignItems: 'center',
    position: 'relative',
    marginTop: 180
  }
})

export default App;
