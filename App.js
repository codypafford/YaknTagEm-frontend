import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';

import Header from './components/Header';
import Map from './components/Map';


export default class App extends Component {
  render() {
    return (
      <View>
        <Header></Header>
        <Map></Map>
    </View>
    );
  }
}
