import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert, ScrollView, Share, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Personal from '../../components/profile/personal';
import ListOrders from '../../components/TableView/List';
import ShimmerLayout from '../../components/Shimmer/shimmerLayout';
import { http } from '../../networking/ApiClient';

import Style from './styles';
import Colors from '../../constants/Colors';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import * as FileSystem from 'expo-file-system';
import WebView from 'react-native-webview';
import { HeaderBackButton } from 'react-navigation';

const userLogo = require('../../assets/images/icons/user.png');
const shoppingLogo = require('../../assets/images/icons/shopping-cart.png');
const logout = require('../../assets/images/icons/logout.png');
const subLogo = require('../../assets/images/icons/member-card.png');

const titleList = [
  {
    id: 0,
    name: 'Fecha contratación'
  },
  {
    id: 1,
    name: 'Nombre de la suscripción'
  },
  {
    id: 2,
    name: 'Importe'
  },
  {
    id: 3,
    name: 'Estado'
  }
];

const titleListSubs = [
  {
    id: 0,
    name: 'Fecha contratación'
  },
  {
    id: 1,
    name: 'Nombre de la suscripción'
  },
  {
    id: 2,
    name: 'Importe'
  },
  {
    id: 3,
    name: 'Próximo cobro'
  }
];

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingProfile: true,
      loadingHistory: true,
      loadingSuscrib: true,
      loadingFiles: true,
      profile: {},
      policy: {},
      myPolicies: [],
      company_logo: null,
      showWebView: false,
      loadingDownload: false,
      currentPdf: '',
      currentType: '',
    };
    this.getOrders = this.getOrders.bind(this);
    this.close = this.close.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.onClickPolicy = this.onClickPolicy.bind(this);
    this.onClickCertificate = this.onClickCertificate.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
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
              Mi Perfil
            </Text>
          </View>
        </View>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => params.handleSave()}>
          <Image
            tintColor="white"
            source={logout}
            style={{
              width: 22,
              height: 22,
              tintColor: 'white',
              marginRight: 15
            }}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <HeaderBackButton
          backTitleVisible
          onPress={() => params.handleBack()}
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
      headerVisible: true,
    };
  };

  close() {
    this;
    Alert.alert(
      'ATENCIÓN',
      '¿Estas seguro que deseas cerrar sesiónes?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.clear();
            this.props.navigation.navigate('SignIn');
          }
        }
      ],
      { cancelable: true }
    );
  }

  async componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.close });
    this.props.navigation.setParams({ handleBack: this.handleBack });
    const uuid = await AsyncStorage.getItem('uuid');
    const company = await AsyncStorage.getItem('company_logo');
    this.setState({ company_logo: company });
    http
      .get(`me/${uuid}/uuid`)
      .then(result => {
        this.setState({
          loadingProfile: false,
          loadingFiles: false,
          profile: result
        });
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingProfile: false });
      });

    this.getOrdersActive(uuid);
    this.getOrders(uuid);
  }

  getOrders(uuid) {
    http
      .get(`client/${uuid}/history/orders?limit=10000`)
      .then(result => {
        this.setState(
          {
            loadingHistory: false,
            myPolicies: result.data
          }
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingHistory: false });
      });
  }

  getOrdersActive(uuid) {
    http
      .get('activeSuscriptions?status=trialing&status=active')
      .then(result => {
        this.setState(
          {
            loadingSuscrib: false,
            subscription: result.data
          }
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingSuscrib: false });
      });
  }

  editProfile() {
    this.props.navigation.navigate('EditProfile');
  }

  onClickNavigation() {
    this.props.navigation;
  }

  onClickCertificate() {
    const { profile } = this.state;
    if (profile.url_files && profile.url_files.url_certificate !== undefined) {
      this.setState({
        showWebView: true,
        currentPdf: profile.url_files.url_certificate,
        currentType: 'certificado_'
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

  onClickPolicy() {
    const { profile } = this.state;
    if (profile.url_files && profile.url_files.url_policy !== undefined) {
      this.setState({
        showWebView: true,
        currentPdf: profile.url_files.url_policy,
        currentType: 'poliza_'
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

  async downloadPDF() {
    const { currentPdf, currentType } = this.state;
    if (currentPdf != null) {
      this.setState({ loadingDownload: true });
      FileSystem.downloadAsync(currentPdf, `${FileSystem.documentDirectory}${currentType}.pdf`)
        .then(({ uri }) => {
          this.setState({ loadingDownload: false });
          Share.share(
            {
              //message: "1",
              title: currentType,
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    const { showWebView } = this.state;
    if (showWebView === true) {
      this.setState({ showWebView: false });
      return false;
    }
    this.props.navigation.goBack();
    return true;
  }

  handleBack() {
    const { showWebView } = this.state;
    if (showWebView === true) {
      this.setState({ showWebView: false });
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    const {
      loadingSuscrib,
      loadingProfile,
      loadingFiles,
      loadingHistory,
      profile,
      myPolicies,
      company_logo,
      subscription,
      showWebView,
      loadingDownload,
      currentPdf
    } = this.state;
    return showWebView ?
    (
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
    ) :
    (
      <View style={Style.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}>
          <View style={[Style.containerInformation]}>
            <View style={{ flexDirection: 'row' }}>
              {company_logo != null ? (
                <Image
                  source={{ uri: company_logo }}
                  style={{
                    width: 30,
                    height: 30
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  tintColor={Colors.primaryColorLight}
                  source={userLogo}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: Colors.primaryColorLight
                  }}
                />
              )}
              <Text allowFontScaling={false} style={[Style.titleText, Style.ml10, Style.mt5]}>
                Mi perfil
              </Text>
            </View>
            <View style={{ flex: 1}}>
              {loadingProfile ? (
                <ShimmerLayout lines={5} />
              ) : (
                <Personal info={profile} editProfile={this.editProfile} />
              )}
            </View>
          </View>
          { loadingFiles?
          <View style={{marginTop: 50}}>
            <ShimmerLayout lines={10} />
          </View>:
          <View style={{
            alignItems: 'center',
            marginTop: 30,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}>
            <Text allowFontScaling={false} style={{textAlign: 'center'}}>
              Mis polizas
            </Text>
            <View
              style={{
                paddingTop: 10,
                width: 350,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SecondaryButton
                text="Descargar"
                loadingBtn={false}
                onPress={() => this.onClickPolicy()}
              />
            </View>
            <Text allowFontScaling={false} style={{textAlign: 'center'}}>
              Mis certifcados
            </Text>
            <View
              style={{
                paddingTop: 10,
                width: 350,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SecondaryButton
                text="Descargar"
                loadingBtn={false}
                onPress={() => this.onClickCertificate()}
              />
            </View>
          </View>
          }
          <View style={Style.containerHistory}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                tintColor={Colors.primaryColorLight}
                source={subLogo}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: Colors.primaryColorLight
                }}
              />
              <Text allowFontScaling={false} style={[Style.titleText, Style.ml10, Style.mt5]}>
                Suscripciones mensuales
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {loadingSuscrib ? (
                <View style={{ flex: 1, marginTop: 15 }}>
                  <ShimmerLayout lines={5} />
                </View>
              ) : (
                <ListOrders
                  titleList={titleListSubs}
                  data={subscription}
                  navigation={this.props.navigation}
                  placeHolder="No tienes suscripciones"
                  subscription
                />
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                tintColor={Colors.primaryColorLight}
                source={shoppingLogo}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: Colors.primaryColorLight
                }}
              />
              <Text allowFontScaling={false} style={[Style.titleText, Style.ml10, Style.mt5]}>
                Historial de compras
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {loadingHistory ? (
                <View style={{ flex: 1, marginTop: 15 }}>
                  <ShimmerLayout lines={5} />
                </View>
              ) : (
                <ListOrders
                  titleList={titleList}
                  data={myPolicies}
                  navigation={this.props.navigation}
                  placeHolder="No tienes historial"
                  subscription={false}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Profile;
