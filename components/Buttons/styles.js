import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  btnPrimary: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
  },
  btnSecondary: {
    width: '100%',
    borderRadius: 25,
    padding: 11,
    borderWidth: 2,
    borderColor: Colors.primaryColor
  },
  btnTransparent: {
    width: '100%',
    borderRadius: 25,
    padding: 11,
    backgroundColor: 'transparent'
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent'
  },
  btnTextPrimary: {
    color: Colors.primaryColor
  },
  btnTextClear: {
    fontSize: 14,
    color: Colors.primaryColor
  },
  btnTextWhite: {
    fontSize: 14,
    color: '#ffffff'
  },
  loading: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor
  }
});

export default style;
