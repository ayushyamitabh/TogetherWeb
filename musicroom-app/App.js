import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake to open the developer menu.</Text>
        <View style={styles.subcontainer}>
          <Text>1</Text>
          <Text>2</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subcontainer: {
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
