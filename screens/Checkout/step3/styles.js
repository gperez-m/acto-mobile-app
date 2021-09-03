import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 25
  },
  textBold: {
    fontWeight: 'bold',
    marginRight: 5
  },
  cardContainer: {
    backgroundColor: Colors.polizaColor,
    borderRadius: 5
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: 17
  },
  mt40: {
    marginTop: 40
  }
});

export default style;
