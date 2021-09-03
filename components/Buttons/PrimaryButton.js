import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import Style from './styles';

export function PrimaryButton(props) {
  return (
    <View style={{ margin: props.margin, minWidth: props.minWidth }}>
      <Button
        {...props}
        loading={props.loadingBtn}
        titleStyle={Style.btnTextWhite}
        style={{
          alignItems: 'center',
          borderRadius: 25,
          width: '100%',
          minWidth: props.minWidth
        }}
        buttonStyle={[
          Style.btnPrimary,
          { height: props.height, padding: props.padding, borderRadius: props.borderRadius }
        ]}
        title={props.text}
        type="solid"
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ['#1401f0', '#050c9c'],
          start: { x: 0, y: 1 },
          end: { x: 1, y: 0.5 }
        }}
        onPress={props.onPress}
      />
    </View>
  );
}

PrimaryButton.propTypes = {
  loadingBtn: PropTypes.bool,
  minWidth: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  margin: PropTypes.number,
  height: PropTypes.any,
  padding: PropTypes.number,
  borderRadius: PropTypes.number
};

PrimaryButton.defaultProps = {
  minWidth: 200,
  loadingBtn: false,
  onPress: () => null,
  margin: 10,
  height: 53,
  padding: 11,
  borderRadius: 25
};
