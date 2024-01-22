import { useNavigation, useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FilledTextField } from 'react-native-material-textfield';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppImage,
  FlashMessage,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale, verticalScale } from '../../utils/scaling';
import useStyle from './styles';
import { signUp } from '../../api/Auth/Auth';
import { useSelector } from 'react-redux';
import i18n from '../../configs/i18n';

const Logo = require('../../../assets/logo.png');

function Register() {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [fullnameError, setFullnameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const deviceId = useSelector((state) => state.conf.deviceId);
  const deviceInfo = useSelector((state) => state.conf.deviceInfo);
  const firebaseToken = useSelector((state) => state.conf.firebaseToken);

  function validateCredentials() {
    let result = true;
    setEmailError(null);
    setPasswordError(null);
    setPhoneError(null);
    setFullnameError(null);

    if (fullname.trim() === '') {
      setFullnameError('Họ và tên không được để trống');
      result = false;
    }
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{1,50}$/;
    if (!nameRegex.test(fullname)) {
      setFullnameError('Họ và tên không hợp lệ');
      result = false;
    }

    if (email.trim() === '') {
      setEmailError('Email không được để trống');
      result = false;
    }
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Email không hợp lệ');
      result = false;
    }

    if (phone.trim() === '') {
      setPhoneError('Số điện thoại không được để trống');
      result = false;
    }
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      result = false;
    }

    if (password.trim() === '') {
      setPasswordError('Mật khẩu không được để trống');
      result = false;
    }
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      result = false;
    }

    return result;
  }

  async function handleSignUp() {
    setLoading(true);
    console.log({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: password,
      name: fullname.trim(),
      deviceId: deviceId,
      deviceInfo: deviceInfo,
      firebaseToken: firebaseToken,
    });
    // let notificationToken = null;
    // const { status: existingStatus } =
    //   await Notifications.getPermissionsAsync();
    // if (existingStatus === 'granted' && Device.isDevice) {
    //   notificationToken = (await Notifications.getExpoPushTokenAsync()).data;
    // }
    await signUp({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: password,
      name: fullname.trim(),
      deviceId: deviceId,
      deviceInfo: deviceInfo,
      firebaseToken: firebaseToken,
    })
      .then(() => {
        setLoading(false);
        FlashMessage({
          message: 'Bạn đã đăng ký tài khoản thành công',
        });
        navigation.navigate(NAVIGATION_SCREEN.Login);
      })
      .catch((err) => {
        setLoading(false);
        FlashMessage({
          message: err,
        });
      });
  }

  function renderJoinAction() {
    if (loading) {
      return <Spinner />;
    }
    return (
      <TouchableOpacity
        style={styles.joinBtn}
        activeOpacity={0.7}
        onPress={async () => {
          // if (validateCredentials()) {
          handleSignUp();
          // }
        }}>
        <TextDefault bold>{i18n.t('register')}</TextDefault>
      </TouchableOpacity>
    );
  }

  return (
    <WrapperView>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}> */}
      <ScrollView
        style={[styles.flex, { paddingTop: inset.top }]}
        contentContainerStyle={{ flexGrow: 1, paddingTop: verticalScale(20) }}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backBtnWidth, styles.backBtn]}>
              <Ionicons
                name={ICONS_NAME.Back}
                size={scale(20)}
                color={colors.iconColor}
              />
            </TouchableOpacity>
            <TextDefault center H4 bold>
              {i18n.t('register')}
            </TextDefault>
            <View style={styles.backBtnWidth} />
          </View>
          <View style={styles.subContainer}>
            <View style={[styles.flex, styles.upperContainer]}>
              {/* <AppImage
                  imgStyle={[
                    styles.imgResponsive,
                    { backgroundColor: 'transparent' },
                  ]}
                  imgSource={Logo}
                  spinnerProps={{ style: styles.loadingView }}
                /> */}
            </View>
            <View style={styles.width100}>
              {/* <FilledTextField
                error={fullnameError}
                label="Họ và tên"
                labelFontSize={scale(12)}
                fontSize={scale(12)}
                labelHeight={10}
                activeLineWidth={0}
                lineWidth={0}
                textColor={colors.fontMainColor}
                baseColor={colors.fontMainColor}
                errorColor={colors.errorColor}
                tintColor={colors.selected}
                labelTextStyle={styles.labelStyle}
                inputContainerStyle={styles.textContainer}
                onChangeText={(text) => {
                  setFullname(text.trim());
                }}
                maxLength={50}
              /> */}
              {/* <FilledTextField
                error={emailError}
                keyboardType={'email-address'}
                label="Email"
                labelFontSize={scale(12)}
                fontSize={scale(12)}
                labelHeight={10}
                activeLineWidth={0}
                lineWidth={0}
                textColor={colors.fontMainColor}
                baseColor={colors.fontMainColor}
                errorColor={colors.errorColor}
                tintColor={colors.selected}
                labelTextStyle={styles.labelStyle}
                inputContainerStyle={styles.textContainer}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase().trim());
                }}
              /> */}
              <TextInput
                placeholder={i18n.t('name')}
                keyboardType="default"
                cursorColor={colors.fontMainColor}
                selectionColor={colors.fontMainColor}
                style={styles.textContainer}
                onChangeText={(text) => {
                  setFullname(text.trim());
                }}
              />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                cursorColor={colors.fontMainColor}
                selectionColor={colors.fontMainColor}
                style={styles.textContainer}
                onChangeText={(text) => {
                  setEmail(text.trim());
                }}
              />
              {/* <FilledTextField
                error={phoneError}
                keyboardType={'phone-pad'}
                label="Số điện thoại"
                labelFontSize={scale(12)}
                activeLineWidth={0}
                lineWidth={0}
                fontSize={scale(12)}
                labelHeight={10}
                textColor={colors.fontMainColor}
                baseColor={colors.fontMainColor}
                errorColor={colors.errorColor}
                tintColor={colors.selected}
                labelTextStyle={styles.labelStyle}
                inputContainerStyle={styles.textContainer}
                onChangeText={(text) => {
                  setPhone(text.trim());
                }}
              />
              <FilledTextField
                error={passwordError}
                label="Mật khẩu"
                multiline={false}
                secureTextEntry={true}
                labelFontSize={scale(12)}
                fontSize={scale(12)}
                labelHeight={10}
                activeLineWidth={0}
                lineWidth={0}
                keyboardType="default"
                autoCapitalize="none"
                textColor={colors.fontMainColor}
                baseColor={colors.fontMainColor}
                errorColor={colors.errorColor}
                tintColor={colors.selected}
                labelTextStyle={styles.labelStyle}
                inputContainerStyle={styles.textContainer}
                onChangeText={(text) => {
                  setPassword(text.trim());
                }}
              /> */}
              <TextInput
                placeholder={i18n.t('phone')}
                keyboardType="phone-pad"
                cursorColor={colors.fontMainColor}
                selectionColor={colors.fontMainColor}
                style={styles.textContainer}
                onChangeText={(text) => {
                  setPhone(text.trim());
                }}
              />
              <TextInput
                placeholder={i18n.t('password')}
                secureTextEntry
                multiline={false}
                cursorColor={colors.fontMainColor}
                selectionColor={colors.fontMainColor}
                style={styles.textContainer}
                onChangeText={(text) => {
                  setPassword(text.trim());
                }}
              />
              <View style={[styles.marginTop5]}>{renderJoinAction()}</View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate(NAVIGATION_SCREEN.ForgotPassword)
                }>
                <TextDefault style={alignment.MTsmall} bold center>
                  {i18n.t('forgotPassword')}?
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </WrapperView>
  );
}

export default Register;
