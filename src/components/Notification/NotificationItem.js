import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useNavigation, useTheme } from '@react-navigation/native';
import useStyle from './styles';
import { TextDefault } from '../Text';
import { alignment } from '../../utils/alignment';
import AppImage from '../AppImage/AppImage';
import { NAVIGATION_SCREEN, VN_FORMAT_DATETIME } from '../../utils/constant';

const NotificationItem = ({ data }) => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push(NAVIGATION_SCREEN.OrderDetail, {
          id: Number.parseInt(data.res_id, 10),
        });
      }}
      activeOpacity={0.7}
      style={styles.itemContainer}>
      <View style={{ width: '25%' }}>
        <AppImage
          imgStyle={styles.imgResponsive}
          imgSource={{
            uri: data.image,
          }}
          spinnerProps={{ style: styles.loadingView }}
        />
      </View>
      <View style={styles.textContainer}>
        <TextDefault numberOfLines={1} style={alignment.MBxSmall} bold>
          {data.title}
        </TextDefault>
        <TextDefault
          numberOfLines={2}
          style={alignment.MBxSmall}
          textColor={colors.shadowColor}
          regular>
          {data.message}
        </TextDefault>
        <TextDefault
          numberOfLines={2}
          textColor={styles.lightColor.color}
          small
          medium>
          {moment(data.create_date).format(VN_FORMAT_DATETIME)}
        </TextDefault>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
