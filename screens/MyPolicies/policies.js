import React from 'react';
import dayjs from 'dayjs';
import toObject from 'dayjs/plugin/toObject';
import { Card, Button } from 'react-native-elements';

import {
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  alert,
  TouchableOpacity,
  BackHandler,
  Share,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { HeaderBackButton } from 'react-navigation';
import NumberFormat from 'react-number-format';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { CardSuscripcion } from '../../components/suscripciones/CardSuscripcion';
import { CardMySubscription } from '../../components/suscripciones/CardMySubscription';

import { http } from '../../networking/ApiClient';
import Style from './styles';
import Colors from '../../constants/Colors';

dayjs.extend(toObject);

const verifiedLogo = require('../../assets/images/icons/verified.png');
const policyIcon = require('../../assets/images/icons/policy.png');

class policies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InsurancesList: [],
      VoluntaryList: [],
      loading: true,
      showWebView: false,
      currentPdf: '',
      currentType: '',
      policy: {},
      loadingVoluntary: false,
      loadingDownload: false
    };
    this.getMonthlySuscriptions = this.getMonthlySuscriptions.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClickFormat = this.onClickFormat.bind(this);
    this.onClickTerms = this.onClickTerms.bind(this);
    this.onClickThird = this.onClickThird.bind(this);
    this.onClickFormatCompany = this.onClickFormatCompany.bind(this);
    this.onClickTermsCompany = this.onClickTermsCompany.bind(this);
    this.onClickThirdCompany = this.onClickThirdCompany.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getData = this.getData.bind(this);
    this.onChangePaymentMethod = this.onChangePaymentMethod.bind(this);
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
      headerTintColor: Colors.primaryColor,
      headerVisible: true
    };
  };

  async getAll(msg) {
    const uuid = await AsyncStorage.getItem('uuid');
    this.props.navigation.setParams({ handleBack: this.handleBack });
    Alert.alert('ATENCIÓN', msg, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
      cancelable: false
    });

    http
      .get(`client/${uuid}/products/company?limit=100000`)
      .then(result => {
        this.setState(
          {
            loading: false,
            InsurancesList: result.data
          },
          () => console.log(this.state.InsutancesList)
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loading: false });
      });

    this.getMonthlySuscriptions(uuid);
  }

  async getData() {
    const uuid = await AsyncStorage.getItem('uuid');
    this.props.navigation.setParams({ handleBack: this.handleBack });

    http
      .get(`client/${uuid}/products/company?limit=100000`)
      .then(result => {
        this.setState(
          {
            loading: false,
            InsurancesList: result.data
          },
          () => console.log(this.state.InsutancesList)
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loading: false });
      });

    this.getMonthlySuscriptions(uuid);
  }

  async componentDidMount() {
    const { showWebView } = this.state;
    // this.getData();
  }

  componentWillMount() {
    this.getData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
    const { InsurancesList } = this.state;
    if (InsurancesList[index].product.pdf_uno != null) {
      this.setState({
        showWebView: true,
        currentPdf: InsurancesList[index].product.pdf_uno,
        currentType: 'instructivo_reclamacion_'
      });
    }
  }

  onClickFormat(index) {
    const { InsurancesList } = this.state;
    if (InsurancesList[index].product.pdf_dos != null) {
      this.setState({
        showWebView: true,
        currentPdf: InsurancesList[index].product.pdf_dos,
        currentType: 'formato_reclamacion_'
      });
    }
  }

  onClickThird(index) {
    const { InsurancesList } = this.state;
    if (InsurancesList[index].product.pdf_tres != null) {
      this.setState({
        showWebView: true,
        currentPdf: InsurancesList[index].product.pdf_tres,
        currentType: 'format_reclamacion_3er_'
      });
    }
  }

  onClickTermsCompany(index) {
    const { VoluntaryList } = this.state;
    if (VoluntaryList[index].product.pdf_uno != null) {
      this.setState({
        showWebView: true,
        currentPdf: VoluntaryList[index].product.pdf_uno,
        currentType: 'instructivo_reclamacion_'
      });
    }
  }

  onClickFormatCompany(index) {
    const { VoluntaryList } = this.state;
    if (VoluntaryList[index].product.pdf_dos != null) {
      this.setState({
        showWebView: true,
        currentPdf: VoluntaryList[index].product.pdf_dos,
        currentType: 'formato_reclamacion_'
      });
    }
  }

  onClickThirdCompany(index) {
    const { VoluntaryList } = this.state;
    if (VoluntaryList[index].product.pdf_tres != null) {
      this.setState({
        showWebView: true,
        currentPdf: VoluntaryList[index].product.pdf_tres,
        currentType: 'format_reclamacion_3er_'
      });
    }
  }

  onClick(subscription_id) {
    Alert.alert(
      'ATENCIÓN',
      '¿Estas seguro que deseas cancelar la suscripción?',
      [
        {
          text: 'Regresar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Cancelar suscripción',
          onPress: () => {
            this.setState({ loading: true });
            http
              .post('client/subscriptions/cancel', { subscription_id })
              .then(result => {
                this.setState(
                  {
                    loading: false
                  },
                  () => this.getAll(result.msg)
                );
              })
              .catch(error => {
                Alert.alert('Atención !', error);
                this.setState({ loading: false });
              });
          }
        }
      ],
      { cancelable: true }
    );
  }

  getMonthlySuscriptions(uuid) {
    this.setState({ loadingVoluntary: true });
    http
      .get(
        'activeSuscriptions',
        {},
        {
          'status[1]': 'active',
          'status[0]': 'trialing'
        }
      )
      .then(result => {
        this.setState(
          {
            VoluntaryList: result.data,
            loadingVoluntary: false
          },
          () => this.getVoluntaryPolicies(uuid)
        );
      })
      .catch(error => {
        // alert(error);
        console.log('--------------ERROR----------', error);
        this.setState({ loadingVoluntary: false });
        this.setState({ loading: false });
      });
  }

  getVoluntaryPolicies(uuid) {
    const { VoluntaryList } = this.state;
    this.setState({ loadingVoluntary: true });
    http
      .get(`client/${uuid}/history/orders-active`)
      .then(result => {
        this.setState({
          VoluntaryList: [...VoluntaryList, ...result.data],
          loadingVoluntary: false
        });
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingVoluntary: false });
        this.setState({ loading: false });
      });
  }

  onChangePaymentMethod(subscription_id) {
    this.props.navigation.navigate('UpdateMethod', {
      subscription_id,
      getData: () => this.getData()
    });
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
          Alert.alert('Atención !', error);
        });
    }
  }

  renderList() {
    const {
      InsurancesList,
      loading,
      VoluntaryList,
      currentPdf,
      showWebView,
      loadingDownload,
      loadingVoluntary
    } = this.state;
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
      <View style={Style.container}>
        {!loading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 20
                }}>
                <View style={Style.leftLine} />
                <Text allowFontScaling={false} style={Style.centerLine}>
                  Suscripciones de empresa
                </Text>
                <View style={Style.rightLine} />
              </View>
              <FlatList
                contentContainerStyle={{ paddingBottom: 50 }}
                data={InsurancesList}
                renderItem={({ index, item }) => (
                  <View key={index} style={Style.flatListView}>
                    <Card containerStyle={Style.flatCardItem}>
                      <View>
                        <View style={{ padding: 15 }}>
                          <View style={Style.cardItemContainerImage}>
                            <Image
                              source={{ uri: item.product.icon_url }}
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
                            style={Style.cardItemName}>
                            {item.custom_name != null ? item.custom_name : item.product.name}
                          </Text>
                          <Text
                            allowFontScaling={false}
                            numberOfLines={2}
                            style={Style.cardItemDescription}>
                            {item.product.description}
                          </Text>
                          <View style={Style.containerCoverage}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                              <View style={{ flex: 2 }}>
                                <Text
                                  allowFontScaling={false}
                                  style={[Style.simpleText, Style.mt40]}>
                                  COBERTURA
                                </Text>
                              </View>
                              <View style={{ flex: 1, marginLeft: -40 }}>
                                <Text
                                  allowFontScaling={false}
                                  style={[Style.simpleText, Style.mt40]}>
                                  SUMA ASEGURADA
                                </Text>
                              </View>
                            </View>
                            {item.product.insurance_specs.map(l => (
                              <View key={l.id} style={{ marginTop: 10, marginLeft: 10 }}>
                                <View class={Style.listRow}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '100%',
                                      marginLeft: -20
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
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          color: Colors.primaryColorLight
                                        }}>
                                        {l.concept != null && l.concept !== '' ? l.concept : '0'}
                                      </Text>
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
                              marginTop: 40,
                              backgroundColor: '#EEFFF0',
                              marginLeft: -30,
                              marginRight: -30,
                              padding: 25,
                              marginBottom: -30,
                              borderBottomLeftRadius: 15,
                              borderBottomRightRadius: 15
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{ textAlign: 'center', fontWeight: '400' }}>
                              Instructivo de Reclamación
                            </Text>
                            <SecondaryButton
                              text="Descargar"
                              loadingBtn={false}
                              onPress={() => this.onClickTerms(index)}
                            />
                            <Text
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
                              onPress={() => this.onClickFormat(index)}
                            />
                            <Text
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
                              onPress={() => this.onClickThird(index)}
                            />
                          </View>
                        </View>
                      </View>
                    </Card>
                  </View>
                )}
                // Setting the number of column
                numColumns={1}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 0
                }}>
                <View style={Style.leftLine} />
                <Text allowFontScaling={false} style={Style.centerLine}>
                  Suscripciones personales
                </Text>
                <View style={Style.rightLine} />
              </View>
              {loadingVoluntary ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40
                  }}>
                  <ActivityIndicator size="large" color="#0000ff" animating={loadingVoluntary} />
                </View>
              ) : (
                <FlatList
                  contentContainerStyle={{ paddingBottom: 50 }}
                  data={VoluntaryList}
                  renderItem={({ index, item }) => (
                    <View key={item.id} style={Style.flatListView}>
                      <Card key={item.id} containerStyle={[Style.flatCardItem, { padding: 0 }]}>
                        <View>
                          <View style={{ justifyContent: 'flex-end', flex: 1, padding: 15 }}>
                            <Text allowFontScaling={false} style={{ textAlign: 'right' }}>
                              {item.subscription_stripe_id != null
                                ? 'Próximo cobro'
                                : 'Fecha de vencimiento'}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={{
                                textAlign: 'right',
                                color: Colors.primaryColorLight,
                                fontWeight: '600'
                              }}>
                              {item.status === 'canceled'
                                ? 'Cancelada'
                                : `${dayjs(item.current_period_end).format('DD/MM/YY')}`}
                            </Text>
                          </View>
                          <View style={{ padding: 0 }}>
                            <View
                              style={[
                                Style.cardItemContainerImage,
                                { paddingLeft: 15, paddingRight: 15 }
                              ]}>
                              <Image
                                source={{ uri: item.product.icon_url }}
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
                              {item.product.name}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              numberOfLines={2}
                              style={[
                                Style.cardItemDescription,
                                { paddingLeft: 30, paddingRight: 30 }
                              ]}>
                              {item.product.description}
                            </Text>
                            <View
                              style={[
                                Style.containerCoverage,
                                { paddingLeft: 30, paddingRight: 30 }
                              ]}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{ flex: 2 }}>
                                  <Text
                                    allowFontScaling={false}
                                    style={[Style.simpleText, Style.mt40]}>
                                    COBERTURA
                                  </Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: -40, marginRight: 5 }}>
                                  <Text
                                    allowFontScaling={false}
                                    style={[Style.simpleText, Style.mt40]}>
                                    SUMA ASEGURADA
                                  </Text>
                                </View>
                              </View>
                              {item.product.insurance_specs.map((l, i) => (
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
                            {item.subscription_stripe_id != null && (
                              <View
                                style={{
                                  backgroundColor: '#f2ffee',
                                  width: '100%',
                                  marginTop: 10
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    backgroundColor: '#f2ffee',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,
                                      marginTop: 15,
                                      maxWidth: '80%'
                                    }}>
                                    <CardMySubscription
                                      policy={item}
                                      title="SUSCRIPCIÓN"
                                      months={1}
                                      arrayOfColors={['#1401f0', '#050c9c']}
                                      subscription_stripe_id={item.subscription_stripe_id}
                                      priceColor="#333"
                                      monthPrice={item.product.monthly_price}
                                      anualPrice={item.annual_price}
                                      description="*Pago en un sola exhibición"
                                      firstDescription="UN SOLO PAGO DE "
                                      finalDescription=""
                                      click={(e, l) => this.onClick(e, l)}
                                      changeMethod={() =>
                                        this.onChangePaymentMethod(item.subscription_stripe_id)
                                      }
                                      cardName={JSON.parse(item.card).brand}
                                      cardNumber={JSON.parse(item.card).last4}
                                      hideCancelButton={item.status === 'canceled'}
                                      canceledDate={item.date_canceled}
                                      current_period_end={item.current_period_end}
                                    />
                                  </View>
                                </View>
                              </View>
                            )}

                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                marginTop: item.subscription_stripe_id != null ? 0 : 25,
                                backgroundColor: '#EDECFF',
                                marginLeft: 0,
                                marginRight: 0,
                                paddingTop: 25,
                                paddingRight: 25,
                                paddingLeft: 25,
                                paddingBottom: 25,
                                marginBottom: 0,
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 15
                              }}>
                              <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontWeight: '400' }}>
                                Instructivo de Reclamación
                              </Text>
                              <SecondaryButton
                                text="Descargar"
                                loadingBtn={false}
                                onPress={() => this.onClickTermsCompany(index)}
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
                                onPress={() => this.onClickFormatCompany(index)}
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
                                onPress={() => this.onClickThirdCompany(index)}
                              />
                            </View>
                          </View>
                        </View>
                      </Card>
                    </View>
                  )}
                  // Setting the number of column
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" animating={loading} />
          </View>
        )}
      </View>
    );
  }

  render() {
    const { InsurancesList, loading, VoluntaryList, loadingInsurance } = this.state;
    return loading ? (
      <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={loading} />
      </View>
    ) : (
      this.renderList()
    );
  }
}
export default policies;
