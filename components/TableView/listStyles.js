import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  listPoliciesContainer: {
    flex: 1
  },
  listPoliciesItemLeft: {
    fontSize: 14,
    flex: 1,
    textAlign: 'left'
  },
  listPoliciesItemCenter: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center'
  },
  listPoliciesItemCenterLong: {
    fontSize: 14,
    flex: 1.5,
    textAlign: 'center'
  },
  listPoliciesItemRight: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right'
  },
  itemPrice: {
    fontWeight: '500'
  },
  flatListView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15
  },
  active: {
    color: 'green'
  },
  regular: {
    color: 'black'
  }
});

export default style;
