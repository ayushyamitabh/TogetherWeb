import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

export default class Header extends Component {
  constructor(props) {
    super(props);
  }
  doNothing() {
    // place holder function
  }
  render() {
    return (
      <View style={styles.headerMain}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor="rgba(0,0,0,0.1)"
          onPress={this.props.canGoBack ? this.props.backHandler : this.doNothing}>
          <Text style={this.props.canGoBack ? styles.backButton : styles.disabledBackButton}>{`<`}</Text>
        </TouchableHighlight>
        <Text style={styles.mainTitle}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Dimensions.get('window').height/100 * 8,
    backgroundColor: 'rgba(200,200,200,0.2)'
  },
  disabledBackButton: {
    textAlign: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20,
    color: 'rgba(200,200,200,0.2)'
  },
  backButton:{
    textAlign: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20
  },
  mainTitle: {
    fontSize: 22,
    marginLeft: 10
  }
})
