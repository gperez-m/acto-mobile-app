import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import ShimmerLayout from '../../components/Shimmer/shimmerLayout';
import { http } from '../../networking/ApiClient';
import Colors from '../../constants/Colors';
import { showDate } from '../../utils/data';
import Style from './styles';

const userLogo = require('../../assets/images/icons/user.png');
const ticketLogo = require('../../assets/images/tickets.png');
const alarm = require('../../assets/images/icons/sirena.png');

// ticket status
const close = require('../../assets/images/success.png');
const pending = require('../../assets/images/warning.png');
const active = require('../../assets/images/alarm.png');

function showStatus(status) {
  switch (status) {
    case 'PENDING':
      return pending;
    case 'CLOSE':
      return close;
    default:
      return active;
  }
}

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      list: []
    };
    this.getTickets = this.getTickets.bind(this);
  }

  static navigationOptions = ({ navigation, props }) => {
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
              Asistencias 24/7
            </Text>
          </View>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Claim', { updateData: navigation.getParam('update') })
          }>
          <Image source={alarm} style={{ width: 25, height: 25, marginRight: 15 }} />
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

  async getTickets() {
    const uuid = await AsyncStorage.getItem('uuid');
    http
      .get(`client/${uuid}/claims`)
      .then(res => this.setState({ list: res.data, isLoading: false }));
  }

  async componentDidMount() {
    this.props.navigation.setParams({ handleDelete: this.handleDelete });
    const { name, created_at, uuid, client_id } = this.props.navigation.state.params;
    const { setParams } = this.props.navigation;
    setParams({ update: this.getTickets });
    this.getTickets();
    if (name != null && client_id != null && uuid != null) {
      this.props.navigation.navigate('Chat', {
        ticket: { uuid, client_id },
        name,
        created_at
      });
    }
  }

  renderList() {
    const { list } = this.state;
    console.log(list);
    if (list.length <= 0) {
      return (
        <View style={Style.container}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center'
            }}>
            <Text
              allowFontScaling={false}
              style={[Style.titleText, Style.ml10, Style.mt5, Style.centerItem]}>
              No tienes ningúna asistencia
            </Text>
          </View>
        </View>
      );
    }
    return (
      <FlatList
        data={list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              marginTop: 5,
              marginBottom: 10,
              height: 1,
              backgroundColor: '#ddd'
            }}
          />
        )}
        renderItem={({ index, item }) => (
          <View key={index} style={[Style.flatListView]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  ticket: item,
                  name: item.subject,
                  created_at: item.created_at
                })
              }>
              <View style={{ marginTop: 5 }}>
                {/** Subjet */}
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={[Style.titleText, Style.name]}>
                    {item.subject}
                  </Text>
                </View>
                {/**  Total */}
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'flex-start',
                    flexDirection: 'row'
                  }}
                />
                {/**  ShowDate */}
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row'
                  }}>
                  <Text allowFontScaling={false} style={Style.typeSubjet}>
                    {showDate(item.created_at)}
                  </Text>
                </View>
              </View>
              {/** Last Message */}
              <View style={[Style.mt5]}>
                <Text allowFontScaling={false} style={Style.typeSubjet} numberOfLines={1}>
                  {item.claim_comment.length > 0
                    ? item.claim_comment[item.claim_comment.length - 1].comment
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={Style.container}>
        {/** Title */}
        <View style={Style.containerInformation}>
          {/** ShowList */}
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <View style={{ padding: 15 }}>
                <ShimmerLayout lines={15} />
              </View>
            ) : (
              this.renderList()
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default Tickets;
