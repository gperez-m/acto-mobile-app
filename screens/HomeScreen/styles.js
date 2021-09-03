import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  cardContainerView: {
    alignItems: 'center',
    flex: 1.2,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10
  },
  cardContainerViewBottom: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10
  },
  cardContainerViewRight: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 10
  },
  cardContainerViewBottomParent: {
    flex: 0.25,
    width: '100%',
    zIndex: 1
  },
  cardViewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 25,
    borderRadius: 15,
    alignItems: 'center'
  },
  cardContainerLeft: {
    width: '100%',
    height: '100%',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 25,
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative'
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 0,
    paddingTop: 0,
    fontWeight: '400',
    color: Colors.primaryColorDark
  },
  inline: {
    flex: 1
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'yellow'
  },
  viewColumn: {
    width: '48%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1%'
  },
  imgSection1: {
    width: 56,
    height: 55,
    alignSelf: 'center'
  },
  imgSection2: {
    width: 86,
    height: 85,
    alignSelf: 'center'
  },
  ml20: {
    marginTop: -10
  },
  ml5: {
    marginTop: 5
  },
  // Inline styles
  containerCardParent: {
    flex: 1.2,
    margin: 10,
    zIndex: 1
  },
  cardProfile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardMyPolicies: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55
  },
  policyImage: {
    height: 35,
    width: 35
  },
  cardBuyPolicies: {
    flexDirection: 'row',
    flex: 0.5,
    justifyContent: 'center'
  },
  cardItemPolicy: {
    borderRadius: 15,
    width: 125,
    marginLeft: 40,
    marginRight: 40,
    alignSelf: 'center',
    padding: 10
   }
});

export default style;
