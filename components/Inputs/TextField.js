import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Input, ThemeContext } from 'react-native-elements';

const TextField = props => {
  const [focused, setFocused] = useState(false);
  const { theme } = useContext(ThemeContext);

  const onFocus = () => {
    setFocused(true);
    props.onFocus();
  };

  const onBlur = () => {
    setFocused(false);
    props.onBlur();
  };

  const inputContainerStyle = {
    ...props.inputContainerStyle,
    ...(focused ? { borderBottomColor: theme.colors.primary } : {})
  };

  return (
    <Input
      {...props}
      onFocus={onFocus}
      onBlur={onBlur}
      allowFontScaling={false}
      autoCapitalize="none"
      onChangeText={e => props.onChange(e)}
      inputContainerStyle={inputContainerStyle}
      ref={props.refInner}
    />
  );
};

TextField.propTypes = {
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
};

TextField.defaultProps = {
  onFocus: () => null,
  onBlur: () => null,
  onSubmit: () => null,
  onChange: () => null
};

export default TextField;
