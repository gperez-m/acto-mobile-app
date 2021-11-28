import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { Text } from 'react-native-elements';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { TransparentButton } from '../../components/Buttons/TransparentButton';
import TextField from '../../components/Inputs/TextField';
import { http } from '../../networking/ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Style from './styles';
import Colors from '../../constants/Colors';

// https://github.com/react-native-elements/react-native-elements-app/blob/master/src/views/login/screen1.js
// https://medium.com/better-programming/handling-api-like-a-boss-in-react-native-364abd92dc3d
// https://facebook.github.io/react-native/docs/network
// https://github.github.io/fetch/
// https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingBtn: false,
      email_valid: true,
      email: '',
      password: '',
      password_valid: true
    };
    this.onFocus = this.onFocus.bind(this);
    this.passTextInput = null;
    // this.signIn = this.signIn.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this._signInAsync = this._signInAsync.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  // http://kimeowgee.com/2018/10/react-native-user-login-sign-up-example-tutorial/
  async _signInAsync() {
    const { email, password, email_valid } = this.state;
    Keyboard.dismiss();
    this.setState({
      email_valid: this.validateEmail(email),
      password_valid: !!(password != null && password != '')
    });
    if (email != null && email != '' && (password != null && password != '') && email_valid) {
      this.setState({ loadingBtn: true });
      const formData = {
        email,
        password
      };
      // aguilera51284@gmail.com
      try {
        const result = await http.post('login', formData);
        this.setState({ loadingBtn: false });
        if (result.user.rol_id == 3) {
          await AsyncStorage.setItem('token', result.access_token);
          await AsyncStorage.setItem('uuid', result.user.uuid);
          await AsyncStorage.setItem('company_uuid', result.user.company.uuid);
          await AsyncStorage.setItem('company_logo', result.user.company.photo_url||'');
          this.props.navigation.navigate('App');
        } else if(result.user) {
          alert('El usuario ingresado no cuenta con los permisos suficientes');
        } else {
          alert('Verique los datos ingresados');
        }
      } catch (error) {
        Alert.alert('Atención !', error);
        this.setState({ loadingBtn: false });
      }
    }
  }

  onChange(value) {
    this.setState({ email_valid: true, email: value });
  }

  onChangePassword(value) {
    this.setState({ password_valid: true, password: value });
  }

  onFocus() {
    setFocused(true);
  }

  // https://gellerj496howto.wordpress.com/mobile-registration/
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const { loadingBtn, email_valid } = this.state;
    return (
      <ImageBackground
        source={
          __DEV__
            ? require('../../assets/images/background-low.jpg')
            : require('../../assets/images/background-low.jpg')
        }
        imageStyle={{ opacity: 0.05 }}
        style={Style.backgroundLogin}>
        <KeyboardAvoidingView style={Style.keyboardContainer} behavior="padding" enabled>
          <ScrollView style={{ marginTop: 20 }} keyboardShouldPersistTaps="handled">
            <View style={Style.container}>
              <Image
                tintColor="black"
                source={
                  __DEV__
                    ? require('../../assets/images/new_logo.png')
                    : require('../../assets/images/new_logo.png')
                }
                style={Style.logo}
              />
              <View style={Style.mt16}>
                <Text allowFontScaling={false} style={Style.subtitle}>
                  LOGIN
                </Text>
              </View>
              <View style={[Style.mt40, Style.fullWidth]}>
                <TextField
                  label="Correo electrónico"
                  labelStyle={{
                    textAlign: 'center',
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
                  errorMessage={email_valid ? null : 'Ingresa un correo valido'}
                  onSubmitEditing={() => {
                    this.passwordRef.focus();
                  }}
                  onChange={email => {
                    this.onChange(email);
                  }}
                />
              </View>
              <View style={[Style.mt16, Style.fullWidth]}>
                <TextField
                  label="Contraseña"
                  labelStyle={{
                    textAlign: 'center',
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
                  password
                  secureTextEntry
                  errorStyle={{ textAlign: 'center', fontSize: 12 }}
                  errorMessage={email_valid ? null : 'Ingresa una contraseña'}
                  refInner={passwordRef => (this.passwordRef = passwordRef)}
                  onChange={value => this.onChangePassword(value)}
                />
              </View>
              <View style={[Style.mt40, Style.fullWidth]}>
                <PrimaryButton text="Entrar" loadingBtn={loadingBtn} onPress={this._signInAsync} />
              </View>
              <View style={Style.fullWidth}>
                <SecondaryButton
                  text="Nuevo cliente"
                  loading={false}
                  onPress={() => this.props.navigation.navigate('SignUp')}
                />
              </View>
              <View style={Style.fullWidth}>
                <TransparentButton
                  fontColor={Colors.primaryColor}
                  text="¿Olvidaste tu contraseña?"
                  loading={false}
                  onPress={() => this.props.navigation.navigate('ForgotPassword')}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
export default SignInScreen;
