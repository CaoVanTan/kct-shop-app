import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FilledTextField } from 'react-native-material-textfield';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import i18n from '../../configs/i18n';
import {
  FlashMessage,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import {
  LABEL_ADDRESS,
  LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE,
  LONGITUDE_DELTA,
  NAVIGATION_SCREEN,
} from '../../utils/constant';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { createAddress } from '../../api/Address/Address';
import { hasLocationPermission } from '../../services/Location';
import { onSetAddress } from '../../redux/actions/addressAction';
import Database from '../../configs/Database';

function NewAddress() {
  const route = useRoute();
  const styles = useStyle();
  const addressRef = useRef();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const address = useSelector((state) => state.address.address) || {};

  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState('');
  const [deliveryAddressError, setDeliveryAddressError] = useState('');
  const [deliveryDetailsError, setDeliveryDetailsError] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(LABEL_ADDRESS[0].value);
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitude: LONGITUDE,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const regionObj = route.params ? route.params.regionChange : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('addAddress'),
      headerRight: null,
    });
  }, [navigation]);

  useEffect(() => {
    getLocationAsync();
  }, []);

  useEffect(() => {
    if (regionObj !== null) {
      regionChange(regionObj);
    }
  }, [regionObj]);

  async function getLocationAsync() {
    const status = await hasLocationPermission();

    if (status) {
      Geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: parseFloat(position.coords.latitude),
            latitudeDelta: LATITUDE_DELTA,
            longitude: parseFloat(position.coords.longitude),
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(locationData);
          regionChange(locationData);
          console.log(position);
        },
        (error) => {
          FlashMessage({
            message: 'Quyền vị trí không được cấp',
          });
          setRegion({
            latitude: LATITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitude: LONGITUDE,
            longitudeDelta: LONGITUDE_DELTA,
          });
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        },
      );
    } else {
      FlashMessage({
        message: 'Quyền vị trí không được cấp',
      });
    }
  }

  console.log(region);

  async function regionChange(region) {
    await Geocoder.from(region.latitude, region.longitude)
      .then((response) => {
        const address = response.results[0].formatted_address.replace(
          ', Vietnam',
          '',
        );
        console.log('Địa chỉ:', address);
        setDeliveryAddress(address);
        setRegion(region);
        addressRef.current.setValue(address);
      })
      .catch((error) => console.log('Lỗi lấy địa chỉ:', error));
  }

  const onAddAddress = () => {
    setLoading(true);
    createAddress({
      access_token: accessToken,
      label: selectedLabel,
      address: deliveryAddress,
      address_detail: deliveryDetails,
      lat: region.latitude,
      long: region.longitude,
    })
      .then(async (res) => {
        setLoading(false);
        FlashMessage({
          message: 'Đã thêm địa chỉ',
        });

        if (Object.values(address).length === 0) {
          const data = {
            label: selectedLabel,
            address: deliveryAddress,
            address_detail: deliveryDetails,
            lat: region.latitude,
            long: region.longitude,
          };
          await Database.setAddress({
            value: { ...res, ...data, selected: true },
          });
          dispatch(onSetAddress({ ...res, ...data, selected: true }));
        }

        const cartAddress = route.params ? route.params.backScreen : null;
        if (cartAddress === NAVIGATION_SCREEN.Cart) {
          navigation.navigate(NAVIGATION_SCREEN.Cart);
        } else {
          navigation.goBack();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  };

  const onSave = () => {
    const addressError = !deliveryAddress.trim().length
      ? 'Địa chỉ giao hàng không được bỏ trống'
      : null;
    const detailAddressError = !deliveryDetails.trim().length
      ? 'Chi tiết địa chỉ không được bỏ trống'
      : null;

    setDeliveryAddressError(addressError);
    setDeliveryDetailsError(detailAddressError);

    if (deliveryAddressError === null && deliveryDetailsError === null) {
      onAddAddress();
    }
  };

  return (
    <WrapperView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
        style={styles.flex}
        enabled>
        <View style={styles.flex}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.flex}
              scrollEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}
              rotateEnabled={false}
              showsUserLocation={true}
              initialRegion={region}
              region={region}
              provider={PROVIDER_GOOGLE}
              onTouchMove={() => {
                navigation.navigate(NAVIGATION_SCREEN.FullMap, {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  currentScreen: 'NewAddress',
                });
              }}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.subContainer}>
              <View style={styles.upperContainer}>
                <View style={styles.labelButtonContainer}>
                  <View style={styles.labelTitleContainer}>
                    <TextDefault H5 bold>
                      Nhãn:
                    </TextDefault>
                  </View>
                  <View style={styles.buttonInline}>
                    {LABEL_ADDRESS.map((label, index) => {
                      const isSelected = selectedLabel === label.value;
                      return (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          key={index}
                          style={
                            isSelected ? styles.activeLabel : styles.labelButton
                          }
                          onPress={() => {
                            setSelectedLabel(label.value);
                          }}>
                          {isSelected && (
                            <Icon
                              name="checkmark-circle"
                              size={20}
                              color={colors.lightBackground}
                            />
                          )}
                          <TextDefault
                            textColor={
                              isSelected
                                ? colors.lightBackground
                                : colors.placeHolderColor
                            }
                            bold
                            center>
                            {i18n.t(label.title)}
                          </TextDefault>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.addressContainer}>
                  <TouchableOpacity
                    style={[alignment.PBsmall, alignment.PTsmall]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setDeliveryAddressError('');
                      setDeliveryDetailsError('');
                      navigation.navigate(NAVIGATION_SCREEN.FullMap, {
                        latitude: region.latitude,
                        longitude: region.longitude,
                        currentScreen: 'NewAddress',
                      });
                    }}>
                    <FilledTextField
                      error={deliveryAddressError}
                      ref={addressRef}
                      editable={false}
                      value={deliveryAddress}
                      label={
                        deliveryAddress
                          ? i18n.t('deliveryAddress')
                          : i18n.t('selectDeliveryAddress')
                      }
                      labelFontSize={scale(12)}
                      multiline={true}
                      numberOfLines={2}
                      fontSize={scale(12)}
                      activeLineWidth={0}
                      lineWidth={0}
                      labelHeight={20}
                      maxLength={100}
                      textColor={colors.fontMainColor}
                      baseColor={colors.fontMainColor}
                      errorColor={colors.errorColor}
                      tintColor={
                        !deliveryAddressError
                          ? colors.selected
                          : colors.errorColor
                      }
                      labelTextStyle={styles.labelStyle}
                      inputContainerStyle={styles.textContainer}
                      onChangeText={(text) => {
                        setDeliveryAddress(text);
                      }}
                      onBlur={() => {
                        setDeliveryAddressError(
                          !deliveryAddress.trim().length
                            ? 'Địa chỉ giao hàng không được bỏ trống'
                            : null,
                        );
                      }}
                    />
                  </TouchableOpacity>

                  <View style={alignment.MTxSmall} />
                  <FilledTextField
                    error={deliveryDetailsError}
                    value={deliveryDetails}
                    label={i18n.t('deliveryDetails')}
                    labelFontSize={scale(12)}
                    fontSize={scale(12)}
                    textAlignVertical="top"
                    multiline={false}
                    maxLength={30}
                    activeLineWidth={0}
                    lineWidth={0}
                    labelHeight={20}
                    textColor={colors.fontMainColor}
                    baseColor={colors.fontMainColor}
                    errorColor={colors.errorColor}
                    tintColor={
                      !deliveryAddressError
                        ? colors.selected
                        : colors.errorColor
                    }
                    labelTextStyle={styles.labelStyle}
                    inputContainerStyle={styles.textContainer}
                    onChangeText={(text) => {
                      setDeliveryDetails(text);
                    }}
                    onBlur={() => {
                      setDeliveryDetailsError(
                        !deliveryDetails.trim().length
                          ? 'Chi tiết địa chỉ không được bỏ trống'
                          : null,
                      );
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                disabled={loading}
                onPress={onSave}
                activeOpacity={0.5}
                style={styles.saveBtnContainer}>
                {loading ? (
                  <View style={styles.spinnerView}>
                    <Spinner
                      backColor="transparent"
                      spinnerColor={colors.buttonText}
                    />
                  </View>
                ) : (
                  <TextDefault textColor={colors.buttonText} H5 bold>
                    {i18n.t('saveContBtn')}
                  </TextDefault>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[alignment.PBsmall, alignment.PTsmall]}
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}>
                <TextDefault H5 bold>
                  {i18n.t('cancelled')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </WrapperView>
  );
}

export default NewAddress;
