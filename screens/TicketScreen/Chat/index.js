import React, { Component } from 'react';
import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showDate } from '../../../utils/data';
import { http } from '../../../networking/ApiClient';
import Colors from '../../../constants/Colors';
import Style from './styles';

const alarm = require('../../../assets/images/icons/alarm.png');
const send = require('../../../assets/images/icons/paper-plane.png');

const validationSchema = yup.object().shape({
  subject: yup
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

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      msg: '',
      listMsg: null,
      ticketLocal: null,
      name: ''
    };
    this.sendComment = this.sendComment.bind(this);
    this.getComments = this.getComments.bind(this);
  }

  async getComments() {
    const { ticketLocal } = this.state;
    const uuid = await AsyncStorage.getItem('uuid');
    http
      .get(`client/${uuid}/claims/${ticketLocal.uuid}`)
      .then(result => {
        this.setState({
          isLoading: false,
          listMsg: result.claim_comment
        });
        this.props.navigation.setParams({ client_id: null, name: null, uuid: null });
        console.log(result);
      })
      .catch(error => {
        Alert(error);
        this.setState({ isLoading: false });
      });
  }

  async componentDidMount() {
    const { ticket, name } = this.props.navigation.state.params;
    this.setState({ ticketLocal: ticket, name }, () => this.getComments());
  }

  async sendComment() {
    const { msg, ticketLocal, isLoadingComment } = this.state;
    const company_uuid = await AsyncStorage.getItem('company_uuid');
    this.setState({ isLoadingComment: true });
    const formData = {
      claim_uuid: ticketLocal.uuid,
      client_id: ticketLocal.client_id,
      comment: msg,
      company_uuid
    };
    http
      .post('client/add-comment', formData)
      .then(result => {
        this.setState({
          isLoadingComment: false,
          msg: ''
        });
        this.getComments();
      })
      .catch(error => {
        alert(error);
        this.setState({ isLoadingComment: false });
      });
  }

  render() {
    const { isLoading, listMsg, msg, isLoadingComment, name } = this.state;
    const { ticket, created_at } = this.props.navigation.state.params;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <View style={{ backgroundColor: '#ebebeb', flex: 1 }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingLeft: 25,
              paddingRight: 25,
              paddingTop: 35,
              paddingBottom: 35
            }}>
            <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 17 }}>
              {name}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 15 }}>{`Creado el: ${dayjs(
              created_at
            ).format('DD/MM/YY')}`}</Text>
          </View>
          <View style={{ flex: 1, paddingBottom: 5 }}>
            <FlatList
              inverted
              data={listMsg}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: '100%',
                    marginTop: 5
                  }}
                />
              )}
              renderItem={({ index, item }) => (
                <View
                  key={index}
                  style={[item.client_id != null ? Style.flatViewRight : Style.flatViewLeft]}>
                  {item.client_id != null ? (
                    <View style={{ alignSelf: 'flex-end' }}>
                      <View
                        style={{
                          backgroundColor: Colors.primaryColor,
                          alignSelf: 'flex-end',
                          marginRight: 10,
                          marginTop: 10,
                          padding: 10,
                          borderTopLeftRadius: 5,
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5
                        }}>
                        <Text allowFontScaling={false} style={{ color: 'white' }}>
                          {item.comment}
                        </Text>
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={{ marginRight: 10, fontSize: 10, textAlign: 'right' }}>
                        {showDate(item.updated_at)}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignSelf: 'flex-start' }}>
                      <View
                        style={{
                          backgroundColor: Colors.primaryColor,
                          alignSelf: 'flex-start',
                          marginLeft: 10,
                          marginTop: 10,
                          padding: 10,
                          borderTopRightRadius: 5,
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5
                        }}>
                        <Text allowFontScaling={false} style={{ color: 'white' }}>
                          {item.comment}
                        </Text>
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={{ marginLeft: 10, fontSize: 10, textAlign: 'left' }}>
                        {showDate(item.updated_at)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.bottomDisableColor,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 15,
              paddingBottom: 15
            }}>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder="Ingresa un mensaje"
                style={{
                  height: 40,
                  padding: 5,
                  width: '85%',
                  backgroundColor: 'white',
                  borderRadius: 5
                }}
                onChangeText={text => this.setState({ msg: text })}
                value={msg}
              />
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.sendComment}>
                <View
                  style={{
                    backgroundColor: Colors.primaryColorLight,
                    borderRadius: 25,
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  {isLoadingComment ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Image
                      tintColor="white"
                      source={send}
                      style={{ width: 20, height: 20, tintColor: 'white' }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

Chat.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Image
        tintColor="white"
        source={alarm}
        style={{ width: 25, height: 25, tintColor: 'white' }}
      />
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

export default Chat;
