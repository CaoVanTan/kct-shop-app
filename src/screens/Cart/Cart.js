import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../configs/i18n';
import EmptyCart from '../../assets/images/SVG/imageComponents/EmptyCart';
import {
  CartItem,
  FlashMessage,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import Database from '../../configs/Database';
import { onSetCart } from '../../redux/actions/cartAction';
import { formatCurrency } from '../../utils/format';
import { createOrder } from '../../api/Order/Order';

function Cart() {
  const styles = useStyle();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cart = useSelector((state) => state.cart.cart) || [];
  const address = useSelector((state) => state.address.address) || {};
  const user = useSelector((state) => state.auth.user);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const paymentMethod = {
    payment: 'COD',
    label: i18n.t('cod'),
    index: 2,
    icon: ICONS_NAME.Cash,
    iconSize: scale(25),
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('titleCart'),
      headerRight: null,
    });
  }, [navigation]);

  async function addQuantity(index) {
    cart[index].quantity += 1;
    await Database.setCart({ value: [...cart] });
    dispatch(onSetCart([...cart]));
  }

  async function subtractQuantity(index) {
    if (cart[index].quantity === 1) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity -= 1;
    }
    await Database.setCart({ value: [...cart] });
    dispatch(onSetCart([...cart]));
  }

  function calculatePrice() {
    let itemTotal = 0;
    cart.forEach((cartItem) => {
      if (!cartItem.total_price) {
        return;
      }
      itemTotal += cartItem.total_price * cartItem.quantity;
    });
    return itemTotal;
  }

  function validateOrder() {
    if (!cart.length) {
      FlashMessage({
        message: i18n.t('validateItems'),
      });
      return false;
    }
    if (Object.values(address).length === 0) {
      FlashMessage({
        message: i18n.t('validateDelivery'),
      });
      return false;
    }
    if (user.user_id.phone.length < 1) {
      navigation.navigate(NAVIGATION_SCREEN.Profile, { backScreen: 'Cart' });
      return false;
    }
    return true;
  }

  function transformOrder(cartData) {
    return cartData.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
        price_unit: product.total_price,
        sugar: product.sugar ? product.sugar.title : '',
        ice: product.ice ? product.ice.title : '',
        size_id: product.size_id ? product.size_id.id : '',
        topping_ids: product.topping_ids
          ? product.topping_ids.map((item) => {
              return { id: item.id, name: item.title };
            })
          : [],
      };
    });
  }

  const onCreateOrder = () => {
    setLoading(true);
    const items = transformOrder(cart);

    createOrder({
      access_token: accessToken,
      product_ids: items,
      address_id: address.id,
      payment_method: paymentMethod.payment.toLowerCase(),
      note: note,
    })
      .then((res) => {
        setLoading(false);
        FlashMessage({
          message: 'Bạn đã đặt hàng thành công.',
        });
        Database.setCart({ value: [] });
        dispatch(onSetCart([]));

        navigation.reset({
          routes: [
            { name: 'Home' },
            {
              name: 'OrderDetail',
              params: { id: res.id },
            },
          ],
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  function emptyCart() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <EmptyCart width={scale(180)} height={scale(180)} />
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault H4 style={{ ...alignment.MTlarge }} bold center>
            {i18n.t('emptyCart')}
          </TextDefault>
          <TextDefault
            style={{ ...alignment.MTlarge }}
            textColor={colors.fontSecondColor}
            bold
            center>
            {i18n.t('hungry')}?
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.emptyButton}
          onPress={() => navigation.navigate(NAVIGATION_SCREEN.Home)}>
          <TextDefault textColor={colors.buttonText} bold H5 center>
            {i18n.t('emptyCartBtn')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <WrapperView>
      <View style={styles.mainContainer}>
        {cart.length === 0 ? (
          emptyCart()
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.flex}
              contentContainerStyle={[alignment.PLmedium, alignment.PRmedium]}>
              <View style={[styles.dealContainer, styles.pT10, styles.mB10]}>
                {cart.map((product, index) => (
                  <View key={index} style={[styles.itemContainer, styles.pB5]}>
                    {product.total_price && product.name ? (
                      <CartItem
                        product={product}
                        dealPrice={
                          parseFloat(product.total_price) * product.quantity
                        }
                        addQuantity={() => {
                          addQuantity(index);
                        }}
                        subtractQuantity={() => {
                          subtractQuantity(index);
                        }}
                      />
                    ) : (
                      <Spinner backColor="transparent" />
                    )}
                  </View>
                ))}
              </View>
              <View style={[styles.priceContainer, styles.mB10]}>
                <View
                  style={[
                    styles.horizontalLine,
                    styles.pB10,
                    styles.width100,
                    styles.mB10,
                  ]}
                />
                <View style={[styles.floatView, styles.pB10]}>
                  <TextDefault
                    numberOfLines={1}
                    textColor={colors.buttonBackgroundBlue}
                    style={{ width: '30%' }}
                    medium
                    H5>
                    {i18n.t('totalAmount')}
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    textColor={colors.buttonBackgroundBlue}
                    style={{ width: '70%' }}
                    medium
                    right
                    H5>
                    {formatCurrency(calculatePrice())}
                  </TextDefault>
                </View>
              </View>

              {isLogin && user && (
                <>
                  <View
                    style={[styles.contactContainer, styles.pT10, styles.mB10]}>
                    <View style={[styles.floatView, styles.pB10]}>
                      <TextDefault numberOfLines={1} H5 bold>
                        {i18n.t('contactInfo')}
                      </TextDefault>
                    </View>
                    <View style={[styles.floatView, styles.pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={colors.fontSecondColor}
                        H5>
                        {i18n.t('name')}
                      </TextDefault>
                      <TextDefault numberOfLines={1} medium H5 right>
                        {user.user_id.name}
                      </TextDefault>
                    </View>
                    <View style={[styles.floatView, styles.pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={colors.fontSecondColor}
                        H5>
                        {i18n.t('phone')}
                      </TextDefault>
                      <TextDefault numberOfLines={1} medium H5 right>
                        {user.user_id.phone || ''}
                      </TextDefault>
                    </View>
                  </View>
                  <View
                    style={[styles.contactContainer, styles.pT10, styles.mB10]}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.pB10}
                      onPress={() => {
                        if (Object.values(address).length === 0) {
                          navigation.navigate(NAVIGATION_SCREEN.NewAddress, {
                            backScreen: 'Cart',
                          });
                        } else {
                          navigation.navigate(NAVIGATION_SCREEN.CartAddress);
                        }
                      }}>
                      <View style={[styles.floatView, styles.pB10]}>
                        <TextDefault
                          numberOfLines={1}
                          style={{ width: '50%' }}
                          H5
                          bold>
                          {i18n.t('deliveryAddress')}
                        </TextDefault>
                        <TextDefault H5 textColor={colors.buttonBackgroundBlue}>
                          {i18n.t('change')}
                        </TextDefault>
                      </View>
                      {Object.keys(address).length !== 0 ? (
                        <>
                          <TextDefault textColor={colors.fontSecondColor} H5>
                            {address.address}
                          </TextDefault>
                          <TextDefault textColor={colors.fontSecondColor} H5>
                            {address.address_detail}
                          </TextDefault>
                        </>
                      ) : (
                        <TextDefault textColor={colors.fontSecondColor} H5>
                          {i18n.t('deliveryAddressmessage')}
                        </TextDefault>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[styles.contactContainer, styles.pT10, styles.mB10]}>
                    <View style={[styles.floatView, styles.mB10]}>
                      <TextDefault bold H5>
                        {i18n.t('paymentMethod')}
                      </TextDefault>
                    </View>
                    <TouchableOpacity
                      style={[styles.floatView, styles.pB10, styles.pT10]}
                      onPress={() => {}}>
                      <View style={alignment.MRxSmall}>
                        <MaterialCommunityIcons
                          name={paymentMethod.icon}
                          size={paymentMethod.iconSize - scale(5)}
                          color={colors.iconColorPrimary}
                        />
                      </View>
                      <TextDefault
                        textColor={colors.placeHolderColor}
                        H5
                        style={styles.flex}>
                        {paymentMethod.label}
                      </TextDefault>
                      <TextDefault medium H5 right>
                        {formatCurrency(calculatePrice())}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              {isLogin && user ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={loading}
                  onPress={() => {
                    if (validateOrder()) {
                      onCreateOrder();
                    }
                  }}
                  style={styles.button}>
                  {loading ? (
                    <ActivityIndicator
                      size="large"
                      style={{ flex: 1, justifyContent: 'center' }}
                      color={colors.buttonText}
                    />
                  ) : (
                    <TextDefault textColor={colors.buttonText} medium H5 center>
                      {i18n.t('orderBtn')}
                    </TextDefault>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate(NAVIGATION_SCREEN.CreateAccount);
                  }}
                  style={styles.button}>
                  <TextDefault
                    textColor={colors.buttonText}
                    style={{ width: '100%' }}
                    H5
                    medium
                    center
                    uppercase>
                    {i18n.t('loginOrCreateAccount')}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </WrapperView>
  );
}

export default Cart;
