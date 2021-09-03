import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Card } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import Style from './styles';

export function CardSuscripcion(props) {
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
              color: props.priceColor
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
              color: props.priceColor
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
            marginTop: 5,
            color: props.priceColor
          }}>
          MENSUALES*
        </Text>
        {!props.anual ? (
          <Text
            allowFontScaling={false}
            textAlign="center"
            numberOfLines={2}
            style={{
              alignSelf: 'center',
              fontWeight: '700',
              fontSize: 13,
              marginTop: 5,
              marginLeft: 15,
              marginRight: 15,
              textAlign: 'center',
              justifyContent: 'center',
              color: 'black',
              height: 50
            }}>
            {props.firstDescription}
          </Text>
        ) : (
          <NumberFormat
            value={props.anualPrice}
            displayType="text"
            thousandSeparator
            decimalScale={2}
            prefix="$"
            fixedDecimalScale
            renderText={value => (
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={{
                  alignSelf: 'center',
                  fontWeight: '700',
                  fontSize: 13,
                  marginTop: 5,
                  marginLeft: 15,
                  marginRight: 15,
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  height: 50
                }}>
                {props.firstDescription} {value}{' '}
              </Text>
            )}
          />
        )}
      </View>
      <View
        style={{
          marginLeft: props.only ? 20 : 5,
          marginRight: props.only ? 20 : 5,
          marginTop: -10
        }}>
        {props.anual ? (
          <PrimaryButton
            text="COMPRAR"
            minWidth={60}
            loadingBtn={false}
            marginLeft={5}
            marginRight={5}
            padding={5}
            height={40}
            borderRadius={20}
            onPress={() => props.click('anual', props.policy)}
          />
        ) : (
          <SecondaryButton
            text="SUSCRIBIR"
            minWidth={60}
            marginLeft={5}
            marginRight={5}
            loadingBtn={false}
            padding={5}
            height={40}
            borderRadius={20}
            onPress={() => props.click('monthly', props.policy)}
          />
        )}

        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 11,
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            color: 'black'
          }}>
          {props.description}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 11,
            marginLeft: 10,
            marginRight: 10,
            paddingBottom: 10,
            color: 'black'
          }}>
          {props.finalDescription}
        </Text>
      </View>
    </Card>
  );
}

CardSuscripcion.defaultProps = {
  anual: true,
  click: () => null,
  only: false
};

CardSuscripcion.propTypes = {
  anual: PropTypes.bool,
  click: PropTypes.func,
  only: PropTypes.bool
};
