import { StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#ebebeb'
  },
  titleText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center'
  },
  typeSubjet: {
    color: Colors.textGrayColor,
    marginLeft: 0
  },
  input: {
    borderColor: Colors.textGrayColor,
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  fullWidth: {
    width: '90%'
  },
  formInput: {
    textAlign: 'center',
    color: '#000000'
  },
  formInputLeft: {
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
  label: {
    fontSize: 17,
    color: Colors.inputLabelColor,
    fontWeight: '100',
    paddingTop: 5,
    marginBottom: 10,
    marginLeft: 10
  },
  pickerView: {
    borderBottomColor: Colors.bottomDisableColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginBottom: 15
  },
  textError: {
    textAlign: 'center',
    fontSize: 12,
    color: 'red'
  },
  bold: {
    fontWeight: '800'
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
  }
});

export default style;
