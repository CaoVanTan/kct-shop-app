import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
  WrapperView,
  RadioComponent,
  TextDefault,
} from '../../components';
import CartComponent from '../../components/CustomizeComponents/CartComponent/CartComponent';
import CheckComponent from '../../components/CustomizeComponents/CheckComponent/CheckComponent';
import HeadingComponent from '../../components/CustomizeComponents/HeadingComponent/HeadingComponent';
import ImageHeader from '../../components/CustomizeComponents/ImageHeader/ImageHeader';
import { alignment } from '../../utils/alignment';
import { NAVIGATION_SCREEN, OPTION_ORDER } from '../../utils/constant';
import useStyle from './styles';
import { getProductDetail } from '../../api/Home/Home';
import styles from '../../components/CustomizeComponents/TitleComponent/styles';
import Database from '../../configs/Database';
import { onSetCart } from '../../redux/actions/cartAction';
import i18n from '../../configs/i18n';

function ItemDetail() {
  const route = useRoute();
  const styles = useStyle();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const id = route.params.id ?? null;
  const cart = useSelector((state) => state.cart.cart);
  const [product, setProduct] = useState();
  const [toppingsSelected, setToppingsSelected] = useState([]);
  const [sugarSelected, setSugarSelected] = useState(OPTION_ORDER[0]);
  const [iceSelected, setIceSelected] = useState(OPTION_ORDER[0]);
  const [sizeSelected, setSizeSelected] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('infoDetail'),
      headerRight: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    onGetProductDetail();
  }, []);

  const onGetProductDetail = () => {
    setIsLoading(true);
    getProductDetail({
      product_id: id,
    })
      .then((res) => {
        setProduct(res);
        setSizeSelected(res.size_ids[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setIsLoading(false);
      });
  };

  async function onAddToCart(quantity) {
    var totalPrice = product.price;
    if (sizeSelected && Object.values(sizeSelected).length > 0) {
      totalPrice += sizeSelected.price;
    }
    if (toppingsSelected.length > 0) {
      totalPrice += toppingsSelected.reduce((sum, currentItem) => {
        return sum + currentItem.price;
      }, 0);
    }

    const data = {
      id: product.id,
      name: product.name,
      image: product.image,
      total_price: totalPrice,
      quantity: quantity,
      sugar: sugarSelected,
      ice: iceSelected,
      size_id: sizeSelected,
      topping_ids: toppingsSelected,
    };

    const cartIndex = cart.findIndex((item) => data.id === item.id);
    if (cartIndex === -1) {
      await Database.setCart({ value: [...cart, data] });
      dispatch(onSetCart([...cart, data]));
    } else {
      if (
        cart[cartIndex].sugar === data.sugar &&
        cart[cartIndex].ice === data.ice &&
        cart[cartIndex].size_id === data.size_id &&
        cart[cartIndex].topping_ids === data.topping_ids
      ) {
        cart[cartIndex].quantity += quantity;
        await Database.setCart({ value: [...cart] });
        dispatch(onSetCart([...cart]));
      } else {
        await Database.setCart({ value: [...cart, data] });
        dispatch(onSetCart([...cart, data]));
      }
    }
    navigation.navigate(NAVIGATION_SCREEN.Cart);
  }

  async function onSelectOption(option) {
    const toppings = toppingsSelected;
    const index = toppings.findIndex((item) => item.id === option.id);
    if (index > -1) {
      toppings.splice(index, 1);
    } else {
      toppings.push(option);
    }
    setToppingsSelected([...toppings]);
  }

  function calculatePrice() {
    let total = 0;
    toppingsSelected.forEach((topping) => (total += topping.price));

    if (sizeSelected) {
      total += sizeSelected.price;
    }
    return product.price + total;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <WrapperView>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}>
          {product.image && <ImageHeader image={product.image} />}
          <View style={styles.subContainer}>
            <HeadingComponent
              title={product.name}
              price={calculatePrice()}
              desc={product.description}
            />
            <View style={styles.line} />
            {product.has_sugar && (
              <View>
                <TitleComponent title={i18n.t('selectSugar')} />
                <View style={[alignment.PLmedium, alignment.PRmedium]}>
                  <RadioComponent
                    type="sugar"
                    options={OPTION_ORDER}
                    selected={sugarSelected}
                    onPress={setSugarSelected}
                  />
                </View>
              </View>
            )}
            {product.has_ice && (
              <View>
                <TitleComponent title={i18n.t('selectIce')} />
                <View style={[alignment.PLmedium, alignment.PRmedium]}>
                  <RadioComponent
                    type="ice"
                    options={OPTION_ORDER}
                    selected={iceSelected}
                    onPress={setIceSelected}
                  />
                </View>
              </View>
            )}
            {product.size_ids.length > 0 && (
              <View>
                <TitleComponent title={i18n.t('selectSize')} />
                <View style={[alignment.PLmedium, alignment.PRmedium]}>
                  <RadioComponent
                    options={product.size_ids}
                    selected={sizeSelected}
                    onPress={setSizeSelected}
                  />
                </View>
              </View>
            )}
            {product.topping_ids.length > 0 && (
              <View>
                <TitleComponent title={i18n.t('selectTopping')} />
                <View style={[alignment.PLmedium, alignment.PRmedium]}>
                  <CheckComponent
                    options={product.topping_ids}
                    onPress={onSelectOption}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <CartComponent onPress={onAddToCart} />
      </View>
    </WrapperView>
  );
}

export default ItemDetail;

function TitleComponent(props) {
  const { colors } = useTheme();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <TextDefault numberOfLines={1} H5 bold>
          {props.title}
        </TextDefault>
      </View>
      <TextDefault
        style={[alignment.PLxSmall, alignment.PRxSmall]}
        textColor={
          props.error === true ? colors.errorColor : colors.placeHolderColor
        }
        H5
        medium
        center>
        {props.status}
      </TextDefault>
    </View>
  );
}
