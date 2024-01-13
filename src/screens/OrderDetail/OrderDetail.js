import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import {
  FlashMessage,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { NAVIGATION_SCREEN } from '../../utils/constant';
import { moderateScale, scale } from '../../utils/scaling';
import useStyle from './styles';
import { cancelOrder, getOrderDetail } from '../../api/Order/Order';
import { formatCurrency } from '../../utils/format';

const ORDER_STATUSES = [
  {
    key: 'pending',
    name: 'Chờ xác nhận',
    status: 1,
    statusText: 'Đơn hàng của bạn vẫn đang chờ xử lý.',
  },
  {
    key: 'received',
    name: 'Chờ giao hàng',
    status: 2,
    statusText: 'Cửa hàng đang chuẩn bị đồ uống.',
  },
  {
    key: 'waiting',
    name: 'Chờ lấy hàng',
    status: 3,
    statusText: 'Đồ uống đã được giao cho nhân viên giao hàng.',
  },
  {
    key: 'delivering',
    name: 'Đang giao hàng',
    status: 4,
    statusText: 'Đồ uống đang được giao đến bạn.',
  },
  {
    key: 'delivered',
    name: 'Đã giao hàng',
    status: 5,
    statusText: 'Đồ uống đã được giao đến bạn thành công.',
  },
  {
    key: 'done',
    name: 'Hoàn thành',
    status: 6,
    statusText: 'Đơn hàng đã hoàn thành.',
  },
];

function OrderDetail() {
  const route = useRoute();
  const styles = useStyle();
  const { colors } = useTheme();
  const modalizeRef = useRef(null);
  const navigation = useNavigation();
  const id = route.params.id;
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [orderState, setOrderState] = useState('');
  const [deliveryEmp, setDeliveryEmp] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chi tiết đơn hàng',
      headerRight: null,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      onGetOrderDetail();
    }, []),
  );

  const onGetOrderDetail = () => {
    setLoading(true);
    getOrderDetail({
      access_token: accessToken,
      id: id,
    })
      .then((res) => {
        setOrder(res);
        setOrderState(res.state);
        setProducts(res.product_ids);
        setDeliveryEmp(res.delivery_emp_id);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const onCancelOrder = () => {
    setLoadingCancel(true);
    onClose();
    cancelOrder({
      access_token: accessToken,
      id: id,
    })
      .then(() => {
        setLoadingCancel(false);
        FlashMessage({
          message: 'Bạn đã hủy đơn hàng thành công.',
        });
        navigation.navigate(NAVIGATION_SCREEN.Orders);
      })
      .catch((err) => {
        console.log('err', err);
        setLoadingCancel(false);
      });
  };

  const checkStatus = (status) => {
    const obj = ORDER_STATUSES.filter((item) => {
      return item.key === status;
    });
    return obj[0];
  };

  const getOptionStr = (item) => {
    let toppingStr = '';
    item.topping_ids.map((i) => {
      toppingStr = toppingStr + i.name + ', ';
    });
    return `Size ${item.size_id.name}, ${toppingStr}${item.sugar}% đường,  ${item.ice}% đá`;
  };

  const onClose = () => {
    modalizeRef.current.close();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <WrapperView>
      <ScrollView style={[styles.flex]}>
        <View style={styles.container}>
          <TextDefault
            textColor={colors.buttonBackgroundBlue}
            bolder
            H3
            style={alignment.MBsmall}>
            Cảm ơn bạn!
          </TextDefault>
          <TextDefault
            textColor={colors.fontSecondColor}
            medium
            H5
            style={[alignment.MTsmall]}>
            Mã đơn hàng của bạn là
          </TextDefault>
          <TextDefault H4 bolder style={alignment.PTxSmall}>
            {order.name}
          </TextDefault>
          <TextDefault
            textColor={colors.fontSecondColor}
            bold
            H5
            style={[alignment.MTlarge]}>
            Trạng thái
          </TextDefault>
          <TextDefault
            textColor={colors.buttonBackgroundBlue}
            H5
            medium
            style={[alignment.MBsmall, alignment.MTxSmall]}>
            {checkStatus(orderState) ? checkStatus(orderState).name : ''}{' '}
            <TextDefault medium>
              (
              {checkStatus(orderState)
                ? checkStatus(orderState).statusText
                : ''}
              )
            </TextDefault>
          </TextDefault>
          <TextDefault textColor={colors.fontSecondColor} H5 bold>
            Địa chỉ giao hàng
          </TextDefault>
          <TextDefault style={{ ...alignment.PTxSmall }} H5>
            {order.address_id
              ? `${order.address_id.address_detail}, ${order.address_id.address}`
              : ''}
          </TextDefault>
        </View>

        <View style={[{ ...alignment.MTlarge }, styles.orderReceipt]}>
          {products.map((item, index) => (
            <View style={[styles.marginBottom10, styles.floatView]} key={index}>
              <TextDefault H5 style={{ width: '10%' }}>
                {item.product_uom_qty}x
              </TextDefault>
              <View style={{ width: '65%' }}>
                <TextDefault textColor={colors.fontMainColor}>
                  {item.product_name}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor}>
                  {getOptionStr(item)}
                </TextDefault>
              </View>
              <TextDefault
                textColor={colors.fontMainColor}
                style={{ width: '25%' }}
                right>
                {formatCurrency(item.price_subtotal)}
              </TextDefault>
            </View>
          ))}
          <View style={[styles.horizontalLine, styles.marginBottom10]} />
          <View style={[styles.floatView]}>
            <TextDefault
              textColor={colors.fontMainColor}
              bold
              style={{ width: '40%' }}>
              Tổng tiền
            </TextDefault>
            <TextDefault
              textColor={colors.fontMainColor}
              bold
              style={{ width: '60%' }}
              right>
              {formatCurrency(order.amount_total)}
            </TextDefault>
          </View>
        </View>

        {order.state === 'pending' && (
          <View
            style={{
              ...alignment.PTsmall,
              width: '80%',
              borderRadius: moderateScale(10),
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.buttonBackgroundBlue,
                alignItems: 'center',
                padding: moderateScale(16),
                borderRadius: moderateScale(10),
              }}
              onPress={() => modalizeRef.current.open('top')}>
              <TextDefault H5 bold textColor={colors.lightBackground}>
                Hủy đơn hàng
              </TextDefault>
            </TouchableOpacity>
          </View>
        )}

        {order.state === 'delivering' && (
          <View
            style={{
              marginHorizontal: 16,
              ...alignment.MBlarge,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextDefault textColor={colors.fontSecondColor} H5 bold>
                Nhân viên giao hàng:
              </TextDefault>
              <TextDefault
                style={{
                  ...alignment.PBxSmall,
                  ...alignment.PTxSmall,
                  marginLeft: 8,
                }}
                H5
                medium>
                {deliveryEmp.name}
              </TextDefault>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                ...alignment.MBsmall,
              }}>
              <TextDefault textColor={colors.fontSecondColor} H5 bold>
                Số điện thoại:
              </TextDefault>
              <TextDefault
                style={{
                  ...alignment.PBxSmall,
                  ...alignment.PTxSmall,
                  marginLeft: 8,
                }}
                H5
                medium>
                {deliveryEmp.phone}
              </TextDefault>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.empBtnStyle}
                onPress={() => Linking.openURL(`tel:${deliveryEmp.phone}`)}>
                <FontAwesome5
                  name="phone-alt"
                  size={16}
                  color={colors.lightBackground}
                />
                <TextDefault
                  style={{ marginLeft: 8 }}
                  textColor={colors.lightBackground}
                  bold>
                  Gọi điện
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(order.state === 'delivered' || order.state === 'done') && (
          <View style={styles.orderReceipt}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.floatView, { justifyContent: 'center' }]}
              onPress={() =>
                navigation.navigate(NAVIGATION_SCREEN.RateAndReview, {
                  id: order.id,
                  state: order.state,
                  ratingEmp: order.rating_emp,
                  ratingProduct: order.rating_product,
                  ratingDetail: order.rating_detail,
                })
              }>
              <Icon
                name="rate-review"
                size={scale(16)}
                color={colors.iconColorPrimary}
              />
              <TextDefault
                textColor={colors.iconColorPrimary}
                style={[
                  alignment.MBsmall,
                  alignment.MTsmall,
                  alignment.ML10,
                  { marginLeft: 4 },
                ]}
                H5
                bold
                center>
                Đánh giá đơn hàng
              </TextDefault>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        avoidKeyboardLikeIOS={Platform.select({
          ios: true,
          android: true,
        })}
        keyboardAvoidingOffset={2}
        keyboardAvoidingBehavior="height">
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextDefault bolder H5 style={{ marginTop: 20 }}>
            Bạn có chắc chắn muốn hủy đơn hàng?
          </TextDefault>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.buttonBackgroundBlue,
              borderRadius: moderateScale(10),
              width: '70%',
              padding: moderateScale(15),
              ...alignment.MTlarge,
            }}
            onPress={() => onCancelOrder()}>
            {loadingCancel ? (
              <ActivityIndicator
                size="small"
                style={{ justifyContent: 'center' }}
                color={colors.buttonText}
              />
            ) : (
              <TextDefault center bolder>
                Đồng ý
              </TextDefault>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[alignment.PBlarge, alignment.PTlarge, { width: '100%' }]}
            onPress={() => onClose()}>
            <TextDefault center>Hủy</TextDefault>
          </TouchableOpacity>
        </View>
      </Modalize>
    </WrapperView>
  );
}

export default OrderDetail;
