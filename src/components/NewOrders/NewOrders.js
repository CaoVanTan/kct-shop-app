import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Spinner from '../Spinner/Spinner';
import useStyle from './styles';
import EmptyOrder from '../../assets/images/SVG/imageComponents/EmptyOrder';
import { scale } from '../../utils/scaling';
import { TextDefault } from '../Text';
import Order from '../Order/Order';
import { NAVIGATION_SCREEN } from '../../utils/constant';

export default function NewOrders({ data, loading, onRefresh }) {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();

  function emptyView() {
    if (loading) {
      return <Spinner />;
    }

    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <EmptyOrder width={scale(250)} height={scale(250)} />
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault bolder center H4>
            Không có đơn hàng
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.emptyButton}
          onPress={() => navigation.navigate(NAVIGATION_SCREEN.Home)}>
          <TextDefault textColor={colors.buttonText} bold H5 center>
            Bắt đầu đặt hàng
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      style={{ marginTop: 16 }}
      data={data.length > 0 ? data : []}
      refreshing={false}
      onRefresh={() => onRefresh()}
      ListEmptyComponent={emptyView}
      renderItem={({ item }) => <Order data={item} />}
    />
  );
}
