import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../../configs/i18n';
import { moderateScale } from '../../utils/scaling';
import { Spinner, TextDefault, WrapperView } from '../../components';
import AuthenticationContext from '../../context/Authentication';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import SettingModal from './components/SettingModal';
import useStyle from './styles';
import CodePush from 'react-native-code-push';

const languageTypes = [
  { value: 'Tiếng Việt', code: 'vn', index: 0 },
  { value: 'English', code: 'en', index: 1 },
];

function Settings() {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { logout } = useContext(AuthenticationContext);
  const modalizeRef = useRef(null);
  const modalizeRef1 = useRef(null);

  const [loading, setLoading] = useState(false);
  const [languageName, languageNameSetter] = useState('Tiếng Việt');
  const [activeRadio, activeRadioSetter] = useState(languageTypes[0].index);
  const [orderNotification, orderNotificationSetter] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t('titleSettings'),
      headerRight: null,
    });
    selectLanguage();
    // checkPermission();
  }, [navigation]);

  // useEffect(() => {
  //   AppState.addEventListener('change', _handleAppStateChange);
  //   return () => {
  //     AppState.remove('change', _handleAppStateChange);
  //   };
  // }, []);

  // const _handleAppStateChange = async (nextAppState) => {
  //   if (nextAppState === 'active') {
  //     let token = null;
  //     const permission = await getPermission();
  //     if (permission === 'granted') {
  // if (!profile.notificationToken) {
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   uploadToken({ variables: { token } });
  // }
  // orderNotificationSetter(profile.is_order_notification);
  //     } else {
  //       orderNotificationSetter(false);
  //     }
  //   }
  //   setAppState(nextAppState);
  // };

  // async function checkPermission() {
  //   const permission = await getPermission();
  //   if (permission !== 'granted') {
  //     orderNotificationSetter(false);
  //   } else {
  //     // orderNotificationSetter(profile.is_order_notification);
  //   }
  // }

  // async function getPermission() {
  //   const { status } = await Notifications.getPermissionsAsync();
  //   return status;
  // }

  async function selectLanguage() {
    const lang = await AsyncStorage.getItem('language');
    if (lang) {
      const defLang = languageTypes.findIndex((el) => el.code === lang);
      const langName = languageTypes[defLang].value;
      activeRadioSetter(defLang);
      languageNameSetter(langName);
    }
  }

  const onSelectedLanguage = async (active) => {
    const languageInd = active;
    if (Platform.OS === 'android') {
      await AsyncStorage.setItem('language', languageTypes[languageInd].code);
      CodePush.restartApp();
    }
  };

  async function updateUserInformation() {
    // updateUserInfo({
    //   variables: {
    //     name: profile.name,
    //     phone: profile.phone,
    //     is_active: false,
    //   },
    // });
  }

  async function updateNotificationStatus(notificationCheck) {
    let orderNotify, offerNotify;

    // const permission = await getPermission();
    // if (!profile.notificationToken || permission !== 'granted') {
    //   Linking.openSettings();
    // }
    if (notificationCheck === 'offer') {
      orderNotify = orderNotification;
    }

    if (notificationCheck === 'order') {
      orderNotificationSetter(!orderNotification);
      orderNotify = !orderNotification;
    }
    // mutate({
    //   variables: {
    //     offerNotification: offerNotify,
    //     orderNotification: orderNotify,
    //   },
    // });
  }

  const onClose = () => {
    modalizeRef.current.close();
    modalizeRef1.current.close();
  };

  return (
    <WrapperView>
      {loading && (
        <View style={{ ...StyleSheet.absoluteFill }}>
          <Spinner />
        </View>
      )}
      <View style={[styles.flex, styles.mainContainer]}>
        <View style={alignment.Plarge}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(NAVIGATION_SCREEN.Addresses)}
            style={[styles.addressContainer, styles.shadow]}>
            <View style={styles.changeLanguage}>
              <TextDefault
                numberOfLines={1}
                textColor={colors.statusSecondColor}
                medium>
                {i18n.t('myAddress')}
              </TextDefault>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate(NAVIGATION_SCREEN.Addresses)}
                style={styles.button}>
                <MaterialCommunityIcons
                  name={ICONS_NAME.Pencil}
                  size={scale(16)}
                  color={colors.fontMainColor}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={[styles.languageContainer, styles.shadow]}>
            <View style={styles.changeLanguage}>
              <View style={styles.headingLanguage}>
                <TextDefault
                  numberOfLines={1}
                  textColor={colors.statusSecondColor}
                  medium>
                  {i18n.t('language')}
                </TextDefault>
                <TextDefault textColor={colors.statusSecondColor} medium>
                  ({languageName})
                </TextDefault>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => modalizeRef.current.open('top')}
                style={styles.button}>
                <MaterialCommunityIcons
                  name={ICONS_NAME.Pencil}
                  size={scale(16)}
                  color={colors.fontMainColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateNotificationStatus('order');
            }}
            style={[styles.notificationContainer, styles.shadow]}>
            <View style={styles.notificationChekboxContainer}>
              <TextDefault
                numberOfLines={1}
                textColor={colors.statusSecondColor}
                medium>
                Nhận thông báo về đơn hàng!
              </TextDefault>
              <SwitchBtn
                isEnabled={orderNotification}
                onPress={() => {
                  updateNotificationStatus('order');
                }}
              />
            </View>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => modalizeRef1.current.open('top')}
            style={[styles.notificationContainer, styles.shadow]}>
            <View style={styles.notificationChekboxContainer}>
              <TextDefault numberOfLines={1} textColor={'red'} medium>
                Xóa tài khoản
              </TextDefault>
              <Ionicons
                name={ICONS_NAME.Trash}
                size={scale(20)}
                color={'red'}
              />
            </View>
          </TouchableOpacity> */}

          <View style={styles.versionContainer}>
            <TextDefault textColor={colors.fontSecondColor}>
              {i18n.t('version')}: 1.0.0
            </TextDefault>
          </View>
        </View>
      </View>

      {/* Modal for language Changes */}
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        avoidKeyboardLikeIOS={Platform.select({
          ios: true,
          android: false,
        })}
        keyboardAvoidingOffset={2}
        keyboardAvoidingBehavior="height">
        <SettingModal
          onClose={onClose}
          onSelectedLanguage={onSelectedLanguage}
          activeRadio={activeRadio}
        />
      </Modalize>

      {/* Modal for Delete Account */}
      <Modalize
        ref={modalizeRef1}
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
            Bạn có chắc chắn muốn xóa tài khoản?
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
              await updateUserInformation();
              logout();
              navigation.reset({
                routes: [{ name: 'Home' }],
              });
            }}>
            <TextDefault center bolder>
              Xóa Tài Khoản
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
export default Settings;
