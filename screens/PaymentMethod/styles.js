import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  formPayment: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  formInput: {
    textAlign: 'center',
    color: '#000000'
  },
  containerInput: {
    marginTop: -5,
    borderBottomColor: Colors.bottomDisableColor
  },
  mt40: {
    marginTop: 30
  }
});

export default style;
