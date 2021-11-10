import React from 'react';
import type {Node} from 'react';
import {Image, StyleSheet, LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import World from './src/World';

const App: () => Node = () => {
  return <World />;
};

const styles = StyleSheet.create({});

export default App;
