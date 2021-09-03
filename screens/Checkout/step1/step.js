import React, { useState, useContext } from 'react';
import { Text, View, KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import { TextInputMask } from 'react-native-masked-text';
import * as yup from 'yup';
import TextField from '../../../components/Inputs/TextField';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';

import Style from './styles';
import Colors from '../../../constants/Colors';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Campo requerido')
    .email('Ingresa un correo valido')
    .label('email'),
  name: yup
    .string()
    .required('Campo requerido')
    .label('name'),
  last_name: yup
    .string()
    .required('Campo requerido')
    .label('last_name'),
  birthday: yup
    .string()
    .required('Campo requerido')
    .label('birthday'),
  sex: yup.string().label('sex'),
  zip_code: yup
    .string()
    .required('Campo requerido')
    .label('zip_code'),
  state: yup
    .string()
    .required('Campo requerido')
    .label('state')
});

const step = props => {
  let defaultInitialValues = {
    email: '',
    name: '',
    last_name: '',
    sex: 'MAN',
    birthday: '',
    zip_code: '',
    state: 'JAL'
  };
  if (props.profile != null) {
    defaultInitialValues = props.profile;
  }
  return (
    <View style={Style.container}>
      <Formik
        initialValues={defaultInitialValues}
        onSubmit={values => props.nextStep(values)}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          setFieldTouched,
          setFieldValue,
          errors,
          isSubmitting,
          touched
        }) => (
          <View>
            <TextField
              label="Correo electrónico"
              labelStyle={{
                textAlign: 'left',
                color: Colors.inputLabelColor,
                fontStyle: 'normal',
                fontWeight: '100',
                fontSize:
                  Platform.OS !== 'ios'
                    ? Dimensions.get('window').width * 0.035
                    : Dimensions.get('window').width * 0.044
              }}
              inputStyle={Style.formInput}
              inputContainerStyle={Style.containerInput}
              returnKeyType="next"
              onChange={handleChange('email')}
              errorStyle={{ textAlign: 'center', fontSize: 12 }}
              errorMessage={'email' in errors && touched.email ? errors.email : ''}
              value={values.email}
            />
            <TextField
              label="Nombre"
              labelStyle={{
                textAlign: 'left',
                color: Colors.inputLabelColor,
                fontStyle: 'normal',
                fontWeight: '100',
                fontSize:
                  Platform.OS !== 'ios'
                    ? Dimensions.get('window').width * 0.035
                    : Dimensions.get('window').width * 0.044,
                marginTop: 16
              }}
              inputStyle={Style.formInput}
              inputContainerStyle={Style.containerInput}
              returnKeyType="next"
              errorStyle={{ textAlign: 'center', fontSize: 12 }}
              errorMessage={'name' in errors && touched.name ? errors.name : ''}
              onChange={handleChange('name')}
              value={values.name}
            />
            <TextField
              label="Apellido"
              labelStyle={{
                textAlign: 'left',
                color: Colors.inputLabelColor,
                fontStyle: 'normal',
                fontWeight: '100',
                fontSize:
                  Platform.OS !== 'ios'
                    ? Dimensions.get('window').width * 0.035
                    : Dimensions.get('window').width * 0.044,
                marginTop: 16
              }}
              inputStyle={Style.formInput}
              inputContainerStyle={Style.containerInput}
              returnKeyType="next"
              onChange={handleChange('last_name')}
              errorMessage={'last_name' in errors && touched.last_name ? errors.last_name : ''}
              onChange={handleChange('last_name')}
              value={values.last_name}
            />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 15 }}>
                <View style={{ marginTop: 24, marginLeft: 10, marginBottom: 9 }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: Colors.inputLabelColor,
                      fontWeight: '100',
                      paddingTop: 5,
                      marginBottom: Platform.OS === 'ios' ? 14 : 0,
                      fontSize:
                        Platform.OS !== 'ios'
                          ? Dimensions.get('window').width * 0.035
                          : Dimensions.get('window').width * 0.044
                    }}>
                    Sexo
                  </Text>
                </View>
                <View style={Style.containerPicker}>
                  <RNPickerSelect
                    style={{
                      fontSize:
                        Platform.OS !== 'ios'
                          ? Dimensions.get('window').width * 0.035
                          : Dimensions.get('window').width * 0.044
                    }}
                    placeholder={{}}
                    items={[{ label: 'Hombre', value: 'MAN' }, { label: 'Mujer', value: 'WOMAN' }]}
                    onValueChange={value => {
                      setFieldValue('sex', value);
                    }}
                  />
                  {'sex' in errors && touched.sex && (
                    <Text allowFontScaling={false} style={Style.textError}>
                      {errors.sex}
                    </Text>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 24 }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: Colors.inputLabelColor,
                      fontWeight: '100',
                      paddingTop: 5,
                      marginBottom: Platform.OS === 'ios' ? 14 : 25,
                      fontSize:
                        Platform.OS !== 'ios'
                          ? Dimensions.get('window').width * 0.035
                          : Dimensions.get('window').width * 0.044
                    }}>
                    Fecha de nacimiento
                  </Text>
                </View>
                <TextInputMask
                  label="Fecha de nacimiento"
                  type="datetime"
                  options={{
                    format: 'DD/MM/YYYY'
                  }}
                  placeholder="dd/mm/aaaa"
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 3,
                    borderBottomColor: Colors.bottomDisableColor,
                    textAlign: 'center',
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    marginTop: 3
                  }}
                  errorStyle={{ textAlign: 'center', fontSize: 12 }}
                  errorMessage={'birthday' in errors && touched.birthday ? errors.birthday : ''}
                  onChangeText={handleChange('birthday')}
                  value={values.birthday}
                />
                {'birthday' in errors && (
                  <Text allowFontScaling={false} style={Style.textError}>
                    {errors.birthday}
                  </Text>
                )}
              </View>
            </View>
            <TextField
              label="Codigo postal"
              maxLength={5}
              labelStyle={{
                textAlign: 'left',
                color: Colors.inputLabelColor,
                fontStyle: 'normal',
                fontWeight: '100',
                fontSize:
                  Platform.OS !== 'ios'
                    ? Dimensions.get('window').width * 0.035
                    : Dimensions.get('window').width * 0.044,
                marginTop: 26
              }}
              inputStyle={Style.formInput}
              inputContainerStyle={Style.containerInput}
              returnKeyType="next"
              keyboardType="numeric"
              errorStyle={{ textAlign: 'center', fontSize: 12 }}
              errorMessage={'zip_code' in errors && touched.zip_code ? errors.zip_code : ''}
              onChange={handleChange('zip_code')}
              value={values.zip_code}
            />
            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={{ marginTop: 24, marginLeft: 10 }}>
                <Text allowFontScaling={false} style={Style.label}>
                  Estado
                </Text>
              </View>
              <View style={Style.pickerView}>
                <RNPickerSelect
                  textInputProps={{
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044
                  }}
                  style={{
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044
                  }}
                  placeholder={{}}
                  items={props.states}
                  onValueChange={value => {
                    console.log(value);
                    setFieldValue('state', value);
                  }}
                />
              </View>
              {'state' in errors && (
                <Text allowFontScaling={false} style={Style.textError}>
                  {errors.state}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 40 }}>
              <PrimaryButton text="Continuar" loadingBtn={props.loading} onPress={handleSubmit} />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

step.defaultProps = {
  loading: false,
  nextStep: () => null
};

export default step;
