import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 25,
    marginLeft: 25,
    marginTop: 25
  },
  input: {
    borderColor: Colors.textGrayColor,
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10
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
  fullWidth: {
    width: '90%'
  },
  formInput: {
    textAlign: 'center',
    color: '#000000'
  },
  inputLabel: {
    textAlign: 'left',
    color: Colors.inputLabelColor,
    fontStyle: 'normal',
    fontWeight: '100'
  },
  containerInput: {
    marginTop: -5,
    borderBottomColor: Colors.bottomDisableColor
  },
  containerInputFocus: {
    borderBottomColor: Colors.bottomColor
  },
  inputMask: {
    borderBottomWidth: 1,
    paddingBottom: 3,
    borderBottomColor: Colors.bottomDisableColor,
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3
  },
  label: {
    fontSize: 17,
    color: Colors.inputLabelColor,
    fontWeight: '100',
    paddingTop: 5,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '200'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  viewActive: {
    height: 15,
    width: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
    marginRight: 10
  },
  viewInactive: {
    height: 15,
    width: 15,
    backgroundColor: 'transparent',
    borderColor: Colors.primaryColor,
    borderRadius: 25,
    borderWidth: 2,
    marginRight: 10
  },
  spei: {
    width: 70,
    height: 25,
    padding: 5
  },
  creditCard: {
    width: 40,
    height: 30
  },
  oxxo: {
    width: 70,
    height: 30
  },
  formPayment: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  }
});

export default style;
