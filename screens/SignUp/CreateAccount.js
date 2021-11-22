import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Picker,
  Keyboard,
  Dimensions,
  Platform
} from 'react-native';
import { Text, Divider } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { TextInputMask } from 'react-native-masked-text';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { TransparentButton } from '../../components/Buttons/TransparentButton';
import TextField from '../../components/Inputs/TextField';
import { http, Token } from '../../networking/ApiClient';
import Colors from '../../constants/Colors';
import Style from './styles';

// https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maskDate: '',
      maskPhone: '',
      phone_valid: true,
      code: '',
      code_valid: true,
      email: '',
      email_valid: true,
      password: '',
      password_valid: true,
      confirm_password: '',
      confirm_valid: true,
      name: '',
      name_valid: true,
      last_name: '',
      last_name_valid: true,
      gender: 'MAN',
      loadingBtn: false
    };
    this.onFocus = this.onFocus.bind(this);
    this.onTextMaskChange = this.onTextMaskChange.bind(this);
    this.requestCreateAccount = this.requestCreateAccount.bind(this);
    this.onTextPhoneMaskChange = this.onTextPhoneMaskChange.bind(this);
    this.passTextInput = null;
    this._createAccountAsync = this._createAccountAsync.bind(this);
  }

  static navigationOptions = {
    title: 'Sign up'
  };

  async _createAccountAsync() {
    const {
      code,
      code_valid,
      email,
      password,
      password_valid,
      confirm_password,
      confirm_valid,
      email_valid,
      name,
      name_valid,
      last_name,
      last_name_valid,
      gender,
      maskPhone,
      maskDate,
      phone_valid
    } = this.state;

    // await AsyncStorage.setItem('token', 'abc');
    // this.props.navigation.navigate('App');
    Keyboard.dismiss();
    this.setState(
      {
        email_valid: this.validateEmail(email),
        code_valid: code != '',
        password_valid: password.length >= 8,
        confirm_valid: password == confirm_password,
        name_valid: name.length != '',
        last_name_valid: last_name != '',
        phone_valid: maskPhone.length == 14,
        loadingBtn: true
      },
      () => this.requestCreateAccount()
    );
    // this.setState({ email_valid: this.validateEmail(email), password_valid: ((password != null && password != '') ? true : false ) });
    // if((email != null && email != '') && (password != null && password != '') && email_valid){
  }

  async requestCreateAccount() {
    const {
      code,
      code_valid,
      email,
      password,
      password_valid,
      confirm_password,
      confirm_valid,
      email_valid,
      name,
      name_valid,
      last_name,
      last_name_valid,
      gender,
      maskPhone,
      maskDate,
      phone_valid
    } = this.state;

    if (
      email_valid &&
      password_valid &&
      confirm_valid &&
      name_valid &&
      last_name_valid &&
      phone_valid
    ) {
      let splittedDate = maskDate.split('/');
      splittedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      let formData = {};
      if (code_valid) {
        formData = {
          code,
          email,
          password,
          password_confirmation: confirm_password,
          name,
          last_name,
          sex: gender,
          phone: this.phoneField.getRawValue(),
          birthday: splittedDate
        };
      } else {
        formData = {
          email,
          password,
          password_confirmation: confirm_password,
          name,
          last_name,
          sex: gender,
          phone: this.phoneField.getRawValue(),
          birthday: splittedDate
        };
      }

      try {
        const result = await http.post('client/register', formData);
        this.setState({ loadingBtn: false });
        alert(result.msg);
        this.props.navigation.navigate('SignIn');
      } catch (error) {
        alert(error);
        console.error(error)
        this.setState({ loadingBtn: false });
      }
    } else {
      alert('Por favor llene todos los campos');
      this.setState({ loadingBtn: false });
    }
  }

  onFocus() {
    setFocused(true);
  }

  onTextMaskChange(text) {
    this.setState({
      maskDate: text
    });
  }

  onTextPhoneMaskChange(text) {
    if (text.length < 15) {
      this.setState({
        maskPhone: text
      });
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const {
      code_valid,
      loadingBtn,
      email_valid,
      password_valid,
      confirm_valid,
      name_valid,
      last_name_valid
    } = this.state;
    return (
      <ImageBackground
        source={
          __DEV__
            ? require('../../assets/images/background-low.jpg')
            : require('../../assets/images/background-low.jpg')
        }
        imageStyle={{ opacity: 0.05 }}
        style={Style.backgroundLogin}>
        <KeyboardAvoidingView
          style={[Style.keyboardContainer, Style.container]}
          keyboardVerticalOffset={64}
          behavior="padding"
          enabled>
          <View>
            <ScrollView
              style={Style.scrollView}
              contentContainerStyle={Style.scrollViewContainer}
              showsVerticalScrollIndicator={false}>
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
                  REGISTRO
                </Text>
              </View>
              <View style={[Style.mt40, Style.fullWidth]}>
                <TextField
                  label="Código de empresa"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontStyle: 'normal',
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordRef.focus()}
                  onChange={code => this.setState({ code })}
                />
              </View>
              <View style={[Style.mt32, Style.fullWidth]}>
                <TextField
                  label="Correo electrónico"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontStyle: 'normal',
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  errorStyle={{ color: 'red' }}
                  onChange={email => this.setState({ email })}
                  autoCapitalize="none"
                  errorMessage={email_valid ? null : 'Ingresa un correo valido'}
                />
              </View>
              <View style={[Style.mt32, Style.fullWidth]}>
                <TextField
                  label="Contraseña"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontStyle: 'normal',
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  password
                  secureTextEntry
                  errorStyle={{ color: 'red' }}
                  refInner={passwordRef => (this.passwordRef = passwordRef)}
                  onChange={password => this.setState({ password })}
                  errorMessage={
                    password_valid ? null : 'La contraseña debe de tener al menos 8 caracteres'
                  }
                />
              </View>
              <View style={[Style.mt32, Style.fullWidth]}>
                <TextField
                  label="Confirmar contraseña"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontStyle: 'normal',
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  password
                  secureTextEntry
                  errorStyle={{ color: 'red' }}
                  refInner={passwordRef => (this.passwordRef = passwordRef)}
                  onChange={confirm_password => this.setState({ confirm_password })}
                  errorMessage={confirm_valid ? null : 'Las contraseñas no son idénticas'}
                />
              </View>
              <View style={[Style.mt60, Style.fullWidth]}>
                <Divider style={Style.divider} />
              </View>
              <View style={[Style.mt60, Style.fullWidth]}>
                <TextField
                  label="Nombre"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontStyle: 'normal',
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  errorStyle={{ color: 'red' }}
                  refInner={passwordRef => (this.passwordRef = passwordRef)}
                  onChange={name => this.setState({ name })}
                  errorMessage={name_valid ? null : 'Ingrese su nombre'}
                />
              </View>
              <View style={[Style.mt32, Style.fullWidth]}>
                <TextField
                  label="Apellido"
                  labelStyle={{
                    textAlign: 'center',
                    color: Colors.inputLabelColor,
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.044,
                    fontStyle: 'normal',
                    fontWeight: '100'
                  }}
                  inputStyle={Style.formInput}
                  inputContainerStyle={Style.containerInput}
                  errorStyle={{ color: 'red' }}
                  refInner={passwordRef => (this.passwordRef = passwordRef)}
                  onChange={last_name => this.setState({ last_name })}
                  errorMessage={last_name_valid ? null : 'Ingrese su apellido'}
                />
              </View>
              <View style={[Style.mt32, Style.fullWidth, Style.containerTwoItems]}>
                <View style={Style.itemPicker}>
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: Colors.inputLabelColor,
                        fontWeight: '100',
                        paddingTop: 5,
                        textAlign: 'center',
                        marginBottom: Platform.OS === 'ios' ? 30 : 0,
                        fontSize:
                          Platform.OS !== 'ios'
                            ? Dimensions.get('window').width * 0.035
                            : Dimensions.get('window').width * 0.044
                      }}>
                      Sexo
                    </Text>
                  </View>
                  <View>
                    <RNPickerSelect
                      onValueChange={gender => this.setState({ gender })}
                      placeholder={{}}
                      items={[
                        { label: 'Hombre', value: 'MAN' },
                        { label: 'Mujer', value: 'WOMAN' }
                      ]}
                    />
                  </View>
                </View>
                <View style={Style.item}>
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        textAlign: 'center',
                        color: Colors.inputLabelColor,
                        fontWeight: '100',
                        paddingTop: 5,
                        marginBottom: Platform.OS === 'ios' ? 11 : 25,
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
                    value={this.state.maskDate}
                    onChangeText={text => this.onTextMaskChange(text)}
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
                  />
                </View>
              </View>
              <View style={[Style.mt32, Style.fullWidth]}>
                <View>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: 'center',
                      color: Colors.inputLabelColor,
                      fontWeight: '100',
                      paddingTop: 5,
                      marginBottom: Platform.OS === 'ios' ? 14 : 25,
                      fontSize:
                        Platform.OS !== 'ios'
                          ? Dimensions.get('window').width * 0.035
                          : Dimensions.get('window').width * 0.044
                    }}>
                    Telefono
                  </Text>
                </View>
                <TextInputMask
                  type="cel-phone"
                  options={{
                    maskType: 'BRL'
                  }}
                  value={this.state.maskPhone}
                  onChangeText={text => this.onTextPhoneMaskChange(text)}
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 3,
                    borderBottomColor: Colors.bottomDisableColor,
                    textAlign: 'center',
                    fontSize:
                      Platform.OS !== 'ios'
                        ? Dimensions.get('window').width * 0.035
                        : Dimensions.get('window').width * 0.035,
                    marginTop: 3
                  }}
                  ref={ref => (this.phoneField = ref)}
                />
              </View>
              <View style={Style.fullWidth}>
                <TransparentButton
                  text="Login"
                  loading={false}
                  onPress={() => this.props.navigation.navigate('AuthLoading')}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={Style.floatingButton}>
          <PrimaryButton
            text="Registrarme"
            loadingBtn={loadingBtn}
            onPress={this._createAccountAsync}
          />
        </View>
      </ImageBackground>
    );
  }
}
export default CreateAccount;
