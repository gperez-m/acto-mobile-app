import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import Style from './styles';
import Colors from '../../constants/Colors';

export function SecondaryButton(props) {
  return (
    <View style={{ margin: props.margin }}>
      <Button
        {...props}
        titleStyle={{
          color: props.color,
          fontSize: props.fontSize
        }}
        style={{
          alignItems: 'center',
          borderRadius: 25,
          width: '100%',
          minWidth: props.minWidth
        }}
        buttonStyle={[
          Style.btnSecondary,
          {
            height: props.height,
            padding: props.padding,
            borderRadius: props.borderRadius,
            borderColor: props.color
          }
        ]}
        title={props.text}
        type="outline"
      />
    </View>
  );
}

SecondaryButton.propTypes = {
  loadingBtn: PropTypes.bool,
  minWidth: PropTypes.number,
  fontSize: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  margin: PropTypes.number,
  height: PropTypes.any,
  padding: PropTypes.number,
  borderRadius: PropTypes.number,
  color: PropTypes.string
};

SecondaryButton.defaultProps = {
  minWidth: 200,
  loadingBtn: false,
  fontSize: 15,
  onPress: () => null,
  margin: 10,
  height: 53,
  padding: 11,
  borderRadius: 25,
  color: Colors.primaryColor
};
