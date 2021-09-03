import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import toObject from 'dayjs/plugin/toObject';
import { Card } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import Style from './styles';

dayjs.extend(toObject);
const visa = require('../../assets/images/icons/visa.png');
const master = require('../../assets/images/icons/mastercard.png');
const american = require('../../assets/images/icons/american.png');
const discover = require('../../assets/images/icons/discover.png');

function typeOfCard(type) {
  switch (type.toLowerCase()) {
    case 'visa':
      return visa;
    case 'mastercard':
      return master;
    case 'discover':
      return discover;
    default:
      return american;
  }
}

export function CardMySubscription(props) {
  return (
    <Card containerStyle={[Style.cardStyle, Style.cardLeftPadding]}>
      <View
        style={{
          margin: 0,
          width: '100%',
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7,
          borderTopEndRadius: 7,
          borderTopStartRadius: 7,
          overflow: 'hidden'
        }}>
        <LinearGradient
          colors={props.arrayOfColors}
          style={{
            left: 0,
            right: 0,
            top: 0,
            height: 'auto'
          }}>
          <View>
            <View
              style={{
                paddingTop: 25,
                paddingRight: 15,
                paddingLeft: 15,
                paddingBottom: 15
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  alignSelf: 'center',
                  fontWeight: '400',
                  fontSize: 12,
                  color: 'white'
                }}>
                {props.title}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 20,
                  fontWeight: '700',
                  color: 'white'
                }}>
                {props.months === 1 ? '' : props.months} {props.months === 1 ? 'MENSUAL' : 'MESES'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <View
        style={{
          height: 'auto',
          width: '100%',
          marginTop: 5
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text
            allowFontScaling={false}
            style={{
              alignSelf: 'center',
              fontWeight: '600',
              fontSize: 32,
              marginTop: 23,
              color: '#333333'
            }}>
            $
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              alignSelf: 'center',
              fontWeight: '700',
              fontSize: 45,
              marginTop: 15,
              color: '#333333'
            }}>
            {props.monthPrice}
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'center',
            fontWeight: '700',
            alignItems: 'center',
            fontSize: 17,
            marginTop: 0,
            color: '#333333'
          }}>
          MENSUALES*
        </Text>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            // onPress={props.changeMethod}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={typeOfCard(props.cardName)} style={{ width: 30, height: 30 }} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 3
                }}>{` QUE TERMINA EN ${props.cardNumber}`}</Text>
            </View>
          </TouchableOpacity>
          {!props.hideCancelButton && (
            <TouchableOpacity
              onPress={props.changeMethod}
              style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 3,
                  color: Colors.primaryColorLight
                }}>
                Cambiar metodo de pago
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              marginTop: 10,
              marginLeft: 25,
              marginRight: 25,
              marginBottom: 10,
              display: 'none'
            }}>
            <SecondaryButton
              disabled={props.hideCancelButton}
              color={Colors.errorColor}
              text="CANCELAR"
              minWidth={60}
              marginLeft={5}
              marginRight={5}
              loadingBtn={false}
              padding={5}
              height={40}
              borderRadius={20}
              onPress={() => props.click(props.subscription_stripe_id)}
            />
            {props.hideCancelButton && (
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: 11,
                  marginLeft: 5,
                  marginRight: 5,
                  paddingBottom: 10,
                  color: 'black'
                }}>
                {`Está suscripción fue cancelada el día ${dayjs(props.canceledDate).format(
                  'DD/MM/YYYY'
                )} y tiene vigencia hasta el día ${dayjs(props.current_period_end).format(
                  'DD/MM/YYYY'
                )}`}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

CardMySubscription.defaultProps = {
  anual: true,
  click: () => null,
  changeMethod: () => null,
  hideCancelButton: false,
  current_period_end: '',
  canceledDate: ''
};

CardMySubscription.propTypes = {
  anual: PropTypes.bool,
  click: PropTypes.func,
  subscription_stripe_id: PropTypes.string.isRequired,
  changeMethod: PropTypes.func,
  hideCancelButton: PropTypes.bool,
  current_period_end: PropTypes.string,
  canceledDate: PropTypes.string
};
