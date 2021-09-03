import { StyleSheet , Dimensions } from "react-native";

import Colors from '../../../constants/Colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 25,
    marginLeft: 25,
    marginTop: 50
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
  label: {
    fontSize: 17,
    color: Colors.inputLabelColor,
    fontWeight: '100',
    paddingTop: 5,
    marginBottom: 10
  },
  inputMask: {
    borderBottomWidth: 1,
    paddingBottom: 3,
    borderBottomColor: Colors.bottomDisableColor,
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3
  },
  containerPicker: {
    marginLeft: 15,
    borderBottomColor: Colors.bottomDisableColor,
    borderBottomWidth: 1
  },
  textError: {
    textAlign: 'center',
    fontSize: 12,
    color: 'red'
  },
  pickerView: {
    borderBottomColor: Colors.bottomDisableColor,
    borderBottomWidth: 1,
    marginLeft: 10
  }
});

export default style;
