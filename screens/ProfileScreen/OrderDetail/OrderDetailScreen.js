import React from 'react';
import {
  Text,
  View,
  Image,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  Share,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import { WebView } from 'react-native-webview';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import { Card } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/Buttons/SecondaryButton';
import { CardMySubscription } from '../../../components/suscripciones/CardMySubscription';
import Colors from '../../../constants/Colors';
import Style from './styles';
import { http } from '../../../networking/ApiClient';
import mexico from '../../../assets/scripts/estados.json';

const verifiedLogo = require('../../../assets/images/icons/verified.png');

class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingOrder: true,
      order: {},
      showWebView: false,
      currentType: '',
      currentPdf: '',
      loadingDownload: false
    };
    this.onClickFormat = this.onClickFormat.bind(this);
    this.onClickTerms = this.onClickTerms.bind(this);
    this.onClickThird = this.onClickThird.bind(this);
    this.onClickFormatCompany = this.onClickFormatCompany.bind(this);
    this.onClickTermsCompany = this.onClickTermsCompany.bind(this);
    this.onClickThirdCompany = this.onClickThirdCompany.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
    this.onClickTicket = this.onClickTicket.bind(this);
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
            marginLeft: -40
          }}>
          <Image tintColor="white" style={{ width: 25, height: 25 }} />
          <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>
            Detalles de la orden
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

  async componentDidMount() {
    const { orderId } = this.props.navigation.state.params;
    const uuid = await AsyncStorage.getItem('uuid');
    this.props.navigation.setParams({ handleBack: this.handleBack });

    http
      .get(`client/${uuid}/${orderId}/order`)
      .then(result => {
        console.log('ORDER DETAIL:');
        console.log(result);
        this.setState({
          loadingOrder: false,
          order: result
        });
      })
      .catch(error => {
        alert(error);
        this.setState({ loadingOrder: false });
      });
  }

  handleBack() {
    const { showWebView } = this.state;
    if (showWebView === true) {
      this.setState({ showWebView: false });
    } else {
      this.props.navigation.goBack();
    }
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

  onClickTerms(index) {
    const { order } = this.state;
    if (order.product.pdf_uno != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_uno,
        currentType: 'instructivo_reclamacion_'
      });
    }
  }

  async onClickTicket() {
    const { order } = this.state;
    const uuid = await AsyncStorage.getItem('uuid');

    if (order.product.pdf_uno != null) {
      this.setState({
        showWebView: true,
        currentPdf: `http://api.acto.apto.solutions/api/v1/client/${uuid}/certificate?order_uuid=${order.uuid}`,
        currentType: 'comprobante_'
      });
    }
  }

  onClickFormat(index) {
    const { order } = this.state;
    if (order.product.pdf_dos != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_dos,
        currentType: 'formato_reclamacion_'
      });
    }
  }

  onClickThird(index) {
    const { order } = this.state;
    if (order.product.pdf_tres != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_tres,
        currentType: 'format_reclamacion_3er_'
      });
    }
  }

  onClickTermsCompany(index) {
    const { order } = this.state;
    if (order.product.pdf_uno != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_uno,
        currentType: 'instructivo_reclamacion_'
      });
    }
  }

  onClickFormatCompany(index) {
    const { order } = this.state;
    if (order.product.pdf_dos != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_dos,
        currentType: 'formato_reclamacion_'
      });
    }
  }

  onClickThirdCompany(index) {
    const { order } = this.state;
    if (order.product.pdf_tres != null) {
      this.setState({
        showWebView: true,
        currentPdf: order.product.pdf_tres,
        currentType: 'format_reclamacion_3er_'
      });
    }
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {
    const { loadingOrder, order, currentPdf, showWebView, loadingDownload } = this.state;

    const STATUS = [
      { key: 'PENDING', name: 'Pendiente', color: '#F57C00' },
      { key: 'PAID_OUT', name: 'Pagado', color: 'green' },
      { key: 'CANCELLED', name: 'Cancelado', color: '#D50000' }
    ];

    const SEX = {
      MAN: 'Hombre',
      WOMAN: 'Mujer'
    };

    const status = STATUS.find(e => e.key === order.status);
    const state = mexico.find(e => e.value === order.state);

    return (
      <View style={Style.container}>
        {showWebView ? (
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
                    source={require('../../../assets/images/icons/download.png')}
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {loadingOrder ? (
              <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" animating={loadingOrder} />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 5,
                    marginLeft: 10,
                    borderRadius: 10
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text allowFontScaling={false} style={Style.boldText}>
                      Estatus:{' '}
                    </Text>
                    <Text allowFontScaling={false} style={{ color: status.color }}>
                      {status.name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text allowFontScaling={false} style={Style.boldText}>
                      Fecha:{' '}
                    </Text>
                    <Text>{dayjs(order.end_date).format('DD/MM/YYYY')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text allowFontScaling={false} style={Style.boldText}>
                      Número de orden:{' '}
                    </Text>
                    <Text>#{order.number_order}</Text>
                  </View>
                </View>
                <Card containerStyle={Style.flatCardItem}>
                  <View style={Style.flatCardTitle}>
                    <Text allowFontScaling={false} style={Style.title}>
                      Datos del Aplicante
                    </Text>
                  </View>
                  <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Nombre:{' '}
                      </Text>
                      <Text>
                        {order.name} {order.last_name}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Email:{' '}
                      </Text>
                      <Text>{order.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Sexo:{' '}
                      </Text>
                      <Text>{SEX[order.sex]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Estado:{' '}
                      </Text>
                      <Text>{state.label}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Codigo Postal:{' '}
                      </Text>
                      <Text>{order.zip_code}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Fecha de Nacimiento:{' '}
                      </Text>
                      <Text>{dayjs(order.birthday).format('DD/MM/YYYY')} </Text>
                    </View>
                  </View>
                </Card>
                <Card containerStyle={Style.flatCardItem}>
                  <View style={Style.flatCardTitle}>
                    <Text allowFontScaling={false} style={Style.title}>
                      Datos de Pago
                    </Text>
                  </View>
                  <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Tipo de Pago:{' '}
                      </Text>
                      <Text>{order.order_payment_method.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text allowFontScaling={false} style={Style.boldText}>
                        Precio:{' '}
                      </Text>
                      {order.product_price != null && order.product_price != '' && (
                        <NumberFormat
                          value={order.product_price}
                          displayType="text"
                          thousandSeparator
                          decimalScale={2}
                          prefix="$"
                          fixedDecimalScale
                          renderText={value => (
                            <Text
                              allowFontScaling={false}
                              numberOfLines={1}
                              style={Style.product_price}>
                              {value}{' '}
                            </Text>
                          )}
                        />
                      )}
                    </View>
                  </View>
                </Card>
                <Card containerStyle={Style.flatCardItem}>
                  <View style={Style.flatCardTitle}>
                    <Text allowFontScaling={false} style={Style.title}>
                      Información del producto
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <View
                        style={{
                          justifyContent: 'flex-end',
                          flex: 1,
                          padding: 15
                        }}>
                        <Text allowFontScaling={false} style={{ textAlign: 'right' }}>
                          Fecha de vencimiento
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{
                            textAlign: 'right',
                            color: Colors.primaryColorLight,
                            fontWeight: '600'
                          }}>
                          {`${dayjs(order.end_date).format('DD/MM/YY')}`}
                        </Text>
                      </View>
                      <View style={{ padding: 0 }}>
                        <View
                          style={[
                            Style.cardItemContainerImage,
                            { paddingLeft: 15, paddingRight: 15 }
                          ]}>
                          <Image
                            source={{ uri: order.product.icon_url }}
                            style={{
                              height: 70,
                              width: 70,
                              alignSelf: 'center'
                            }}
                          />
                        </View>
                        <Text
                          allowFontScaling={false}
                          numberOfLines={2}
                          style={[Style.cardItemName, { paddingLeft: 30, paddingRight: 30 }]}>
                          {order.product.name}
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: 10
                          }}>
                          <PrimaryButton
                            minWidth={130}
                            text="DESCARGAR MI COMPROBANTE"
                            loadingBtn={false}
                            onPress={() => this.onClickTicket(order)}
                          />
                        </View>
                        <Text
                          allowFontScaling={false}
                          style={[
                            Style.cardItemDescription,
                            { paddingLeft: 30, paddingRight: 30 }
                          ]}>
                          {order.product.description}
                        </Text>
                        <View
                          style={[Style.containerCoverage, { paddingLeft: 30, paddingRight: 30 }]}>
                          <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ flex: 2 }}>
                              <Text allowFontScaling={false} style={[Style.simpleText, Style.mt40]}>
                                COBERTURA
                              </Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: -40, marginRight: 5 }}>
                              <Text allowFontScaling={false} style={[Style.simpleText, Style.mt40]}>
                                SUMA ASEGURADA
                              </Text>
                            </View>
                          </View>
                          {order.product.insurance_specs.map((l, i) => (
                            <View key={i} style={{ marginTop: 15 }}>
                              <View class={Style.listRow}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    marginLeft: -10
                                  }}>
                                  <View
                                    style={{
                                      flex: 2,
                                      display: 'flex',
                                      flexDirection: 'row'
                                    }}>
                                    <Image
                                      source={verifiedLogo}
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
                                    <NumberFormat
                                      value={
                                        l.concept != null && l.concept !== '' ? l.concept : '0'
                                      }
                                      displayType="text"
                                      thousandSeparator
                                      decimalScale={2}
                                      prefix="$"
                                      fixedDecimalScale
                                      renderText={value => (
                                        <Text
                                          allowFontScaling={false}
                                          style={{
                                            color: Colors.primaryColorLight
                                          }}>
                                          {value}
                                        </Text>
                                      )}
                                    />
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            marginTop: 25,
                            backgroundColor: '#EDECFF',
                            marginLeft: 0,
                            marginRight: -8,
                            paddingTop: 25,
                            paddingRight: 25,
                            paddingLeft: 25,
                            paddingBottom: 25,
                            marginBottom: 0,
                            borderBottomLeftRadius: 7,
                            borderBottomRightRadius: 7
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{ textAlign: 'center', fontWeight: '400' }}>
                            Instructivo de Reclamación
                          </Text>
                          <SecondaryButton
                            text="Descargar"
                            loadingBtn={false}
                            onPress={() => this.onClickTermsCompany(order)}
                          />
                          <Text
                            allowFontScaling={false}
                            style={{
                              textAlign: 'center',
                              marginTop: 20,
                              fontWeight: '400'
                            }}>
                            Formato de reclamación
                          </Text>
                          <SecondaryButton
                            text="Descargar"
                            loadingBtn={false}
                            onPress={() => this.onClickFormatCompany(order)}
                          />

                          <Text
                            allowFontScaling={false}
                            style={{
                              textAlign: 'center',
                              marginTop: 20,
                              fontWeight: '400'
                            }}>
                            Instructivo
                          </Text>
                          <PrimaryButton
                            text="Descargar"
                            loadingBtn={false}
                            onPress={() => this.onClickThirdCompany(order)}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

export default OrderScreen;
