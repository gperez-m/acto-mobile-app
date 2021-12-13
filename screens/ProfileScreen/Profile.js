import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Personal from '../../components/profile/personal';
import ListOrders from '../../components/TableView/List';
import ShimmerLayout from '../../components/Shimmer/shimmerLayout';
import { http } from '../../networking/ApiClient';

import Style from './styles';
import Colors from '../../constants/Colors';

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
      profile: {},
      myPolicies: [],
      company_logo: null
    };
    this.getOrders = this.getOrders.bind(this);
    this.close = this.close.bind(this);
    this.editProfile = this.editProfile.bind(this);
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

  close() {
    this;
    Alert.alert(
      'ATENCIÓN',
      '¿Estas seguro que deseas cerrar sesión?',
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
    const uuid = await AsyncStorage.getItem('uuid');
    const company = await AsyncStorage.getItem('company_logo');
    this.setState({ company_logo: company });
    http
      .get(`me/${uuid}/uuid`)
      .then(result => {
        this.setState({
          loadingProfile: false,
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

  render() {
    const {
      loadingSuscrib,
      loadingProfile,
      loadingHistory,
      profile,
      myPolicies,
      company_logo,
      subscription
    } = this.state;
    return (
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
