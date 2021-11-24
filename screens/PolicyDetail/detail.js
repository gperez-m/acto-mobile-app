import React from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Share,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Card } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import NumberFormat from 'react-number-format';
import { HeaderBackButton } from 'react-navigation';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { http } from '../../networking/ApiClient';
import { CardSuscripcion } from '../../components/suscripciones/CardSuscripcion';

import Style from './styles';
import Colors from '../../constants/Colors';

const logoVerified = require('../../assets/images/icons/verified.png');

class detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingInsurance: true,
      policy: {},
      showWebView: false,
      currentPdf: '',
      currentType: '',
      loadingDownload: false
    };
    this.onClick = this.onClick.bind(this);
    this.onClickFormat = this.onClickFormat.bind(this);
    this.onClickTerms = this.onClickTerms.bind(this);
    this.onClickThird = this.onClickThird.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  static navigationOptions = ({ navigation, props }) => {
    return {
      headerStyle: {
        backgroundColor: Colors.primaryColor
      },
      headerLeft: () => (
        <HeaderBackButton
          backTitleVisible
          onPress={navigation.getParam('handleBack')}
          titleStyle={{ color: 'white' }}
          tintColor="white"
        />
      ),
      headerTintColor: 'white',
      headerVisible: true
    };
  };

  handleBack() {
    const { showWebView } = this.state;
    if (showWebView === true) {
      this.setState({ showWebView: false });
    } else {
      this.props.navigation.goBack();
    }
  }

  onClickTerms() {
    const { policy } = this.state;
    if (policy.pdf_uno !== null) {
      this.setState({
        showWebView: true,
        currentPdf: policy.pdf_uno,
        currentType: 'instructivo_reclamacion_'
      });
    } else {
      Alert.alert(
        'Alerta',
        'Archivo no disponible',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  onClickFormat() {
    const { policy } = this.state;
    if (policy.pdf_dos !== null) {
      this.setState({
        showWebView: true,
        currentPdf: policy.pdf_dos,
        currentType: 'formato_reclamacion_'
      });
    } else {
      Alert.alert(
        'Alerta',
        'Archivo no disponible',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  onClickThird() {
    const { policy } = this.state;
    if (policy.pdf_tres !== null) {
      this.setState({
        showWebView: true,
        currentPdf: policy.pdf_tres,
        currentType: 'format_reclamacion_3er_'
      });
    } else {
      Alert.alert(
        'Alerta',
        'Archivo no disponible',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  async componentDidMount() {
    const { showWebView } = this.state;
    const { policyId } = this.props.navigation.state.params;
    const uuid = await AsyncStorage.getItem('uuid');
    this.props.navigation.setParams({ handleBack: this.handleBack });

    http
      .get(`client/${uuid}/products/${policyId}`)
      .then(result => {
        console.log('--------------DETAIL--------------');
        console.log(result, 140);
        this.setState(
          {
            loadingInsurance: false,
            policy: result
          },
          () => console.log(this.state.InsutancesList)
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingInsurance: false });
      });
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  onClick(e, policy) {
    console.log(e);
    this.props.navigation.navigate('Checkout', {
      insurance: policy,
      type: e
    });
  }

  handleBackButtonClick() {
    const { showWebView } = this.state;
    if (showWebView === true) {
      this.setState({ showWebView: false });
      return false;
    }
    this.props.navigation.goBack(); // works best when the goBack is async
    return true;
  }

  async downloadPDF() {
    const { currentPdf, currentType } = this.state;
    if (currentPdf != null) {
      this.setState({ loadingDownload: true });
      FileSystem.downloadAsync(currentPdf, `${FileSystem.documentDirectory}${currentType}.pdf`)
        .then(({ uri }) => {
          this.setState({ loadingDownload: false });
          Share.share(
            {
              // message: "test message",
              title: 'Archivo',
              // Picture of Ashton Kutcher
              url: uri
            },
            {
              tintColor: Colors.primaryColor
            }
          );
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  renderList() {
    const { policy, showWebView, currentPdf, loadingDownload } = this.state;
    return showWebView ? (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            width: 'auto',
            height: 65
          }}>
          <TouchableOpacity
            onPress={this.downloadPDF}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.primaryColor,
              padding: 15,
              zIndex: 2,
              borderRadius: 25,
              margin: 5
            }}>
            {loadingDownload ? (
              <View>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Image
                tintColor={Colors.primaryColor}
                source={require('../../assets/images/icons/download.png')}
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 0,
                  tintColor: 'white'
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <WebView
          source={{
            uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${currentPdf}`
          }}
          useWebKit
          originWhitelist={['file://*', 'http://*', 'https://*']}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          style={{ flex: 1 }}
        />
      </View>
    ) : (
      <View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={[Style.flatCardPrice, { backgroundColor: policy.colour_app }]}>
              <Text
                allowFontScaling={false}
                style={{
                  color: 'white',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  marginLeft: 15
                }}>
                <NumberFormat
                  value={policy.annual_price / 12}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  prefix="$"
                  fixedDecimalScale
                  renderText={value => (
                    <Text allowFontScaling={false} numberOfLines={1} style={Style.price}>
                      {'Desde '}
                      {value}
                      {' pesos '}
                    </Text>
                  )}
                />
                mensuales
              </Text>
            </View>
            <View>
              <View style={Style.containerInfo}>
                <View class={Style.containerCover}>
                  {policy.photo_url != null && (
                    <Image
                      source={{ uri: policy.photo_url }}
                      style={[Style.coverPolicyImg, Style.mt10]}
                    />
                  )}
                </View>
                <Text allowFontScaling={false} style={[Style.name, Style.mt30]}>
                  {policy.custom_name != null ? policy.custom_name : policy.name}
                </Text>
                <Text allowFontScaling={false} style={[Style.description, Style.mt20]}>
                  {policy.description}
                </Text>
                <View style={Style.containerCoverage}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text allowFontScaling={false} style={[Style.simpleText, Style.mt40]}>
                        COBERTURA
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 0 }}>
                      <Text allowFontScaling={false} style={[Style.simpleText, Style.mt40]}>
                        SUMA ASEGURADA
                      </Text>
                    </View>
                  </View>
                  {policy.insurance_specs.map((l, i) => (
                    <View key={i} style={{ marginTop: 15 }}>
                      <View class={Style.listRow}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            marginLeft: 0
                          }}>
                          <View
                            style={{
                              flex: 2,
                              display: 'flex',
                              flexDirection: 'row'
                            }}>
                            <Image
                              source={logoVerified}
                              resizeMode="contain"
                              style={{
                                flex: 0.2,
                                height: 15,
                                width: 15,
                                tintColor: Colors.primaryColor
                              }}
                            />
                            <Text
                              allowFontScaling={false}
                              style={{ flex: 0.8 }}>{`${l.name}`}</Text>
                          </View>
                          <View style={{ flex: 1, marginLeft: 20 }}>
                            <Text
                              allowFontScaling={false}
                              style={{ color: Colors.primaryColorLight }}>
                              {l.concept != null && l.concept !== '' ? l.concept : '0'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                <View class={Style.containerCover}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: policy.icon_url }}
                    style={Style.policyImg}
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#ebebeb',
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: 20,
                  padding: 2
                }}>
                <Text allowFontScaling={false} style={[Style.name, Style.mt30]}>
                  Suscripciones
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#e9e9e9',
                      marginTop: 15,
                      maxWidth: '75%'
                    }}>
                    <CardSuscripcion
                      policy={policy}
                      title="SUSCRIPCIÓN POR"
                      months={12}
                      arrayOfColors={['#1401f0', '#050c9c']}
                      anual
                      only={policy.plan_id == null}
                      priceColor={Colors.primaryColorLight}
                      monthPrice={policy.annual_price %12 === 0 ? (policy.annual_price / 12) : (policy.annual_price / 12).toFixed(2)}
                      anualPrice={policy.annual_price}
                      description="*Pago en un sola exhibición"
                      firstDescription="UN SOLO PAGO DE "
                      finalDescription=""
                      click={(e, item) => this.onClick(e, item)}
                    />
                  </View>
                  {policy.plan_id != null &&
                    policy.monthly_price != null &&
                    policy.monthly_price > 0 && (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#e9e9e9',
                          marginTop: 15
                        }}>
                        <CardSuscripcion
                          policy={policy}
                          title="SUSCRIPCIÓN"
                          months={1}
                          only={policy.plan_id == null}
                          arrayOfColors={['#254B8C', '#254B8C']}
                          anual={false}
                          priceColor="#000000"
                          monthPrice={policy.monthly_price}
                          anualPrice={policy.monthly_price * 12}
                          description="*Cobro mensual recurrente."
                          finalDescription="Cancela cuando quieras"
                          firstDescription="PAGO MENSUAL"
                          click={(e, item) => this.onClick(e, item)}
                        />
                      </View>
                    )}
                </View>
              </View>

              <View style={Style.mt10}>
                <View style={Style.centerItems}>
                  <Text allowFontScaling={false} style={[Style.simpleTextJutify, Style.mt40]}>
                    Términos y condiciones
                  </Text>
                  {/*
                    <Text allowFontScaling={false} style={Style.justifyText}>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </Text>
                    */}
                </View>
                <View style={Style.centerItems}>
                  <View
                    style={{
                      paddingTop: 10,
                      width: 350,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <SecondaryButton
                      text="Descargar"
                      loadingBtn={false}
                      onPress={() => this.onClickTerms()}
                    />
                  </View>
                </View>
              </View>
              <View style={Style.mt10}>
                <View style={Style.centerItems}>
                  <Text allowFontScaling={false} style={[Style.simpleTextJutify, Style.mt40]}>
                    Formato de reclamación
                  </Text>
                  {/*
                  <Text allowFontScaling={false} style={Style.justifyText}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </Text>
                    */}
                </View>
                <View style={Style.centerItems}>
                  <View
                    style={{
                      paddingTop: 10,
                      width: 350,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <SecondaryButton
                      text="Descargar"
                      loadingBtn={false}
                      onPress={() => this.onClickFormat()}
                    />
                  </View>
                </View>
              </View>
              <View style={Style.mt10}>
                <View style={Style.centerItems}>
                  <Text allowFontScaling={false} style={[Style.simpleTextJutify, Style.mt40]}>
                    Instructivo
                  </Text>
                  {/*
                  <Text allowFontScaling={false} style={Style.justifyText}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </Text>
                    */}
                </View>
                <View style={Style.centerItems}>
                  <View
                    style={{
                      paddingTop: 10,
                      width: 350,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <SecondaryButton
                      text="Descargar"
                      loadingBtn={false}
                      onPress={() => this.onClickThird()}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/*
        <View style={Style.floatingButton}>
          <View style={Style.containerButton}>
            <PrimaryButton
              text="Comprar suscripción"
              minWidth={300}
              loadingBtn={false}
              onPress={() =>
                this.props.navigation.navigate('Checkout', {
                  insurance: policy
                })
              }
            />
          </View>
        </View>
            */}
      </View>
    );
  }

  render() {
    const { loadingInsurance, policy, showWebView } = this.state;
    return loadingInsurance ? (
      <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={loadingInsurance} />
      </View>
    ) : (
      this.renderList()
    );
  }
}
export default detail;
