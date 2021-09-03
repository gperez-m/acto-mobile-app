import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  centerItem: {
    alignSelf:'center'
  },
  containerInformation: {
    flex: 1.5
  },
  containerHistory: {
    flex: 2
  },
  cardInformation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 17,
    fontWeight: '500'
  },
  typeSubjet: {
    color: Colors.textGrayColor,
    marginLeft: 0
  },
  name: {
    color: Colors.primaryColor
  },
  bold: {
    fontWeight: '800'
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
  flatListView: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15
  },
  cardList: {
    borderRadius: 10
  },
  iconList: {
    width: 15,
    height: 15
  }
});

export default style;
