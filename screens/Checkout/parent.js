import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { HeaderBackButton } from 'react-navigation';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Text, Card } from 'react-native-elements';
import Constants from 'expo-constants';
import PaymentTypeStep from './step2/step';
import UserInfoStep from './step1/step';
import SummaryStep from './step3/step';
import { http } from '../../networking/ApiClient';
import mexico from '../../assets/scripts/estados.json';
import Style from './styles';
import Colors from '../../constants/Colors';
import Base64 from './base64';

const stripe = require('stripe-client')('pk_test_9pTXH6NIFb0D9UuxK1vh1dVa005aGrSsra');

const errors = {
  incorrect_number: 'El número de tarjeta es incorrecto.',
  invalid_number: 'El número de tarjeta no es un número de tarjeta válido.',
  invalid_expiry_month: 'El mes de caducidad de la tarjeta no es válido.',
  invalid_expiry_year: 'El año de caducidad de la tarjeta no es válido.',
  invalid_cvc: 'El código de seguridad de la tarjeta no es válido.',
  expired_card: 'La tarjeta ha caducado.',
  incorrect_cvc: 'El código de seguridad de la tarjeta es incorrecto.',
  incorrect_zip: 'Falló la validación del código postal de la tarjeta.',
  card_declined: 'La tarjeta fué rechazada.',
  missing: 'El cliente al que se está cobrando no tiene tarjeta',
  processing_error: 'Ocurrió un error procesando la tarjeta.',
  rate_limit:
    'Ocurrió un error debido a consultar la API demasiado rápido. Por favor, avísanos si recibes este error continuamente.'
};
dayjs.extend(customParseFormat);

const CONEKTA_KEY = 'key_OoyarHj2pLFPsehY5se6SYw';
// https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
class parent extends React.Component {
  deviceId = Constants.deviceId.replace(/-/g, '');

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadingToken: false,
      currentStep: 1,
      paymentSelection: '3',
      profile: null,
      paymentObj: null,
      token: '',
      loadingMe: true,
      profileMe: null,
      linesDescription: 4
    };
    this.completeStepOne = this.completeStepOne.bind(this);
    this.completeStepTwo = this.completeStepTwo.bind(this);
    this.clickStepHeader = this.clickStepHeader.bind(this);
    this.onChangePaymentType = this.onChangePaymentType.bind(this);
    this.finish = this.finish.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.changelines = this.changelines.bind(this);
  }

  static navigationOptions = ({ navigation, props }) => {
    return {
      headerTitle: (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 0
          }}>
          <Image
            tintColor="white"
            source={
              __DEV__
                ? require('../../assets/images/icons/shopping-cart.png')
                : require('../../assets/images/icons/shopping-cart.png')
            }
            style={{ width: 25, height: 25, tintColor: 'white' }}
          />
          <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>
            Pagar
          </Text>
        </View>
      ),
      headerLeft: () => (
        <HeaderBackButton
          backTitleVisible
          onPress={navigation.getParam('handleBack')}
          titleStyle={{ color: 'white' }}
          tintColor="white"
        />
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

  handleBack() {
    const { currentStep } = this.state;
    if (currentStep > 1) {
      this.setState({ currentStep: currentStep - 1 });
    } else {
      this.props.navigation.goBack();
    }
  }

  async componentDidMount() {
    /*
    const init = await Stripe.setOptionsAsync({
      publishableKey: 'pk_test_9pTXH6NIFb0D9UuxK1vh1dVa005aGrSsra'
    });
    */
    // console.log('entro ', init);

    const uuid = await AsyncStorage.getItem('uuid');
    this.props.navigation.setParams({ handleBack: this.handleBack });

    http
      .get(`me/${uuid}/uuid`)
      .then(result => {
        this.setState({
          loadingMe: false,
          profileMe: result
        });
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingMe: false });
      });
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  tokenizeCard = card =>
    new Promise(async (resolve, reject) => {
      try {
        console.log(JSON.stringify({ card }));
        this.setState({ loadingToken: true });
        const tokenRes = await fetch('https://api.conekta.io/tokens', {
          method: 'POST',
          body: JSON.stringify(card),
          headers: {
            Accept: 'application/vnd.conekta-v0.3.0+json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${Base64.btoa(`${CONEKTA_KEY}:`)}`,
            'Accept-Language': 'en', // TODO: Change this to get language from translation
            'Conekta-Client-User-Agent': JSON.stringify({
              agent: 'Conekta iOS SDK'
            })
          }
        });
        const token = await tokenRes.json();
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });

  completeStepOne(values) {
    console.log(values);
    this.scroll.scrollTo({ x: 0, y: 0, animated: false });
    this.setState({ profile: values, currentStep: 2 });
  }

  async completeStepTwo(values) {
    const { paymentSelection, paymentObj } = this.state;
    const { type } = this.props.navigation.state.params;
    if (paymentSelection === '1' || type === 'anual' || type === 'monthly') {
      let token = null;
      if (type !== 'anual') {
        this.setState({ paymentSelection: 2 });
      }
      if (type === 'anual') {
        token = await this.tokenizeCard({
          card: {
            number: values.number,
            name: values.name,
            exp_year: values.exp.split('/')[1],
            exp_month: values.exp.split('/')[0],
            cvc: values.cvc
          }
        });
        if (token != null) {
          this.setState({
            token: token.id,
            loadingToken: false,
            paymentObj: values,
            currentStep: 3
          });
        }
      } else {
        const card = {
          number: values.number,
          name: values.name,
          exp_year: parseInt(values.exp.split('/')[1], 10),
          exp_month: parseInt(values.exp.split('/')[0], 10),
          cvc: values.cvc
        };
        token = await stripe.createToken({ card });
        // token = await Stripe.createTokenWithCardAsync(card);
        console.log('token', token);
        if (token != null && token.error == null) {
          this.setState({
            token: token.id,
            loadingToken: false,
            paymentObj: values,
            currentStep: 3
          });
        } else {
          Alert.alert('ATENCIÓN', errors[token.error.code], [{ text: 'OK', onPress: () => {} }], {
            cancelable: true
          });
        }
      }
    } else {
      this.setState({ paymentObj: values, currentStep: 3 });
    }
  }

  // https://gist.github.com/AlexHenkel/01e9bc5b0480c273f01815aef9a46776
  clickStepHeader(stepClick) {
    const { currentStep, profile, paymentObj } = this.state;
    if (stepClick == 1 && currentStep != 1) {
      this.scroll.scrollTo({ x: 0, y: 0, animated: false });
      this.setState({ currentStep: 1 });
    } else if (stepClick == 2 && currentStep != 2) {
      if (profile != null) {
        this.scroll.scrollTo({ x: 0, y: 0, animated: false });
        this.setState({ currentStep: 2 });
      }
    } else if (stepClick == 3 && currentStep != 3) {
      if (profile != null) {
        this.scroll.scrollTo({ x: 0, y: 0, animated: false });
        this.setState({ currentStep: 3 });
      }
    }
  }

  onChangePaymentType(type) {
    const { paymentSelection } = this.state;
    if (type != paymentSelection) {
      this.setState({ paymentSelection: type });
    }
  }

  async finish() {
    const { profile, paymentSelection, token, profileMe, loadingToken } = this.state;
    const { insurance, type } = this.props.navigation.state.params;
    const uuid = await AsyncStorage.getItem('uuid');
    Keyboard.dismiss();

    this.setState({ loadingBtn: true });
    const birthday = dayjs(profile.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formData = {
      birthday,
      client_uuid: uuid,
      email: profile.email,
      last_name: profile.last_name,
      name: profile.name,
      payment_methods_id: paymentSelection,
      phone: profileMe.phone,
      postal_code: profile.zip_code,
      product_uuid: insurance.uuid,
      sex: profile.sex,
      state: profile.state,
      zip_code: profile.zip_code,
      token_card: paymentSelection == '1' || type == 'monthly' ? token : ''
    };

    if (type === 'anual') {
      http
        .post('client/charges', formData)
        .then(result => {
          this.setState({ loadingBtn: false });
          Alert.alert(
            'ATENCIÓN',
            result.msg,
            [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('Home')
              }
            ],
            { cancelable: true }
          );
        })

        .catch(error => {
          Alert.alert('Atención !', error);
          this.setState({ loadingBtn: false });
        });
    } else {
      console.log();
      http
        .post('client/subscriptions', formData)
        .then(result => {
          this.setState({ loadingBtn: false });
          Alert.alert(
            'ATENCIÓN',
            result.msg,
            [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('Home')
              }
            ],
            { cancelable: true }
          );
        })

        .catch(error => {
          Alert.alert('Atención !', error);
          this.setState({ loadingBtn: false });
        });
    }
  }

  changelines() {
    console.log('entro');
    const { insurance } = this.props.navigation.state.params;
    const { linesDescription } = this.state;
    if (insurance.description != null) {
      if (linesDescription > 4) {
        this.setState({ linesDescription: 4 });
      } else {
        const value = Math.ceil(insurance.description.length / 38);
        this.setState({ linesDescription: value });
      }
    }
  }

  render() {
    const { insurance, type } = this.props.navigation.state.params;
    const {
      currentStep,
      paymentSelection,
      profile,
      paymentObj,
      loadingToken,
      loadingMe,
      loadingBtn,
      linesDescription
    } = this.state;
    const html = `
      <html>
          <head></head>
          <body>
          <script type="text/javascript" src="https://cdn.conekta.io/js/v1.0.1/conekta.js" data-conekta-public-key="${CONEKTA_KEY}" data-conekta-session-id="${this.deviceId}">
          </script>
          </body>
      </html>`;
    return (
      <View style={{ flex: 1 }}>
        {loadingMe ? (
          <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" animating={loadingMe} />
          </View>
        ) : (
          <View style={Style.container}>
            <View style={Style.containerBackground}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => this.clickStepHeader(1)}>
                  <View
                    style={{
                      borderRadius: 4,
                      backgroundColor: currentStep == 1 ? Colors.primaryColorLight : '#ebebeb',
                      justifyContent: 'center'
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 9,
                        alignSelf: 'center',
                        textAlign: 'center',
                        paddingLeft: 6,
                        paddingRight: 6,
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: Colors.primaryColorLight,
                        backgroundColor: 'transparent',
                        color: currentStep == 1 ? 'white' : Colors.primaryColor,
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: '500'
                      }}>
                      1
                    </Text>
                  </View>
                  <Text allowFontScaling={false} style={{ paddingLeft: 5 }}>
                    Solicitante
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1.4,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => this.clickStepHeader(2)}>
                  <View
                    style={{
                      borderRadius: 4,
                      backgroundColor: currentStep == 2 ? Colors.primaryColorLight : '#ebebeb',
                      justifyContent: 'center'
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 9,
                        textAlign: 'center',
                        paddingLeft: 6,
                        alignSelf: 'center',
                        paddingRight: 6,
                        justifyContent: 'center',
                        borderWidth: 2,
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                        borderColor: Colors.primaryColorLight,
                        color: currentStep == 2 ? 'white' : Colors.primaryColor,
                        borderRadius: 4,
                        fontWeight: '500'
                      }}>
                      2
                    </Text>
                  </View>
                  <Text allowFontScaling={false} style={{ paddingLeft: 5 }}>
                    Metodo de pago
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => this.clickStepHeader(3)}>
                  <View
                    style={{
                      borderRadius: 4,
                      backgroundColor: currentStep == 3 ? Colors.primaryColorLight : '#ebebeb',
                      justifyContent: 'center'
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 9,
                        textAlign: 'center',
                        paddingLeft: 6,
                        alignSelf: 'center',
                        paddingRight: 6,
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: Colors.primaryColorLight,
                        backgroundColor: 'transparent',
                        color: currentStep == 3 ? 'white' : Colors.primaryColor,
                        borderRadius: 4,
                        fontWeight: '500'
                      }}>
                      3
                    </Text>
                  </View>
                  <Text allowFontScaling={false} style={{ paddingLeft: 5 }}>
                    Resumen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <KeyboardAvoidingView keyboardVerticalOffset={64} behavior="padding" enabled>
              <View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  ref={c => {
                    this.scroll = c;
                  }}>
                  <View style={{ marginBottom: 60 }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        textAlign: 'center',
                        alignSelf: 'center',
                        marginTop: 15,
                        fontSize: 16,
                        fontWeight: '500'
                      }}>
                      Sumario
                    </Text>
                    <Card
                      containerStyle={{
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        backgroundColor: Colors.polizaColor,
                        borderRadius: 5,
                        maxHeight: 150 + linesDescription * 13,
                        minHeight: 130
                      }}>
                      <View
                        style={{
                          paddingLeft: 6,
                          paddingRight: 6,
                          paddingTop: 0,
                          paddingBottom: 15,
                          flexDirection: 'column'
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <Image
                              resizeMode="contain"
                              source={{ uri: insurance.icon_url }}
                              style={{ width: 45, height: 45, marginTop: -5 }}
                            />
                          </View>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: 15
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{ fontSize: 15, fontWeight: '500' }}>
                              {insurance.custom_name != null
                                ? insurance.custom_name
                                : insurance.name}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            allowFontScaling={false}
                            numberOfLines={linesDescription}
                            style={{
                              marginTop: 10,
                              fontSize: 14,
                              fontWeight: '300',
                              textAlign: 'justify',
                              color: Colors.textGrayColor
                            }}>
                            {insurance.description}
                          </Text>
                          {insurance.description != null &&
                            Math.ceil(insurance.description.length / 38) > 4 && (
                              <TouchableOpacity onPress={() => this.changelines()}>
                                <View>
                                  <Text style={{ fontSize: 12, marginTop: 5 }}>
                                    {linesDescription == 4 ? 'Ver más' : 'Ver menos'}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 20
                            }}>
                            <Text
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start'
                              }}>
                              {type === 'monthly' ? 'Suscripción mensual' : 'Suscripción anual'}
                            </Text>
                            <NumberFormat
                              style={{
                                textAlign: 'center',
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                              }}
                              value={
                                type === 'monthly'
                                  ? insurance.monthly_price
                                  : insurance.annual_price
                              }
                              displayType="text"
                              thousandSeparator
                              decimalScale={2}
                              prefix="$"
                              fixedDecimalScale
                              renderText={value => (
                                <Text
                                  allowFontScaling={false}
                                  numberOfLines={1}
                                  style={{
                                    marginTop: 0,
                                    fontSize: 16,
                                    color: Colors.primaryColor,
                                    fontWeight: '700'
                                  }}>
                                  {value}
                                  {type === 'monthly' ? '/mes' : '/anual'}
                                </Text>
                              )}
                            />
                          </View>
                        </View>
                      </View>
                    </Card>
                    {currentStep == 1 && (
                      <UserInfoStep
                        nextStep={this.completeStepOne}
                        profile={profile}
                        states={mexico}
                      />
                    )}
                    {currentStep == 2 && profile != null && (
                      <PaymentTypeStep
                        paymentObj={paymentObj}
                        paymentSelection={paymentSelection}
                        onChangePayment={this.onChangePaymentType}
                        nextStep={this.completeStepTwo}
                        loading={loadingToken}
                        singleForm={type}
                      />
                    )}
                    {currentStep == 3 && profile != null && (
                      <SummaryStep
                        profile={profile}
                        type={paymentSelection}
                        payment={paymentObj}
                        pay={this.finish}
                        loading={loadingBtn}
                        typeSuscription={type}
                        suscription={type}
                      />
                    )}
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
            <WebView
              source={{ html, baseUrl: 'web/' }}
              containerStyle={{ height: 0, width: 0, display: 'none' }}
              mixedContentMode="always"
              style={{ backgroundColor: 'transparent' }}
            />
          </View>
        )}
      </View>
    );
  }
}
export default parent;
