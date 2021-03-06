import React from 'react';
import { Card } from 'react-native-elements';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  AsyncStorage,
  FlatList,
  ActivityIndicator
} from 'react-native';
import NumberFormat from 'react-number-format';
import { http } from '../../networking/ApiClient';

import Style from './styles';
import Colors from '../../constants/Colors';

const logoPolicy = require('../../assets/images/icons/policy.png');

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InsurancesList: [],
      loadingInsurance: true
    };
  }

  async componentDidMount() {
    const uuid = await AsyncStorage.getItem('uuid');
    http
      .get(`client/${uuid}/products/voluntary`)
      .then(result => {
        this.setState(
          {
            loadingInsurance: false,
            InsurancesList: result.data
          },
          () => console.log(this.state.InsutancesList)
        );
      })
      .catch(error => {
        alert(error);
        this.setState({ loadingInsurance: false });
      });
  }

  render() {
    const { InsurancesList, loadingInsurance } = this.state;
    return (
      <View style={Style.container}>
        {!loadingInsurance ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            data={InsurancesList}
            renderItem={({ item }) => (
              <View key={item.id} style={Style.flatListView}>
                <Card key={item.id} containerStyle={Style.flatCardItem}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Detail', {
                        policyId: item.product.uuid
                      })
                    }>
                    <View
                      style={[Style.flatCardPrice, { backgroundColor: item.product.colour_app }]}>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={2}
                        style={[
                          Style.cardItemTextPrice,
                          { color: 'white', lineHeight: 12, marginTop: 2 }
                        ]}>
                        <NumberFormat
                          value={item.product.annual_price / 12}
                          displayType="text"
                          thousandSeparator
                          decimalScale={2}
                          prefix="$"
                          fixedDecimalScale
                          renderText={value => (
                            <Text
                              allowFontScaling={false}
                              numberOfLines={1}
                              style={Style.cardItemTextPrice}>
                              {'Desde '}
                              {value}{' '}
                            </Text>
                          )}
                        />
                        al mes
                      </Text>
                    </View>
                    <View style={{ padding: 15 }}>
                      <View style={Style.cardItemContainerImage}>
                        <Image
                          source={{ uri: item.product.icon_url }}
                          style={{ height: 40, width: 40, alignSelf: 'center' }}
                        />
                      </View>
                      <Text allowFontScaling={false} numberOfLines={2} style={Style.cardItemName}>
                        {item.custom_name != null ? item.custom_name : item.product.name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={2}
                        style={Style.cardItemDescription}>
                        {item.product.short_description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              </View>
            )}
            // Setting the number of column
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" animating={loadingInsurance} />
          </View>
        )}
      </View>
    );
  }
}

List.navigationOptions = {
  headerTitle: (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0
      }}>
      <Text allowFontScaling={false} style={{ color: 'white', fontSize: 17, paddingLeft: 5 }}>
        Comprar suscripciones
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
export default List;
