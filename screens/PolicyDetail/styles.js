import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerCoverage: {
    justifyContent: 'flex-start'
  },
  containerInfo: {
    marginLeft: 25,
    marginRight: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  price: {
    textAlign: 'left',
    fontWeight: '500',
    color: 'white',
    fontSize: 13
  },
  flatCardPrice: {
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '70%',
    paddingBottom: 5,
    paddingTop: 5,
    marginLeft: 25,
    marginRight: 15,
    marginTop: 15
  },
  containerButton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 1
  },
  policyImg: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: 40
  },
  containerCover: {
    height: 'auto',
    width: '100%'
  },
  coverPolicyImg: {
    height: 150,
    width: '100%'
  },
  name: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17
  },
  description: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 15,
    color: Colors.textGrayColor
  },
  simpleText: {
    fontWeight: '500',
    fontSize: 15
  },
  simpleTextCenter: {
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center'
  },
  simpleTextJutify: {
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'left'
  },
  centerText: {
    textAlign: 'center'
  },
  justifyText: {
    textAlign: 'justify'
  },
  policyName: {
    paddingTop: -10,
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  listRow: {
    flexDirection: 'row'
  },
  bullet: {
    fontSize: 25,
    letterSpacing: 20,
    paddingTop: 20
  },
  floatingButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'none',
    right: 0,
    backgroundColor: Colors.bottomDisableColor
  },
  mt40: {
    marginTop: 40
  },
  mt30: {
    marginTop: 30
  },
  mt20: {
    marginTop: 20
  },
  mt10: {
    marginTop: 10
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  startItems: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start'
  }
});

export default style;
