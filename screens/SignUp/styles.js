import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const style = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 100,
    marginTop: 50,
  },
  keyboardContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    paddingTop: 25,
    marginBottom: 100,

  },
  containerTwoItems: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20
  },
  item: {
    flex: 1
  },
  itemPicker: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 9,
    borderBottomColor: Colors.bottomDisableColor,
    marginRight: 10
  },
  inputMask: {
    borderBottomWidth: 1,
    paddingBottom: 3,
    borderBottomColor: Colors.bottomDisableColor,
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3
  },
  backgroundLogin: {
    flex: 1,
    width: null,
    height: null,
  },
  overlay: {
    backgroundColor: 'rgba(255,0,0,0.5)'
  },
  logo: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
    tintColor: 'black'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400'
  },
  mt4: {
    marginTop: 4
  },
  mt16: {
    marginTop: 16
  },
  mt32: {
    marginTop: 32
  },
  mt40: {
    marginTop: 40
  },
  mt60: {
    marginTop: 60
  },
  fullWidth: {
    width: '90%'
  },
  formInput: {
    textAlign: 'center',
    color: '#000000'
  },
  inputLabel: {
    textAlign: 'center',
    color: Colors.inputLabelColor,
    fontStyle: 'normal',
    fontWeight: '100'
  },
  label: {
    fontSize: 17,
    color: Colors.inputLabelColor,
    fontWeight: '100',
    textAlign: 'center',
    paddingTop: 5,
    marginBottom: 10
  },
  containerInput: {
    marginTop: -5,
    borderBottomColor: Colors.bottomDisableColor
  },
  containerInputFocus: {
    borderBottomColor: Colors.bottomColor
  },
  divider: {
    marginTop: 20,
    height: 1,
    backgroundColor: Colors.bottomDisableColor
  }
});;

export default style;
