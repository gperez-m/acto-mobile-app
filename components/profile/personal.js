import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import Style from './styles';
import Colors from '../../constants/Colors';

const phone = require('../../assets/images/icons/phone-call.png');
const edit = require('../../assets/images/icons/edit.png');

function getFormattedPhoneNum(input) {
  let output = '(';
  input.replace(/^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/, function(match, g1, g2, g3) {
    if (g1.length) {
      output += g1;
      if (g1.length == 3) {
        output += ')';
        if (g2.length) {
          output += ` ${g2}`;
          if (g2.length == 3) {
            output += ' - ';
            if (g3.length) {
              output += g3;
            }
          }
        }
      }
    }
  });
  return output;
}

const personal = props => {
  return (
    <Card
      containerStyle={{
        borderRadius: 10,
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: 20,
        paddingRight: 20
      }}>
      <View style={Style.cardInformation}>
        <View>
          <Text allowFontScaling={false} style={Style.name}>
            {props.info.name} {props.info.last_name}
          </Text>
          <Text allowFontScaling={false} style={Style.email}>{props.info.email}</Text>
          <Text allowFontScaling={false} style={[Style.password, Style.mt5]}>* * * * * * *</Text>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View>
                <Image
                  tintColor={Colors.primaryColorLight}
                  source={phone}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <View>
                <Text allowFontScaling={false} style={[Style.name, Style.ml10]}>
                  {getFormattedPhoneNum(props.info.phone)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.5 }}>
          <TouchableOpacity
            onPress={props.editProfile}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              tintColor={Colors.primaryColor}
              source={edit}
              style={{ width: 20, height: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

personal.defaultProps = {
  editProfile: () => null
};

personal.propTypes = {
  info: PropTypes.shape({
    name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string
  }).isRequired,
  editProfile: PropTypes.func
};

export default personal;
