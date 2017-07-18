import React, {Component} from 'react';
import { Button, StyleSheet, Text, View, ScrollView, StatusBar, TouchableHighlight } from 'react-native';
import Dimensions from 'Dimensions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      title: 'MUSICROOM',
      music: false
    }
    this.openPane = this.openPane.bind(this);
    this.closePane = this.closePane.bind(this);
  }
  openPane(paneName) {
    this.setState({
      title: paneName.toString().toUpperCase(),
      [paneName]: true
    })
  }
  closePane() {
    if (this.state.music === true) {
      this.setState({music: false})
    } else if (this.state.video === true) {
      this.setState({video: false})
    } else if (this.state.chat === true) {
      this.setState({chat: false})
    }
    this.setState({title:"MUSICROOM"})
  }
  render() {
    return (
      <View>
        <StatusBar animated={true} hidden={true} />
        <View style={styles.view}>
          {
            this.state.music || this.state.video || this.state.chat ?
            <Button style={styles.closebutton} onPress={this.closePane} title="GO BACK" /> : true
          }
          <Text style={styles.header}>{this.state.title}</Text>
        </View>
        <ScrollView
          scrollEnabled={this.state.music || this.state.video || this.state.chat ? false : true}
          contentContainerStyle={styles.panes}
          horizontal={true}
          pagingEnabled={true}>
          <TouchableHighlight onPress={()=>{this.openPane('music')}}>
            <View style={!this.state.music ? styles.paneMusic : styles.paneMusicOpen}>
              <Text style={styles.musicText}>MUSIC</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.openPane('video')}}>
            <View style={!this.state.video ? styles.paneVideo : styles.paneVideoOpen}>
              <Text style={styles.videoText}>VIDEO</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.openPane('chat')}}>
            <View style={!this.state.chat ? styles.paneChat : styles.paneChatOpen}>
              <Text style={styles.chatText}>CHAT</Text>
            </View>
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
