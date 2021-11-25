import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableHighlightBase
} from 'react-native';
import PropTypes from 'prop-types';
import { Formik, yupToFormErrors } from 'formik';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import * as yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import { http } from '../../networking/ApiClient';
import TextField from '../../components/Inputs/TextField';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import Colors from '../../constants/Colors';
import Style from './styles';

const stripe = require('stripe-client')('pk_test_9pTXH6NIFb0D9UuxK1vh1dVa005aGrSsra');

const userLogo = require('../../assets/images/icons/user.png');
const ticketLogo = require('../../assets/images/tickets.png');
const alarm = require('../../assets/images/icons/sirena.png');

const defaultInitialValues = {
  number: '',
  cvc: '',
  exp: '',
  name: ''
};

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

class updateMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.updatePaymentMethod = this.updatePaymentMethod.bind(this);
    this.tokenizar = this.tokenizar.bind(this);
  }

  static navigationOptions = ({ navigation, props }) => {
    return {
      headerTitle: (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>
              Método de pago
            </Text>
          </View>
        </View>
      ),
      headerStyle: {
        backgroundColor: Colors.primaryColor
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        textAlign: 'center',
        alignSelf: 'center'
      },
      headerVisible: true
    };
  };

  updatePaymentMethod(token_card) {
    const { subscription_id } = this.props.navigation.state.params;
    const obj = {
      subscription_id,
      token_card
    };
    const { goBack } = this.props.navigation;

    http
      .post('client/update/payment/method/subscription', obj)
      .then(result => {
        this.setState(
          {
            isLoading: false
          },
          () => {
            Alert.alert('ATENCIÓN', result.msg, [{ text: 'OK', onPress: () => goBack() }], {
              cancelable: false
            });
          }
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ isLoading: false });
      });
  }

  async tokenizar(values) {
    let token = null;
    this.setState({ isLoading: true });
    const card = {
      number: values.number,
      name: values.name,
      exp_year: parseInt(values.exp.split('/')[1], 10),
      exp_month: parseInt(values.exp.split('/')[0], 10),
      cvc: values.cvc
    };
    token = await stripe.createToken({ card });
    console.log('token', token);
    if (token != null) {
      this.updatePaymentMethod(token.id);
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.props.navigation.state.params.getData();
  }

  render() {
    const { isLoading } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#ebebeb' }}
        behavior="padding"
        enabled>
        <ScrollView style={{ marginTop: 0 }} keyboardShouldPersistTaps="handled">
          <View style={Style.container}>
            <Formik
              initialValues={defaultInitialValues}
              onSubmit={values => this.tokenizar(values)}
              validationSchema={validationSchema}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={{ margin: 20 }}>
                  <View style={Style.formPayment}>
                    <View style={{ marginTop: 10 }}>
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
                      marginLeft: 5,
                      marginTop: 15,
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
                      <View style={{ marginTop: 25 }}>
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
                      text="Actualizar"
                      loadingBtn={isLoading}
                      onPress={handleSubmit}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default updateMethod;
