import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import Style from './styles';
import Colors from '../../constants/Colors';

export function TransparentButton(props) {
  return (
    <View style={{ marginLeft: 10, marginRight: 10, marginTop: 0 }}>
      <Button
        {...props}
        titleStyle={{ fontSize: props.fontSize, color: Colors.primaryColor }}
        style={{ alignItems: 'center', borderRadius: 50, width: '100%' }}
        buttonStyle={Style.btnTransparent}
        title={props.text}
        type="clear"
      />
    </View>
  );
}

TransparentButton.propTypes = {
  loadingBtn: PropTypes.bool,
  fontSize: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

TransparentButton.defaultProps = {
  loadingBtn: false,
  fontSize: 14,
  onPress: () => null
};
