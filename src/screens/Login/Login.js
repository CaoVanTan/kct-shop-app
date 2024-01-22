import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FilledTextField } from 'react-native-material-textfield';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../../configs/i18n';
import { AppImage, TextDefault, WrapperView } from '../../components';
import AuthenticationContext from '../../context/Authentication';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale, verticalScale } from '../../utils/scaling';
import useStyle from './styles';
import { useSelector } from 'react-redux';

const Logo = require('../../../assets/logo.png');

function Login() {
  let _didFocusSubscription = null;
  let _willBlurSubscription = null;
  const styles = useStyle();
  const inset = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { signIn } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const deviceId = useSelector((state) => state.conf.deviceId);
  const deviceInfo = useSelector((state) => state.conf.deviceInfo);
  const firebaseToken = useSelector((state) => state.conf.firebaseToken);

  useEffect(() => {
    _didFocusSubscription = navigation.addListener('didFocus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      );
    });
    _willBlurSubscription = navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      );
    });
    return () => {
      _didFocusSubscription && _didFocusSubscription();
      _willBlurSubscription && _willBlurSubscription();
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      );
    };
  }, []);

  function validateCredentials() {
    let result = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError('Email không dược để trống');
      result = false;
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailRegex.test(email) !== true) {
        setEmailError('Email không hợp lệ');
        result = false;
      }
    }
    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      result = false;
    }
    return result;
  }

  function onBackButtonPressAndroid() {
    navigation.navigate(NAVIGATION_SCREEN.Home);
    return true;
  }

  function renderLoginAction() {
    return (
      <TouchableOpacity
        style={styles.loginBtn}
        activeOpacity={0.7}
        onPress={async () => {
          setLoading(true);
          const user = {
            login: email,
            password: password,
            deviceId: deviceId,
            deviceInfo: deviceInfo,
            firebaseToken: firebaseToken,
            role: 'group_portal',
          };
          if (validateCredentials()) {
            await signIn(user);
            navigation.navigate(NAVIGATION_SCREEN.Home);
            setLoading(false);
          }
          setLoading(false);
        }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: 'center' }}
            color={colors.buttonText}
          />
        ) : (
          <TextDefault bold>{i18n.t('loginBtn')}</TextDefault>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <WrapperView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
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
                {i18n.t('loginBtn')}
              </TextDefault>
              <View style={styles.backBtnWidth} />
            </View>
            <View style={styles.subContainer}>
              <View style={[styles.flex, styles.upperContainer]}>
                {/* <AppImage
                  imgStyle={styles.imgResponsive}
                  imgSource={Logo}
                  spinnerProps={{ style: styles.loadingView }}
                /> */}
              </View>
              <View style={styles.width100}>
                <TextDefault medium textColor={colors.fontSecondColor}>
                  {i18n.t('enterEmailPassword')}
                </TextDefault>
                <View style={styles.marginTop3} />
                {/* <FilledTextField
                  error={emailError}
                  keyboardType={'email-address'}
                  label={i18n.t('email')}
                  labelFontSize={scale(12)}
                  fontSize={scale(12)}
                  activeLineWidth={0}
                  lineWidth={0}
                  labelHeight={20}
                  textColor={colors.fontMainColor}
                  baseColor={colors.fontMainColor}
                  errorColor={colors.errorColor}
                  tintColor={colors.selected}
                  labelTextStyle={styles.labelStyle}
                  inputContainerStyle={styles.textContainer}
                  onChangeText={(text) => {
                    setEmail(text.toLowerCase().trim());
                  }}
                />
                <FilledTextField
                  error={passwordError}
                  label={i18n.t('password')}
                  secureTextEntry
                  labelFontSize={scale(12)}
                  fontSize={scale(12)}
                  activeLineWidth={0}
                  labelHeight={10}
                  lineWidth={0}
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
                  placeholder="Email"
                  keyboardType="email-address"
                  cursorColor={colors.fontMainColor}
                  selectionColor={colors.fontMainColor}
                  style={styles.textContainer}
                  onChangeText={(text) => {
                    setEmail(text.trim());
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ alignSelf: 'flex-end' }}
                  onPress={() =>
                    navigation.navigate(NAVIGATION_SCREEN.ForgotPassword)
                  }>
                  <TextDefault
                    style={[alignment.PTmedium, alignment.PBxSmall]}
                    medium
                    center>
                    {i18n.t('forgotPassword')}?
                  </TextDefault>
                </TouchableOpacity>
                <View style={[styles.marginTop3]}>{renderLoginAction()}</View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[alignment.MTlarge, styles.loginBtn, styles.whiteBtn]}
                  onPress={() =>
                    navigation.navigate(NAVIGATION_SCREEN.Register)
                  }>
                  <TextDefault bold center>
                    {i18n.t('notHaveAccount')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperView>
  );
}

export default Login;
