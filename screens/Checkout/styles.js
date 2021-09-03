import { StyleSheet ,Dimensions, Platform} from 'react-native';

import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  containerBackground: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#ebebeb',
    zIndex: 10,
  }
});

export default style;
