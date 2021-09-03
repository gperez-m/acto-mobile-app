import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from 'react-native';
import { Formik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import TextField from '../../../components/Inputs/TextField';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';
import Style from './styles';
import Colors from '../../../constants/Colors';

// Metodos de pago
// tarjeta = 1
// oxxo = 2
// spei = 3
const validationSchema = yup.object().shape({
  number: yup
    .number()
    .required('Campo requerido')
    .label('Numero de tarjeta'),
  cvc: yup
    .number()
    .required('Campo requerido')
    .label('cvc'),
  name: yup
    .string()
    .required('Campo requerido')
    .label('name'),
  exp: yup
    .string()
    .required('Campo requerido')
    .label('Fecha expiración')
});

const logoCredito = require('../../../assets/images/icons/credit.png');
const logoOxxo = require('../../../assets/images/icons/oxxo.png');
const logoSpei = require('../../../assets/images/icons/spei.png');

const step = props => {
  let defaultInitialValues = {
    number: '',
    cvc: '',
    exp: '',
    name: ''
  };
  if (props.paymentObj != null) {
    defaultInitialValues = props.paymentObj;
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={Style.container}>
        <Text allowFontScaling={false} style={Style.title}>
          Forma de pago
        </Text>
        {props.singleForm !== 'monthly' && (
          <View
            style={[
              Style.summaryContainer,
              { marginTop: props.singleForm === 'monthly' ? 40 : 20 }
            ]}>
            <TouchableOpacity onPress={() => props.onChangePayment('3')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {props.paymentSelection == '3' ? (
                  <View style={Style.viewActive} />
                ) : (
                  <View style={Style.viewInactive} />
                )}
                <View>
                  <Image
                    tintColor={Colors.primaryColorLight}
                    source={logoSpei}
                    style={Style.spei}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 35 }} onPress={() => props.onChangePayment('1')}>
              <View style={Style.row}>
                {props.paymentSelection == '1' ? (
                  <View style={Style.viewActive} />
                ) : (
                  <View style={Style.viewInactive} />
                )}
                <View>
                  <Image
                    tintColor={Colors.primaryColorLight}
                    source={logoCredito}
                    style={Style.creditCard}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 35 }} onPress={() => props.onChangePayment('2')}>
              <View style={Style.row}>
                {props.paymentSelection == '2' ? (
                  <View style={Style.viewActive} />
                ) : (
                  <View style={Style.viewInactive} />
                )}
                <View>
                  <Image
                    tintColor={Colors.primaryColorLight}
                    source={logoOxxo}
                    style={Style.oxxo}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View>
          {props.paymentSelection == '1' || props.singleForm === 'monthly' ? (
            <Formik
              initialValues={defaultInitialValues}
              onSubmit={values => props.nextStep(values)}
              validationSchema={validationSchema}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <View style={Style.formPayment}>
                    <View style={{ marginTop: 24 }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: Colors.inputLabelColor,
                          fontWeight: '100',
                          paddingTop: 5,
                          marginBottom: Platform.OS === 'ios' ? 10 : 0,
                          fontSize:
                            Platform.OS !== 'ios'
                              ? Dimensions.get('window').width * 0.035
                              : Dimensions.get('window').width * 0.044
                        }}>
                        Numero de tarjeta
                      </Text>
                    </View>
                    <TextInputMask
                      label="Numero de tarjeta"
                      type="credit-card"
                      options={{
                        obfuscated: false
                      }}
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
                      errorMessage={'number' in errors && touched.number ? errors.number : ''}
                      onChangeText={handleChange('number')}
                      value={values.number}
                    />
                    {'number' in errors && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          textAlign: 'center',
                          fontSize: 12,
                          color: 'red'
                        }}>
                        {errors.number}
                      </Text>
                    )}
                  </View>
                  <TextField
                    label="Nombre que aparece en la tarjeta"
                    labelStyle={{
                      textAlign: 'left',
                      color: Colors.inputLabelColor,
                      fontStyle: 'normal',
                      fontWeight: '100',
                      marginTop: 32,
                      fontSize:
                        Platform.OS !== 'ios'
                          ? Dimensions.get('window').width * 0.035
                          : Dimensions.get('window').width * 0.044
                    }}
                    inputStyle={Style.formInput}
                    inputContainerStyle={Style.containerInput}
                    returnKeyType="next"
                    onChange={handleChange('name')}
                    errorStyle={{ textAlign: 'center', fontSize: 12 }}
                    errorMessage={'name' in errors && touched.name ? errors.name : ''}
                    value={values.name}
                  />
                  <View style={{ flexDirection: 'row', marginLeft: 15 }}>
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
                          Fecha de expiración
                        </Text>
                      </View>
                      <TextInputMask
                        label="Fecha de expiración"
                        type="datetime"
                        options={{
                          format: 'MM/YY'
                        }}
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.bottomDisableColor,
                          textAlign: 'center',
                          fontSize:
                            Platform.OS !== 'ios'
                              ? Dimensions.get('window').width * 0.035
                              : Dimensions.get('window').width * 0.044,
                          marginTop: 3
                        }}
                        errorStyle={{ textAlign: 'center', fontSize: 12 }}
                        errorMessage={'exp' in errors && touched.exp ? errors.exp : ''}
                        onChangeText={handleChange('exp')}
                        value={values.exp}
                      />
                      {'exp' in errors && (
                        <Text
                          allowFontScaling={false}
                          style={{
                            textAlign: 'center',
                            fontSize: 12,
                            color: 'red'
                          }}>
                          {errors.exp}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextField
                        label="CVC"
                        maxLength={4}
                        keyboardType="numeric"
                        labelStyle={{
                          textAlign: 'left',
                          color: Colors.inputLabelColor,
                          fontStyle: 'normal',
                          fontWeight: '100',
                          marginTop: 32,
                          paddingBottom: Platform.OS !== 'ios' ? 17 : 0,
                          fontSize:
                            Platform.OS !== 'ios'
                              ? Dimensions.get('window').width * 0.035
                              : Dimensions.get('window').width * 0.044
                        }}
                        inputStyle={Style.formInput}
                        inputContainerStyle={Style.containerInput}
                        returnKeyType="next"
                        onChange={handleChange('cvc')}
                        errorStyle={{ textAlign: 'center', fontSize: 12 }}
                        errorMessage={'cvc' in errors && touched.cvc ? errors.cvc : ''}
                        value={values.cvc}
                      />
                    </View>
                  </View>
                  <View style={Style.mt40}>
                    <PrimaryButton
                      text="Continuar"
                      loadingBtn={props.loadingToken}
                      onPress={handleSubmit}
                    />
                  </View>
                </View>
              )}
            </Formik>
          ) : (
            <View style={Style.mt40}>
              <PrimaryButton
                text="Continuar"
                loadingBtn={props.loading}
                onPress={() => props.nextStep(null)}
              />
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

step.defaultProps = {
  onChangePayment: () => null,
  loading: false,
  nextStep: () => null,
  singleForm: 'anual'
};

export default step;
