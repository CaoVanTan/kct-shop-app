import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import i18n from '../../configs/i18n';
import {
  NewOrders,
  HistoryOrders,
  TextDefault,
  WrapperView,
} from '../../components';
import useStyle from './style';
import { getOrders } from '../../api/Order/Order';
import { useCallback } from 'react';

function Orders() {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [loading, setLoading] = useState(false);
  const [newOrders, setNewOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isNewOrderSelected, setIsNewOrderSelected] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t('titleOrders'),
      headerRight: null,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      onGetOrders();
    }, []),
  );

  const onGetOrders = () => {
    setLoading(true);
    getOrders({
      access_token: accessToken,
    })
      .then((res) => {
        setNewOrders(res.new);
        setHistoryOrders(res.history);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  return (
    <WrapperView>
      <View style={[styles.flex, styles.bottom]}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsNewOrderSelected(false)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: !isNewOrderSelected
                  ? colors.selected
                  : 'transparent',
              },
            ]}>
            <TextDefault bold H5 numberOfLines={1}>
              {i18n.t('waitingForDelivery')}
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsNewOrderSelected(true)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: isNewOrderSelected
                  ? colors.selected
                  : 'transparent',
              },
            ]}>
            <TextDefault bold H5 numberOfLines={1}>
              {i18n.t('history')}
            </TextDefault>
          </TouchableOpacity>
        </View>
        {!isNewOrderSelected ? (
          <NewOrders
            data={newOrders}
            loading={loading}
            onRefresh={onGetOrders}
          />
        ) : (
          <HistoryOrders
            data={historyOrders}
            loading={loading}
            onRefresh={onGetOrders}
          />
        )}
      </View>
    </WrapperView>
  );
}

export default Orders;
