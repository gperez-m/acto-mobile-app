import React, { useState, useContext } from 'react';
import { Text, View, Image } from 'react-native';
import { Header } from './Header';
import Style from './styles';
import Colors from '../../constants/Colors';

const Table = props => {
  return (
    <View style={{ flex: 1}}>
        <Header />
    </View>
  );
};

Table.defaultProps = {
  
};

export default Table;
