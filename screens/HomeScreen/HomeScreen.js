import React from 'react';
import { Card, ThemeConsumer } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications'
import { StackActions, NavigationActions, ScrollView } from 'react-navigation';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { TransparentButton } from '../../components/Buttons/TransparentButton';
import { http } from '../../networking/ApiClient';

import Style from './styles';
import Colors from '../../constants/Colors';

const userlogo = require('../../assets/images/icons/user.png');
const contractLogo = require('../../assets/images/icons/contract.png');
const policyLogo = require('../../assets/images/icons/policy.png');
const operatorLogo = require('../../assets/images/icons/operator.png');
const logoHeader = require('../../assets/images/logo_header.png');
const sirena = require('../../assets/images/icons/sirena.png');

// expo install expo-permissions
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingInsurance: true,
      loadingMyPolicies: true,
      InsutancesList: [],
      InsurancesListFinal: [],
      myPolicies: 0,
      myPoliciesObj: [],
      company_logo: null,
      loadingNotification: false,
      componentHeight: 0
    };
    this.getVoluntaryPolicies = this.getVoluntaryPolicies.bind(this);
    this.getCompanyPolicies = this.getCompanyPolicies.bind(this);
    this.onLayoutEvent = this.onLayoutEvent.bind(this);
  }

  // https://docs.expo.io/versions/latest/guides/using-fcm/
  async componentDidMount() {
    const { componentHeight } = this.state;
    const uuid = await AsyncStorage.getItem('uuid');
    const company = await AsyncStorage.getItem('company_logo');
    const tokenExpo = await AsyncStorage.getItem('expoToken');
    // console.log(`---------${Math.round(Dimensions.get('window').height)}---------`, 59);
    this.setState({ company_logo: company });
    // console.log(`client/${uuid}/products/voluntary`, 60)
    http
      .get(`client/${uuid}/products/voluntary`)
      .then(result => {
        this.setState({
          loadingInsurance: false,
          // InsutancesList: result.data.slice(0, 3)
          InsurancesListFinal: result.data
        });
        // console.log('----------- compoenet -------',69, componentHeight);
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingInsurance: false });
      });
    this.getVoluntaryPolicies(uuid);
    // console.log('aqui', 77, tokenExpo);
    if (tokenExpo != null || tokenExpo != undefined) {
    } else {
      this.registerForPushNotificationsAsync();
    }
    this.notificationSubscription = Notifications.addEventListener(this.handleNotification);
  }

  registerForPushNotificationsAsync = async currentUser => {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    const token = await Notifications.getExpoPushTokenAsync();
    const form = {
      token_firebase: token.data,
      type: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
    };

    this.setState({ loadingNotification: true });
    http
      .post('setToken/firebase', form)
      .then(result => {
        this.setState({ loadingNotification: false });
        this.setToken(token.data);
      })
      .catch(error => {
        Alert.alert('Advertencia !' ,error)
        this.setState({ loadingNotification: true });
      });
  };

  async setToken(token) {
    await AsyncStorage.setItem('expoToken', token);
  }

  onLayoutEvent(event) {
    const { InsurancesListFinal } = this.state;
    this.setState({ componentHeight: event.nativeEvent.layout.height });
    let counter = 0;
    Object.keys(InsurancesListFinal).forEach(function(key) {
      if (counter * 195 <= event.nativeEvent.layout.height) {
        counter += 1;
      }
    });
    //console.log(counter, 136)
    this.setState({ InsutancesList: InsurancesListFinal.slice(0, counter) });
    //console.log('entrooooooooooooooooo',138, event.nativeEvent.layout.height);
  }

  handleNotification = notification => {
    const { origin } = notification;
    const { id, subject, created_at, client_id, uuid } = notification.data;
    //console.log('entro', 144);
    if (origin === 'selected') {
      const navigateAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home'
          }),
          NavigationActions.navigate({
            routeName: 'Tickets',
            params: {
              claimId: id,
              name: subject,
              created_at,
              uuid,
              client_id
            }
          })
        ]
      });
      this.props.navigation.dispatch(navigateAction);
    }
  };

  getVoluntaryPolicies(uuid) {
    http
      .get('client/dashboard/suscriptions')
      .then(result => {
        this.setState(
          {
            loadingMyPolicies: false,
            myPolicies: result.length,
            myPoliciesObj: result
          },
          () => {
            console.log(this.state.myPolicies, 180)
            //this.getCompanyPolicies(uuid, result.data.length);
          }
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingMyPolicies: false });
      });
  }

  getCompanyPolicies(uuid, policies) {
    const { myPoliciesObj } = this.state;
    http
      .get(`client/${uuid}/history/orders-active`)
      .then(result => {
        const counter = policies + result.data.length;
        this.setState(
          {
            loadingMyPolicies: false,
            myPolicies: counter,
            myPoliciesObj: myPoliciesObj.length > 0 ? myPoliciesObj : result.data
          },
          () => console.log(this.state.myPoliciesObj, 202)
        );
      })
      .catch(error => {
        Alert.alert('Atención !', error);
        this.setState({ loadingMyPolicies: false });
      });
  }

  render() {
    const {
      InsutancesList,
      loadingInsurance,
      myPolicies,
      loadingMyPolicies,
      myPoliciesObj,
      company_logo,
      loadingNotification,
      InsurancesListFinal
    } = this.state;

    //console.log('producto',224, myPoliciesObj);
    return (
      <View style={styles.container}>
        <View style={Style.containerCardParent}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={Style.cardContainerView}>
                <Card containerStyle={Style.cardViewContainer}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                    <View style={Style.cardProfile}>
                      {company_logo != null ? (
                        <Image
                          resizeMode="contain"
                          source={{ uri: company_logo }}
                          style={Style.imgSection2}
                        />
                      ) : (
                        <Image source={userlogo} style={Style.imgSection1} />
                      )}
                      <Text allowFontScaling={false} style={[Style.title, Style.ml5]}>
                        Mi perfil
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              </View>
              <View style={Style.cardContainerViewBottom}>
                <Card containerStyle={[Style.cardContainerLeft]}>
                  <View style={Style.cardMyPolicies}>
                    {/* <Image source={contractLogo} style={Style.policyImage} /> */}
                    <Text allowFontScaling={false} style={[Style.title, Style.ml20]}>
                      Mis suscripciones
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginLeft: 7,
                      marginRight: 7
                    }}>
                    {loadingMyPolicies ? (
                      <ActivityIndicator
                        style={{ alignSelf: 'center' }}
                        size="large"
                        color={Colors.primaryColor}
                        animating={loadingMyPolicies}
                      />
                    ) : (
                      <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        {myPolicies > 0 ? (
                          <View
                            style={{
                              height: '100%',
                              width: Dimensions.get('window').width / 2 - 50,
                              position: 'relative'
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{ marginBottom: 15, display: 'none' }}>
                              Cuentas con{' '}
                              <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>
                                {myPolicies}
                              </Text>{' '}
                              suscripciones de seguro.
                            </Text>
                            <View
                              style={{
                                width: '100%',
                                flex: 1
                              }}>
                              <Card
                                containerStyle={{
                                  borderRadius: 10,
                                  backgroundColor:
                                    myPoliciesObj[0].backgroundColor != null
                                      ? myPoliciesObj[0].backgroundColor
                                      : '#F6FFF7',
                                  width: '100%',
                                  margin: 0,
                                  paddingLeft: 5,
                                  paddingRight: 5,
                                  paddingTop: 10,
                                  justifyContent: 'center',
                                  marginBottom: 60,
                                  flex: 1
                                }}>
                                <View
                                  style={{
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                    width: '100%',
                                    alignSelf:
                                      myPoliciesObj[0].type !== 'empresa' ? 'flex-start' : 'center'
                                  }}>
                                  {myPoliciesObj[0].type !== 'empresa' && (
                                    <View>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          color:
                                            myPoliciesObj[0].backgroundColor != null
                                              ? 'white'
                                              : 'black',
                                          fontSize: 11,
                                          width: '100%'
                                        }}>
                                        Fecha de vencimiento
                                      </Text>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          textAlign: 'center',
                                          fontWeight: '600',
                                          marginTop: 2,
                                          fontSize: 12,
                                          color:
                                            myPoliciesObj[0].backgroundColor != null
                                              ? 'white'
                                              : 'black'
                                          // color: '#3FB350'
                                        }}>
                                        {/*
                                          {myPoliciesObj != null &&
                                          myPoliciesObj.length > 0 &&
                                          `${dayjs(myPoliciesObj[0].end_date).format(
                                            'DD/MM/YYYY'
                                          )}`}
                                          */}
                                      </Text>
                                    </View>
                                  )}
                                  <View
                                    style={{
                                      marginTop: 20
                                    }}>
                                    <Image
                                      source={{
                                        uri: myPoliciesObj[0].icon
                                      }}
                                      style={{
                                        borderRadius: 5,
                                        height: 220,
                                        width: 110,
                                        alignSelf: 'center'
                                      }}
                                    />
                                  </View>
                                  <View style={{ marginTop: 10 }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        marginTop: 2,
                                        fontSize: 13,
                                        color:
                                          myPoliciesObj[0].backgroundColor != null
                                            ? 'white'
                                            : 'black'
                                      }}>
                                      {myPoliciesObj[0].name}
                                    </Text>
                                  </View>
                                  <View style={{ marginTop: 3 }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: '400',
                                        marginTop: 2,
                                        fontSize: 11,
                                        display: 'none'
                                      }}>
                                      {/* {myPoliciesObj[0].product.description} */}
                                    </Text>
                                  </View>
                                </View>
                              </Card>
                            </View>
                            {/* <Text allowFontScaling={false} style={{ textAlign: 'justify', marginTop: 15}}>Dar de alta datos de credito o actualizarlos para poder realizar compras con rapides y preaprobar creditos.</Text> */}
                            <View
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: -25,
                                right: -25
                              }}>
                              <TransparentButton
                                text="TODAS MIS SUSCRIPCIONES"
                                color={Colors.primaryColorLight}
                                fontSize={Dimensions.get('window').width * 0.035}
                                onPress={() => this.props.navigation.navigate('MyPolicies')}
                              />
                            </View>
                          </View>
                        ) : (
                          <View style={{ flex: 1 }}>
                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  marginBottom: 15,
                                  textAlign: 'center'
                                }}>
                                Aún no cuentas con suscripciones de seguro.
                              </Text>
                            </View>
                            <View
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: -25,
                                right: -25
                              }}>
                              <TransparentButton
                                text="TODAS MIS SUSCRIPCIONES"
                                color={Colors.primaryColorLight}
                                fontSize={Dimensions.get('window').width * 0.035}
                                onPress={() => this.props.navigation.navigate('MyPolicies')}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </Card>
              </View>
            </View>
            <View style={Style.cardContainerViewRight}>
              <Card containerStyle={[Style.cardContainer]}>
                <View style={Style.cardBuyPolicies}>
                  {/* <Image source={policyLogo} style={Style.policyImage} /> */}
                  <Text allowFontScaling={false} style={[Style.title, Style.ml20]}>
                    Comprar {'\n'} suscripciones
                  </Text>
                </View>
                {InsurancesListFinal.length > 0 ? (
                  <View style={{ flex: 5 }} onLayout={this.onLayoutEvent}>
                    <ScrollView >
                    {InsutancesList.map(l => (
                      <View key={l.id} style={{ justifyContent: 'center' }}>
                        <Card
                          key={l.id}
                          containerStyle={[
                            Style.cardItemPolicy,
                            { backgroundColor: l.product.colour_app }
                          ]}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('Detail', {
                                policyId: l.product.uuid
                              })
                            }>
                            <Text
                              allowFontScaling={false}
                              numberOfLines={2}
                              style={{ textAlign: 'center', color: 'white' }}>
                              {l.custom_name != null ? l.custom_name : l.product.name}
                            </Text>
                            <View style={{ alignSelf: 'center'}}>
                              <Image
                                source={{ uri: l.product.icon_url }}
                                style={{
                                  width: 90,
                                  height: 90,
                                  alignSelf: 'center'
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        </Card>
                      </View>
                    ))}
                    </ScrollView>
                    <View
                      style={{
                        bottom: 0,
                        left: -5,
                        right: -5
                      }}>
                      <TransparentButton
                        text="TODAS LAS SUSCRIPCIONES"
                        loading={false}
                        color={Colors.primaryColorLight}
                        fontSize={Dimensions.get('window').width * 0.035}
                        onPress={() => this.props.navigation.navigate('ListPolicies')}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {loadingInsurance.length > 0 ? (
                      <Text>Suscripciones no disponibles</Text>
                    ) : (
                      <ActivityIndicator
                        size="large"
                        color={Colors.primaryColor}
                        animating={loadingInsurance}
                      />
                    )}
                  </View>
                )}
              </Card>
            </View>
          </View>
        </View>
        <View style={Style.cardContainerViewBottomParent}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Tickets', {
                claimId: null,
                name: null,
                created_at: null,
                uuid: null,
                client_id: null
              })
            }
            style={{
              width: '100%',
              flex: 1,
              marginTop: 0,
              paddingTop: 0,
              paddingLeft: 12,
              paddingRight: 12,
              paddingBottom: 12
            }}>
            <Card
              containerStyle={{
                width: '100%',
                borderRadius: 10,
                margin: 0,
                height: '100%'
              }}>
              {/*
              <View style={{ flex: 0.9, width: '100%' }}>
                <Image source={operatorLogo} style={{ height: 45, width: 45 }} />
              </View>
                  */}

              <View
                style={{
                  // width: '100%',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  height: '100%'
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16 }}>
                    Asistencias 24/7
                  </Text>
                  <Text allowFontScaling={false} style={{ color: 'gray' }}>
                    Contáctanos
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}>
                  <Image source={sirena} style={{ width: 40, height: 40, marginRight: 25 }} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
        {loadingNotification && (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(238, 238, 238, 0.7)',
              zIndex: 2
            }}>
            <ActivityIndicator
              size="large"
              color={Colors.primaryColor}
              animating={loadingNotification}
            />
          </View>
        )}
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Image source={logoHeader} style={{ width: 90, height: 25 }} />
    </View>
  ),
  headerStyle: {
    backgroundColor: Colors.primaryColor
  },
  headerTintColor: Colors.primaryColor,
  headerTitleStyle: {
    textAlign: 'center',
    alignSelf: 'center'
  },
  headerVisible: true
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  containerL: {
    flex: 1,
    backgroundColor: 'green'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  }
});
