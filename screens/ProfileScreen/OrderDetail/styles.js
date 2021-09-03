import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ebebeb'
  },
  boldText: {
    fontWeight: 'bold',
    paddingBottom: 5
  },
  title: {
    color: 'white',
    paddingLeft: 5,
    fontWeight: 'bold',
    paddingTop: 3,
    paddingBottom: 3
  },
  price: {
    color: Colors.primaryColorLight,
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 5
  },
  flatCardItem: {
    borderRadius: 10,
    backgroundColor: Colors.backgroundColor,
    marginTop: 15,
    padding: 0,
    marginLeft: 10,
    marginRight: 10
  },
  flatCardTitle: {
    backgroundColor: Colors.primaryColorLight,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 5,
    paddingTop: 5
  },
  cardItemContainerImage: {
    alignSelf: 'center',
    marginTop: 5
  },
  cardItemName: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
    fontSize: 16
  },
  cardItemDescription: {
    textAlign: 'center',
    marginTop: 5,
    color: Colors.textGrayColor
  },
  containerCoverage: {
    justifyContent: 'flex-start'
  },
  simpleText: {
    textAlign: 'left',
    fontWeight: '500',
    fontSize: 15
  },
  mt40: {
    marginTop: 40
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

export default style;
