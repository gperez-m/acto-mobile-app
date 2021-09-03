import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ebebeb'
  },
  containerInformation: {
    //flex:1
  },
  containerHistory: {
    marginTop: 25
  },
  cardInformation: {
    flexDirection: 'row'
  },
  titleText: {
    fontSize: 17,
    fontWeight: '400'
  },
  name: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: '400'
  },
  email: {
    color: Colors.textGrayColor,
    fontSize: 15
  },
  password: {
    color: Colors.primaryColor,
    fontSize: 16
  },
  ml15: {
    marginLeft: 15
  },
  ml10: {
    marginLeft: 10
  },
  mt5: {
    marginTop: 5
  },
  mt15: {
    marginTop: 15
  },
  profileTitle: {
    color: 'white',
    fontSize: 17,
    paddingLeft: 5
  }
});

export default style;
