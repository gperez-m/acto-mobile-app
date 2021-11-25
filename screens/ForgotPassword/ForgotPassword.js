import React from 'react';
import { View, Image, ImageBackground, KeyboardAvoidingView, Keyboard, Alert, Dimensions,Platform } from 'react-native';
import { Text } from 'react-native-elements';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { TransparentButton } from '../../components/Buttons/TransparentButton';
import TextField from '../../components/Inputs/TextField';
import { http } from '../../networking/ApiClient';
import Colors from '../../constants/Colors';
import Style from './styles';

// https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingBtn: false,
      email_valid: true,
      email: ''
    };
    this.onChange = this.onChange.bind(this);
    this._recoverPassword = this._recoverPassword.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  onChange(value) {
    this.setState({ email_valid: true, email: value });
  }

  async _recoverPassword() {
    const { email, email_valid } = this.state;
    Keyboard.dismiss();
    this.setState({ email_valid: this.validateEmail(email) });
    if (email != null && email != '' && email_valid) {
      this.setState({ loadingBtn: true });
      const formData = {
        email
      };
      // aguilera51284@gmail.com
      http
        .post('recover-password', formData)
        .then(result => {
          this.setState({ loadingBtn: false });
          Alert.alert(
            'ATENCIÓN',
            result.msg,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
          );
          this.props.navigation.navigate('SignIn');
        })
        .catch(error => {
          Alert.alert('Atención !', error);
          this.setState({ loadingBtn: false });
        });
    }
    // this.props.navigation.navigate('AuthLoading')
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
                Recuperar contraseña
              </Text>
            </View>
            <View style={[Style.mt40, Style.fullWidth]}>
              <TextField
                label="¿Olvidaste tu contraseña?"
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
                onChange={value => this.onChange(value)}
              />
            </View>
            <View style={[Style.mt40, Style.fullWidth]}>
              <PrimaryButton
                text="Recuperar"
                loadingBtn={loadingBtn}
                onPress={this._recoverPassword}
              />
            </View>
            <View style={Style.fullWidth}>
              <TransparentButton
                text="Login"
                loading={false}
                onPress={() => this.props.navigation.navigate('SignIn')}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
export default ForgotPassword;
