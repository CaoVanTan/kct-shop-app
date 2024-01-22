import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Platform, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../../configs/i18n';
import EmptyAddress from '../../assets/images/SVG/imageComponents/EmptyAddress';
import {
  FlashMessage,
  RightButton,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { COLORS } from '../../theme';
import { alignment } from '../../utils/alignment';
import {
  ICONS_NAME,
  NAVIGATION_SCREEN,
  LABEL_ADDRESS,
} from '../../utils/constant';
import { moderateScale, scale } from '../../utils/scaling';
import useStyle from './styles';
import { deleteAddress, getAddress } from '../../api/Address/Address';
import { Modalize } from 'react-native-modalize';
import Database from '../../configs/Database';
import { onSetAddress } from '../../redux/actions/addressAction';

function Addresses() {
  const styles = useStyle();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const address = useSelector((state) => state.address.address) || {};
  const modalizeRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState([]);

  const addressIcons = {
    home: ICONS_NAME.Home,
    work: ICONS_NAME.Cart,
    other: ICONS_NAME.Location,
  };

  const colorIcons = {
    home: COLORS.redishPink,
    work: COLORS.primaryLightBlue,
    other: COLORS.primary,
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('myAddresses'),
      headerRight: () => (
        <RightButton
          icon={ICONS_NAME.Add}
          iconSize={scale(24)}
          onPress={() => navigation.navigate(NAVIGATION_SCREEN.NewAddress)}
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      onGetAddress();
    }, []),
  );

  const onGetAddress = () => {
    setLoading(true);
    getAddress({ access_token: accessToken })
      .then((res) => {
        setAddresses(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const onDeleteAddress = () => {
    setLoadingDel(true);
    onClose();
    deleteAddress({ access_token: accessToken, id: addressId.id })
      .then((response) => {
        FlashMessage({
          message: 'Đã xóa địa chỉ',
        });
        setLoading(true);
        getAddress({ access_token: accessToken })
          .then((res) => {
            setAddresses(res);
            if (
              Object.values(address).length !== 0 &&
              address.id === response.id
            ) {
              const addressSelected = res.find(
                (item) => item.selected === true,
              );
              console.log(addressSelected);
              Database.setAddress({ value: addressSelected || {} });
              dispatch(onSetAddress(addressSelected || {}));
            }
            setLoading(false);
          })
          .catch((err) => {
            console.log('err', err);
            setLoading(false);
          });

        setLoadingDel(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoadingDel(false);
      });
  };

  const onClose = () => {
    modalizeRef.current.close();
  };

  const emptyView = () => {
    if (loading) {
      return <Spinner />;
    } else {
      return (
        <View style={styles.subContainerImage}>
          <View style={styles.image}>
            <EmptyAddress width={scale(180)} height={scale(180)} />
          </View>
          <View style={styles.descriptionEmpty}>
            <TextDefault
              textColor={colors.fontMainColor}
              bold
              H5
              style={alignment.Msmall}>
              {i18n.t('noNotifications')}
            </TextDefault>
            <View>
              <TextDefault textColor={colors.fontSecondColor} center>
                Bạn chưa có địa chỉ nào.
                {'\n'}
                Nhấn Thêm địa chỉ mới để bắt đầu.
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.adressBtn}
              onPress={() => navigation.navigate(NAVIGATION_SCREEN.NewAddress)}>
              <TextDefault textColor={colors.white} H5 bold>
                {i18n.t('addAddress')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <WrapperView>
      <View style={styles.containerInfo}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={loading ? [] : addresses}
          style={[styles.flex, styles.width100]}
          contentContainerStyle={
            addresses.length > 0 ? styles.contentContainer : { flexGrow: 1 }
          }
          ListEmptyComponent={emptyView}
          keyExtractor={(item, index) => String(index)}
          ItemSeparatorComponent={() => <View style={styles.line} />}
          ListHeaderComponent={() => <View style={alignment.MTmedium} />}
          renderItem={({ item: address }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.width100}
              onPress={() => {}}>
              <View style={[styles.titleAddress, styles.width100]}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  {addressIcons[address.label] === ICONS_NAME.Home ? (
                    <MaterialIcons
                      name={addressIcons[address.label]}
                      size={20}
                      color={colorIcons[address.label]}
                    />
                  ) : (
                    <Ionicons
                      name={addressIcons[address.label]}
                      size={scale(20)}
                      color={colorIcons[address.label]}
                    />
                  )}

                  <TextDefault
                    bold
                    H5
                    style={[alignment.MTxSmall, alignment.MLsmall]}>
                    {i18n.t(
                      LABEL_ADDRESS.find((item) => item.value === address.label)
                        .title,
                    )}
                  </TextDefault>
                </View>
                <View style={[styles.titleAddress]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loadingDel}
                    style={[styles.iconButton, alignment.MRsmall]}
                    onPress={() => {
                      navigation.navigate(NAVIGATION_SCREEN.EditAddress, {
                        ...address,
                      });
                    }}>
                    <MaterialCommunityIcons
                      name={ICONS_NAME.Pencil}
                      size={scale(12)}
                      color={colors.placeHolderColor}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loadingDel}
                    style={styles.iconButton}
                    onPress={() => {
                      setAddressId(address);
                      modalizeRef.current.open('top');
                    }}>
                    <Ionicons
                      name={ICONS_NAME.Trash}
                      size={scale(16)}
                      color={colors.placeHolderColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.addressDetail}>
                <TextDefault textColor={colors.fontSecondColor}>
                  {address.address}, {address.address_detail}
                </TextDefault>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
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
            Bạn có chắc chắn muốn xóa địa chỉ?
          </TextDefault>
          <TextDefault style={{ marginTop: 12 }}>
            Tất cả đơn hàng được giao đến địa chỉ này đều bị xóa!
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
            onPress={async () => {
              onDeleteAddress();
            }}>
            <TextDefault center bolder>
              Đồng ý
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.width100, alignment.PBlarge, alignment.PTlarge]}
            onPress={() => onClose()}>
            <TextDefault center>Hủy</TextDefault>
          </TouchableOpacity>
        </View>
      </Modalize>
    </WrapperView>
  );
}
export default React.memo(Addresses);
