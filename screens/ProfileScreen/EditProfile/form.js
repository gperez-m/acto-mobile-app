import React from 'react';
import {
  View,
  CheckBox,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-elements';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';
import TextField from '../../../components/Inputs/TextField';
import { http } from '../../../networking/ApiClient';

import Style from './styles';
import Colors from '../../../constants/Colors';

class form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      loading: true,
      loadingbtn: false,
      email_valid: true,
      email: '',
      password: '',
      password_valid: true,
      password_confirmation: '',
      password_confirmation_valid: true,
      last_name: '',
      lastname_valid: true,
      phone: '',
      phone_valid: true,
      name: '',
      name_valid: true,
      showPassword: false
    };
    this.onFocus = this.onFocus.bind(this);
    this.passTextInput = null;
    this.validateEmail = this.validateEmail.bind(this);
    this._updateAsync = this._updateAsync.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
  }

  async componentDidMount() {
    const uuid = await AsyncStorage.getItem('uuid');
    http
      .get(`me/${uuid}/uuid`)
      .then(result => {
        this.setState({
          loading: false,
          profile: result,
          name: result.name,
          last_name: result.last_name,
          email: result.email,
          phone: result.phone
        });
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loading: false });
      });
  }

  onChangeCheckbox() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  _updateAsync() {
    const { email, phone, last_name, name, password, password_confirmation } = this.state;
    Keyboard.dismiss();
    this.setState(
      {
        email_valid: this.validateEmail(email),
        lastname_valid: last_name != '',
        name_valid: name != '',
        phone_valid: phone != '',
        password_valid: password != '',
        password_confirmation_valid: !!(
          password_confirmation != '' && password_confirmation == password
        )
      },
      () => this.sendRequest()
    );
  }

  async sendRequest() {
    const {
      email,
      phone,
      last_name,
      name,
      profile,
      password,
      email_valid,
      lastname_valid,
      phone_valid,
      name_valid,
      password_valid,
      password_confirmation,
      password_confirmation_valid,
      showPassword
    } = this.state;
    if (email_valid && lastname_valid && name_valid && phone_valid) {
      const formData = {
        email,
        birthday: profile.birthday,
        last_name,
        name,
        password,
        password_confirmation,
        phone,
        sex: profile.sex,
        user_id: profile.id,
        user_uuid: profile.uuid
      };
      if (showPassword) {
        if (password_valid && password_confirmation_valid) {
          this.request(formData);
        }
      } else {
        this.request(formData);
      }
    } else {
      this.setState({ loadingBtn: false });
    }
  }

  async request(formData) {
    const { loadingBtn } = this.state;
    try {
      this.setState({ loadingBtn: true });
      const result = await http.patch('client/update', formData);
      this.setState({ loadingBtn: false });
      Alert.alert('', result.msg, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
        cancelable: true
      });
      this.props.navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Atención !', error);
      this.setState({ loadingBtn: false });
    }
  }

  onFocus() {
    setFocused(true);
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const {
      loading,
      loadingBtn,
      email_valid,
      name,
      last_name,
      email,
      phone,
      showPassword,
      password_valid,
      password,
      password_confirmation,
      password_confirmation_valid,
      name_valid,
      phone_valid,
      lastname_valid
    } = this.state;
    return (
      <KeyboardAvoidingView style={Style.keyboardContainer} behavior="padding" enabled>
        <ScrollView
          style={{ marginTop: 0 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={Style.container}>
            <View style={[Style.mt10, Style.fullWidth]}>
              <TextField
                value={name}
                label="Nombre"
                labelStyle={Style.inputLabel}
                inputStyle={Style.formInput}
                inputContainerStyle={Style.containerInput}
                returnKeyType="next"
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                errorMessage={name_valid ? null : 'Ingresa tu nombre'}
                onSubmitEditing={() => {
                  this.passwordRef.focus();
                }}
                onChange={name => this.setState({ name })}
              />
            </View>
            <View style={[Style.mt40, Style.fullWidth]}>
              <TextField
                value={last_name}
                label="Apellidos"
                labelStyle={Style.inputLabel}
                inputStyle={Style.formInput}
                inputContainerStyle={Style.containerInput}
                returnKeyType="next"
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                errorMessage={lastname_valid ? null : 'Ingresa tus apellidos'}
                onSubmitEditing={() => {
                  this.passwordRef.focus();
                }}
                onChange={last_name => this.setState({ last_name })}
              />
            </View>
            <View style={[Style.mt40, Style.fullWidth]}>
              <TextField
                value={email}
                label="Correo electrónico"
                labelStyle={Style.inputLabel}
                inputStyle={Style.formInput}
                inputContainerStyle={Style.containerInput}
                returnKeyType="next"
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                errorMessage={email_valid ? null : 'Ingresa un correo valido'}
                onSubmitEditing={() => {
                  this.passwordRef.focus();
                }}
                onChange={email => this.setState({ email })}
              />
            </View>
            <View style={[Style.mt40, Style.fullWidth]}>
              <TextField
                value={phone}
                label="Telefono"
                labelStyle={Style.inputLabel}
                inputStyle={Style.formInput}
                inputContainerStyle={Style.containerInput}
                returnKeyType="next"
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                errorMessage={phone_valid ? null : 'Ingresa un telefono valido'}
                onSubmitEditing={() => {
                  this.passwordRef.focus();
                }}
                onChange={phone => this.setState({ phone })}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20
              }}>
              <Switch
                title="Click Here"
                value={showPassword}
                onValueChange={() => this.onChangeCheckbox()}
              />
              <Text allowFontScaling={false} style={{ marginLeft: 5 }}>Actualizar constraseña</Text>
            </View>
            {showPassword && (
              <View style={{ width: '100%' }}>
                <View style={[Style.mt40, Style.marginSides]}>
                  <TextField
                    value={password}
                    label="Contraseña nueva"
                    labelStyle={Style.inputLabel}
                    inputStyle={Style.formInput}
                    inputContainerStyle={Style.containerInput}
                    returnKeyType="next"
                    errorStyle={{ textAlign: 'center', fontSize: 12 }}
                    errorMessage={password_valid ? null : 'Ingresa una contraseña'}
                    onSubmitEditing={() => {
                      this.passwordRef.focus();
                    }}
                    onChange={password => this.setState({ password })}
                  />
                </View>
                <View style={[Style.mt40, Style.marginSides]}>
                  <TextField
                    value={password_confirmation}
                    label="Confirmar contraseña"
                    labelStyle={Style.inputLabel}
                    inputStyle={Style.formInput}
                    inputContainerStyle={Style.containerInput}
                    returnKeyType="next"
                    errorStyle={{ textAlign: 'center', fontSize: 12 }}
                    errorMessage={
                      password_confirmation_valid ? null : 'Las contraseñas no coinciden'
                    }
                    onSubmitEditing={() => {
                      this.passwordRef.focus();
                    }}
                    onChange={password_confirmation => this.setState({ password_confirmation })}
                  />
                </View>
              </View>
            )}
            <View style={[Style.mt40, Style.fullWidth]}>
              <PrimaryButton
                text="Actualizar"
                loadingBtn={loadingBtn}
                onPress={this._updateAsync}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

form.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0
      }}>
      <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>Actualizar perfil</Text>
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

export default form;
