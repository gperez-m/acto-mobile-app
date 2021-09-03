import React from 'react';
import { Text, View, ImageBackground } from 'react-native';
import { Card } from 'react-native-elements';
import { PrimaryButton } from '../../../components/Buttons/PrimaryButton';
import Style from './styles';
import Colors from '../../../constants/Colors';

const step = props => {
  let paymentMenthod = 'SPEI';
  if (props.type == '1' || props.typeSuscription !== 'anual') {
    paymentMenthod = 'TARJETA';
  } else if (props.type == '2') {
    paymentMenthod = 'OXXO';
  }

  return (
    <View style={Style.container}>
      <Card containerStyle={Style.cardContainer}>
        <Text allowFontScaling={false} style={Style.cardTitle}>
          Información del solicitante
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Nombre:{' '}
          </Text>
          <Text>{props.profile.name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Correo electronico:{' '}
          </Text>
          <Text>{props.profile.email}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Fecha de nacimiento:{' '}
          </Text>
          <Text>{props.profile.birthday}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Sexo:
          </Text>
          <Text>{props.profile.sex == 'MAN' ? 'Hombre' : 'Mujer'}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Codigo postal:{' '}
          </Text>
          <Text>{props.profile.zip_code}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={Style.textBold}>
            Estado:
          </Text>
          <Text>{props.profile.state}</Text>
        </View>
        <View style={Style.mt40}>
          <Text allowFontScaling={false} style={Style.cardTitle}>
            Información de pago
          </Text>
          <Text>{paymentMenthod}</Text>
        </View>
        <View style={Style.mt40}>
          <PrimaryButton
            text={props.type === 'anual' ? 'Comprar' : 'Suscribir'}
            loadingBtn={props.loading}
            onPress={() => props.pay()}
          />
        </View>
      </Card>
    </View>
  );
};

step.defaultProps = {};

export default step;
