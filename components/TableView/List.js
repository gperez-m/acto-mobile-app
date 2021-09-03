import React from 'react';
import { Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import NumberFormat from 'react-number-format';

import dayjs from 'dayjs';
import toObject from 'dayjs/plugin/toObject';
import Header from './Header';
import Styles from './listStyles';

dayjs.extend(toObject);

renderSeparatorView = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#e2e2e2',
        marginTop: 10
      }}
    />
  );
};

renderStatus = item => {
  if (item.status.toLowerCase() === 'pending') {
    return 'PENDIENTE';
  }
  if (item.status.toLowerCase() === 'paid_out') {
    return 'PAGADO';
  }
  return 'CANCELADO';
};

const List = props => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header titles={props.titleList} />
      <View style={{ marginTop: 0 }}>
        {props.data.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 50 }}
            data={props.data}
            ItemSeparatorComponent={this.renderSeparatorView}
            renderItem={({ index, item }) => (
              <View key={index} style={Styles.flatListView}>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row' }}
                  onPress={() =>
                    props.navigation.navigate(
                      props.subscription ? 'OrderDetailSubscription' : 'OrderDetail',
                      {
                        orderId: item.uuid
                      }
                    )
                  }>
                  <Text allowFontScaling={false} style={Styles.listPoliciesItemLeft}>{`${dayjs(
                    item.created_at
                  ).format('DD/MM/YY')}`}</Text>
                  <Text allowFontScaling={false} style={Styles.listPoliciesItemCenterLong}>
                    {item.product.name}
                  </Text>
                  <View style={Styles.listPoliciesItemCenter}>
                    <NumberFormat
                      value={!props.subscription ? item.product_price : item.amount}
                      displayType="text"
                      thousandSeparator
                      decimalScale={2}
                      prefix="$"
                      fixedDecimalScale
                      renderText={value => (
                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={[Styles.listPoliciesItemCenter, Styles.itemPrice]}>
                          {value}{' '}
                        </Text>
                      )}
                    />
                  </View>
                  {props.subscription ? (
                    <Text allowFontScaling={false} style={Styles.listPoliciesItemRight}>
                      {`${dayjs(item.current_period_end).format('DD/MM/YY')}`}
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={[
                        Styles.listPoliciesItemRight,
                        item.status.toLowerCase() === 'paid_out' ? Styles.active : Styles.regular
                      ]}>
                      {this.renderStatus(item)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            // Setting the number of column
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={{ marginTop: 40, marginBottom: 40 }}>
            <Text allowFontScaling={false} style={{ textAlign: 'center' }}>
              {props.placeHolder}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

List.defaultProps = {
  titleList: [],
  data: [],
  navigation: () => null,
  placeHolder: 'No tienes historial'
};

export default List;
