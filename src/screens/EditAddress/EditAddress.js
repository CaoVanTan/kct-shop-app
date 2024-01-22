import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FilledTextField } from 'react-native-material-textfield';
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
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  NAVIGATION_SCREEN,
} from '../../utils/constant';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { editAddress } from '../../api/Address/Address';

function EditAddress() {
  const { colors } = useTheme();
  const route = useRoute();
  const styles = useStyle();
  const addressRef = useRef(null);
  const navigation = useNavigation();
  const id = route.params.id ?? null;
  const regionObj = route.params.regionChange ?? null;
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [selectedLabel, setSelectedLabel] = useState(
    route.params.label ?? LABEL_ADDRESS[0].value,
  );
  const [region, setRegion] = useState({
    latitude: parseFloat(route.params.lat ?? ''),
    latitudeDelta: LATITUDE_DELTA,
    longitude: parseFloat(route.params.long ?? ''),
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [deliveryAddress, setDeliveryAddress] = useState(
    route.params.address ?? '',
  );
  const [deliveryDetails, setDeliveryDetails] = useState(
    route.params.address_detail ?? '',
  );
  const [deliveryAddressError, setDeliveryAddressError] = useState('');
  const [deliveryDetailsError, setDeliveryDetailsError] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      title: i18n.t('editAddress'),
    });
  }, [navigation]);

  useEffect(() => {
    if (regionObj !== null) {
      regionChange(regionObj);
    }
  }, [regionObj]);

  async function regionChange(regionData) {
    await Geocoder.from(regionData.latitude, regionData.longitude)
      .then((response) => {
        const address = response.results[0].formatted_address.replace(
          ', Vietnam',
          '',
        );
        setDeliveryAddress(address);
        setRegion(regionData);
        addressRef.current.setValue(address);
      })
      .catch((error) => console.log('Lỗi lấy địa chỉ:', error));
  }

  const onEditAddress = () => {
    setLoading(true);
    editAddress({
      access_token: accessToken,
      id: id,
      label: selectedLabel,
      address: deliveryAddress,
      address_detail: deliveryDetails,
      lat: region.latitude,
      long: region.longitude,
    })
      .then(() => {
        setLoading(false);
        FlashMessage({
          message: 'Địa chỉ đã được cập nhật',
        });
        navigation.goBack();
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
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
              style={{ flex: 1 }}
              scrollEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              showsCompass={false}
              showsIndoors={false}
              rotateEnabled={false}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsPointsOfInterest={false}
              // initialRegion={{
              //   latitude: parseFloat(
              //     route.params.lat ?? regionObj.latitude ?? LATITUDE,
              //   ),
              //   latitudeDelta: LATITUDE_DELTA,
              //   longitude: parseFloat(
              //     route.params.long ?? regionObj.longitude ?? LONGITUDE,
              //   ),
              //   longitudeDelta: LONGITUDE_DELTA,
              // }}
              region={region}
              provider={PROVIDER_GOOGLE}
              onTouchMove={() => {
                navigation.navigate(NAVIGATION_SCREEN.FullMap, {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  currentScreen: 'EditAddress',
                  id: id,
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
            contentContainerStyle={styles.subContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.upperContainer}>
              <View style={styles.labelButtonContainer}>
                <View style={alignment.PBsmall}>
                  <TextDefault H5 bold>
                    Nhãn
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
                    label={i18n.t('deliveryAddress')}
                    fontSize={scale(12)}
                    labelFontSize={scale(12)}
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
                    labelOffset={{ y1: -5 }}
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

                <FilledTextField
                  error={deliveryDetailsError}
                  label={i18n.t('deliveryDetails')}
                  labelFontSize={scale(12)}
                  activeLineWidth={0}
                  lineWidth={0}
                  labelHeight={20}
                  fontSize={scale(12)}
                  textAlignVertical="top"
                  multiline={false}
                  maxLength={30}
                  textColor={colors.fontMainColor}
                  baseColor={colors.fontMainColor}
                  errorColor={colors.errorColor}
                  tintColor={
                    !deliveryDetailsError ? colors.selected : colors.errorColor
                  }
                  labelTextStyle={styles.labelStyle}
                  inputContainerStyle={styles.textContainer}
                  labelOffset={{ y1: -5 }}
                  value={deliveryDetails}
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
              onPress={() => {
                const deliveryAddressError = !deliveryAddress.trim().length
                  ? 'Địa chỉ giao hàng không được bỏ trống'
                  : null;
                const deliveryDetailsError = !deliveryDetails.trim().length
                  ? 'Chi tiết địa chỉ không được bỏ trống'
                  : null;

                setDeliveryAddressError(deliveryAddressError);
                setDeliveryDetailsError(deliveryDetailsError);

                if (
                  deliveryAddressError === null &&
                  deliveryDetailsError === null
                ) {
                  onEditAddress();
                }
              }}
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
              <TextDefault H4 bold>
                Hủy
              </TextDefault>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </WrapperView>
  );
}

export default EditAddress;
