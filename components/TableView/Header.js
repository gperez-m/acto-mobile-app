import React, { useState, useContext } from 'react';
import { Text, View, Image } from 'react-native';
import { Card } from 'react-native-elements';
import Colors from '../../constants/Colors';

renderAlign = (props, size) => {
  if(props == 0){
    return 'left';
  }else if(props == (size - 1)){
    return 'right';
  }else{
    return 'center'
  }
};
const Header = props => {
  return (
    <View style={{ flex: 1, flexDirection: 'row'}}>
      {
        props.titles.map((l, i) => (
          <View key={i} style={{ flex: (i == 1) ? 1.5 : 1, marginTop: 15}}>
            <Text allowFontScaling={false} style={{
              textAlign: this.renderAlign(i, props.titles.length),
              color: Colors.textGrayColor,
              fontSize: 14
              }}>
              {l.name}
            </Text>
          </View>
        ))
      }
    </View>
  );
};

Header.defaultProps = {

};

export default Header;
