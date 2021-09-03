import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  flatListView: {
    flex: 1
  },
  containerCoverage: {
    justifyContent: 'flex-start'
  },
  flatCardItem: {
    flex: 1,
    height: 'auto',
    borderRadius: 15,
    backgroundColor: Colors.backgroundColor
  },
  flatCardPrice: {
    backgroundColor: Colors.primaryColorLight,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '65%',
    paddingBottom: 5,
    paddingTop: 5
  },
  cardItemTextPrice: {
    textAlign: 'center',
    fontWeight: '500',
    color: 'white',
    fontSize: 13
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
  sectionTitle: {},
  leftLine: {
    backgroundColor: Colors.textGrayColor,
    height: 0.5,
    flex: 1,
    alignSelf: 'center'
  },
  rightLine: {
    backgroundColor: Colors.textGrayColor,
    height: 0.5,
    flex: 1,
    alignSelf: 'center'
  },
  centerLine: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: 15,
    color: Colors.primaryColor
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
  },
  policyName: {
    paddingTop: -10
  }
});

export default style;
