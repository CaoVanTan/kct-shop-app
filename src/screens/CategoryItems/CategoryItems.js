import { useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { get } from 'lodash';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import EmptyFood from '../../assets/images/SVG/imageComponents/EmptyFood';
import {
  AppImage,
  FilterModal,
  RightButton,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { moderateScale, scale } from '../../utils/scaling';
import useStyle from './styles';
import { getProducts } from '../../api/Home/Home';
import { formatCurrency } from '../../utils/format';

function CategoryItems() {
  const route = useRoute();
  const styles = useStyle();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const id = route.params.id ?? null;
  const imgCateg = route.params.image ?? null;
  const name = route.params.name ?? null;
  const description = route.params.description ?? null;

  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
      headerRight: () => (
        <RightButton
          icon={ICONS_NAME.Filter}
          onPress={() => modalizeRef.current.open()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    onGetProducts(
      get(filters, 'min'),
      get(filters, 'max'),
      get(filters, 'order'),
    );
  }, []);

  const onGetProducts = (min, max, order) => {
    setIsLoading(true);
    getProducts({
      category_id: id,
      min: min,
      max: max,
      order: order,
    })
      .then((res) => {
        setProducts(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setIsLoading(false);
      });
  };

  const closeModal = () => {
    modalizeRef.current.close();
  };

  const setFilterss = (filterObj) => {
    setFilters(filterObj);
  };

  function renderGridCards(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(NAVIGATION_SCREEN.ItemDetail, { id: item.id });
        }}
        activeOpacity={0.7}
        style={styles.cardContainer}>
        <View style={styles.cardImageContainer}>
          <AppImage
            imgStyle={styles.imgResponsive}
            imgSource={
              item.image
                ? { uri: item.image }
                : require('../../assets/images/food_placeholder.png')
            }
            resizeMode={'cover'}
            spinnerProps={{ style: styles.loadingView }}
          />
        </View>
        <View style={[styles.textContainer]}>
          <TextDefault numberOfLines={2} style={alignment.MBxSmall} bolder H5>
            {item.name}
          </TextDefault>
          <TextDefault
            numberOfLines={2}
            textColor={styles.lightColor.color}
            small
            medium>
            {item.description === false ? '' : item.description}
          </TextDefault>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextDefault textColor={styles.tagColor.color} H4 bolder>
              {formatCurrency(item.price)}
            </TextDefault>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderListHeader() {
    return (
      <View style={styles.backgroundImageContainer}>
        <ImageBackground
          style={styles.backgroundImage}
          borderRadius={moderateScale(16)}
          source={
            imgCateg
              ? { uri: imgCateg }
              : require('../../assets/images/food_placeholder.png')
          }>
          <View style={styles.shadeContainer} />
          <View style={styles.backgroundImageTextContainer}>
            <TextDefault
              numberOfLines={1}
              textColor={styles.whiteFont.color}
              H4
              bolder>
              {name}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              textColor={styles.whiteFont.color}
              bold>
              {description}
            </TextDefault>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function emptyView() {
    if (isLoading) {
      return <Spinner />;
    } else {
      return (
        <View style={styles.emptyContainer}>
          <EmptyFood width={scale(250)} height={scale(250)} />
          <TextDefault H4 bold style={alignment.MTlarge}>
            Không có đồ uống nào
          </TextDefault>
        </View>
      );
    }
  }

  return (
    <WrapperView>
      <View style={[styles.flex]}>
        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.contentContaienr}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader()}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={emptyView}
          data={isLoading ? [] : products}
          refreshing={false}
          onRefresh={() => onGetProducts()}
          renderItem={({ item }) => renderGridCards(item)}
        />
      </View>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        modalTopOffset={headerHeight}
        avoidKeyboardLikeIOS={Platform.select({
          ios: true,
          android: false,
        })}
        keyboardAvoidingOffset={2}
        keyboardAvoidingBehavior="height">
        <FilterModal
          filterObj={filters}
          setFilters={setFilterss}
          onGetProducts={onGetProducts}
          closeFilterModal={closeModal}
        />
      </Modalize>
    </WrapperView>
  );
}
export default CategoryItems;
