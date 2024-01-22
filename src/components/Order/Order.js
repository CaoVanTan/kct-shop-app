import { useNavigation, useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import AppImage from '../AppImage/AppImage';
import TextDefault from '../Text/TextDefault/TextDefault';
import useStyle from './styles';
import { formatCurrency } from '../../utils/format';
import i18n from '../../configs/i18n';

export const orderStatuses = [
  {
    key: 'pending',
    status: 1,
    icon: ICONS_NAME.Clock,
    color: COLORS.primary,
  },
  {
    key: 'received',
    status: 2,
    icon: ICONS_NAME.Checked,
    color: COLORS.blueColor,
  },
  {
    key: 'waiting',
    status: 3,
    icon: ICONS_NAME.Checked,
    color: COLORS.blueColor,
  },
  {
    key: 'delivering',
    status: 4,
    icon: ICONS_NAME.Checked,
    color: COLORS.blueColor,
  },
  {
    key: 'delivered',
    status: 5,
    icon: ICONS_NAME.Checked,
    color: COLORS.blueColor,
  },
  {
    key: 'done',
    status: 6,
    icon: ICONS_NAME.Checked,
    color: COLORS.blueColor,
  },
];

const Order = ({ data }) => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const checkStatus = (status) => {
    const obj = orderStatuses.filter((item) => {
      return item.key === status;
    });
    return obj[0];
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      key={data.id.toString()}
      onPress={() =>
        navigation.navigate(NAVIGATION_SCREEN.OrderDetail, {
          id: data.id,
        })
      }>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <AppImage
            imgStyle={styles.imgResponsive}
            imgSource={{ uri: data.image }}
            spinnerProps={{ style: styles.loadingView }}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextDefault H5 bold style={alignment.MBxSmall}>
            {data.name}
          </TextDefault>
          <TextDefault line={3} textColor={colors.tagColor} H5 bold>
            {formatCurrency(data.amount_total)}
          </TextDefault>
        </View>
        <View style={[styles.Vline, { marginHorizontal: 8 }]} />

        <View style={styles.rightContainer}>
          <Ionicons
            name={checkStatus(data.state).icon}
            size={scale(28)}
            color={checkStatus(data.state).color}
          />
          <TextDefault
            textColor={checkStatus(data.state).color}
            style={alignment.MTxSmall}
            bold
            center>
            {i18n.t(checkStatus(data.state).key)}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  );
};

Order.propTypes = {
  navigation: PropTypes.object,
  activeOrders: PropTypes.arrayOf(PropTypes.object),
  pastOrders: PropTypes.arrayOf(PropTypes.object),
};

export default Order;
