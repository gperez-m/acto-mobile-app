import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const shimmerLayout = props => {
  const { lines, mTop, height } = props;
  return (
    <View style={{ flex: 1, marginTop: 15 }}>
      {Array.from(Array(lines)).map((i, k) => (
        <ShimmerPlaceHolder key={k} style={{ marginTop: mTop, width: '100%', height }} autoRun />
      ))}
    </View>
  );
};

shimmerLayout.defaultProps = {
  lines: 5,
  flex: 1,
  mTop: 5,
  height: 15
};

export default shimmerLayout;
