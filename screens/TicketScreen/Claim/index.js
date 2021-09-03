import React, { Component } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ShimmerLayout from '../../../components/Shimmer/shimmerLayout';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';
import TextField from '../../../components/Inputs/TextField';
import { http } from '../../../networking/ApiClient';
import Colors from '../../../constants/Colors';
import Style from './styles';

const alarm = require('../../../assets/images/icons/sirena.png');

const validationSchema = yup.object().shape({
  subject_id: yup
    .string()
    .required('Campo requerido')
    .label('Asunto'),
  comment: yup
    .string()
    .required('Campo requerido')
    .label('Comentario')
});

const defaultInitialValues = {
  subject: '',
  comment: ''
};

class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      updateData: null,
      loadingItems: true,
      dropItems: []
    };
  }

  async componentDidMount() {
    const { updateData } = this.props.navigation.state.params;
    this.setState({ updateData });

    http.get('client/claims-subject').then(res => {
      this.setState({
        dropItems: [{ subject: 'Selecciona una opción', id: 0 }, ...res],
        loadingItems: false
      });
      console.log(res);
    });
  }

  async sendClaim(values) {
    const { updateData, dropItems } = this.state;
    this.values = values;

    this.setState({ isLoading: true });
    const client_uuid = await AsyncStorage.getItem('uuid');
    const company_uuid = await AsyncStorage.getItem('company_uuid');

    const formData = {
      client_uuid,
      comment: values.comment,
      company_uuid,
      subject_id: values.subject_id
    };

    console.log(formData);

    http
      .post('client/claims', formData)
      .then(result => {
        this.setState({ isLoading: false });
        Alert.alert(
          'ATENCIÓN',
          result.msg,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: true }
        );
        updateData();
        this.props.navigation.goBack();
      })
      .catch(error => {
        alert(error);
        this.setState({ isLoading: false });
      });
  }

  renderForm() {
    const { isLoading, dropItems, loadingItems } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={Style.container}>
          <Text allowFontScaling={false} style={Style.titleText}>
            Pedir asistencia
          </Text>
          <Text allowFontScaling={false} style={{ textAlign: 'center' }}>
            Completa los siguientes campos
          </Text>
          <View>
            <Formik
              initialValues={defaultInitialValues}
              onSubmit={values => this.sendClaim(values)}
              validationSchema={validationSchema}>
              {({
                handleChange,
                handleSubmit,
                values,
                isValid,
                errors,
                isSubmitting,
                touched,
                setFieldValue
              }) => (
                <View style={{ marginTop: 50 }}>
                  <View style={{ marginRight: 10 }}>
                    <View>
                      <Text allowFontScaling={false} style={Style.label}>
                        Asunto
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
                        items={dropItems.map(obj => ({
                          key: obj.id,
                          label: obj.subject,
                          value: obj.id
                        }))}
                        onValueChange={value => {
                          setFieldValue('subject_id', value);
                        }}
                      />
                    </View>
                    {'subject_id' in errors && (
                      <Text allowFontScaling={false} style={Style.textError}>
                        {errors.subject_id}
                      </Text>
                    )}
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <TextField
                      label="Comentario"
                      labelStyle={[Style.inputLabel, Style.mt16]}
                      inputStyle={Style.formInputLeft}
                      inputContainerStyle={Style.containerInput}
                      editable
                      multiline
                      numberOfLines={4}
                      errorStyle={Style.textError}
                      errorMessage={'comment' in errors && touched.comment ? errors.comment : ''}
                      onChange={handleChange('comment')}
                      value={values.comment}
                    />
                  </View>
                  <View style={{ marginTop: 40 }}>
                    <PrimaryButton text="Enviar" loadingBtn={isLoading} onPress={handleSubmit} />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { isLoading, dropItems, loadingItems } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {loadingItems ? (
          <View style={{ padding: 15 }}>
            <ShimmerLayout lines={15} />
          </View>
        ) : (
          this.renderForm()
        )}
      </View>
    );
  }
}

Claim.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Image source={alarm} style={{ width: 25, height: 25 }} />
      <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>
        Asistencia
      </Text>
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

export default Claim;
