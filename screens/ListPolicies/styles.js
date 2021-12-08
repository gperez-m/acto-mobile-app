import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  flatListView: {
    flex: 1,
    flexDirection: 'column'
  },
  flatCardItem: {
    height: Dimensions.get('window').height / 4,
    width: Dimensions.get('window').width / 2.2,
    flex: 0.5,
    borderRadius: 15,
    backgroundColor: Colors.backgroundColor,
    margin: 10,
    padding: 0
  },
  flatCardPrice: {
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '90%',
    paddingBottom: 5,
    paddingTop: 5
  },
  cardItemTextPrice: {
    textAlign: 'left',
    fontWeight: '500',
    paddingLeft: 10,
    color: 'white',
    fontSize: 13
  },
  cardItemContainerImage: {
    alignSelf: 'center',
    marginTop: 5
  },
  cardItemName: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500'
  },
  cardItemDescription: {
    textAlign: 'center',
    marginTop: 5,
    color: Colors.textGrayColor
  }
});

export default style;
