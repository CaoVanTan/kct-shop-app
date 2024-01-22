import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import useStyle from './styles';
import i18n from '../../configs/i18n';
import { scale } from '../../utils/scaling';
import { NAVIGATION_SCREEN } from '../../utils/constant';
import { Spinner, TextDefault, WrapperView } from '../../components';
import { getNotifications } from '../../api/Notification/Notification';
import EmptyOrder from '../../assets/images/SVG/imageComponents/EmptyOrder';
import NotificationItem from '../../components/Notification/NotificationItem';

const Notification = () => {
  const styles = useStyle();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const deviceId = useSelector((state) => state.conf.deviceId);

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t('titleNotification'),
      headerRight: null,
    });
    onGetNotifications();
  }, [navigation]);

  const onGetNotifications = () => {
    setLoading(true);
    getNotifications({
      access_token: accessToken,
      device_id: deviceId,
    })
      .then((res) => {
        setNotifications(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  function emptyView() {
    if (loading) {
      return <Spinner />;
    }

    return (
      <View style={styles.containerImage}>
        <View style={styles.imageContainer}>
          <EmptyOrder width={scale(250)} height={scale(250)} />
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault bolder center H4>
            {i18n.t('noNotifications')}
          </TextDefault>
        </View>
      </View>
    );
  }

  return (
    <WrapperView>
      <FlatList
        keyExtractor={(item) => item.id}
        style={{ marginTop: 16, width: '90%', alignSelf: 'center' }}
        showsVerticalScrollIndicator={false}
        data={notifications.length > 0 ? notifications : []}
        refreshing={false}
        onRefresh={() => onGetNotifications()}
        ListEmptyComponent={emptyView}
        renderItem={({ item }) => <NotificationItem data={item} />}
      />
    </WrapperView>
  );
};

export default Notification;
