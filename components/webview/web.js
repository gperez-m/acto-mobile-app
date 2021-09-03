import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export function web(props) {
  return <WebView source={{ uri: props.url }} style={{ marginTop: 20 }} />;
}
