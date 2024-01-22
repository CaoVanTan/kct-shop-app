import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { FilledTextField } from 'react-native-material-textfield';
import i18n from '../../configs/i18n';
import {
  AppImage,
  FlashMessage,
  RegistrationHeader,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';
import useStyle from './styles';

const Logo = require('../../../assets/logo.png');

function ForgotPassword() {
  const styles = useStyle();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

  function validateCredentials() {
    let result = true;
    setEmailError(null);
    if (!email) {
      setEmailError('Email is required');
      result = false;
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailRegex.test(email) !== true) {
        setEmailError('Invalid Email');
        result = false;
      }
    }
    return result;
  }
  function onCompleted(data) {
    FlashMessage({
      message: 'Reset password link sent on your email',
    });
  }
  function onError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message,
      });
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message,
      });
    }
  }

  return (
    <WrapperView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          style={[styles.flex]}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}>
          <View style={styles.mainContainer}>
            <RegistrationHeader title={i18n.t('forgotPassword')} back />
            <View style={styles.subContainer}>
              <View style={[styles.flex, styles.upperContainer]}>
                <AppImage
                  imgStyle={styles.imgResponsive}
                  imgSource={Logo}
                  spinnerProps={{ style: styles.loadingView }}
                />
              </View>
              <View style={styles.width100}>
                <TextDefault
                  textColor={colors.fontSecondColor}
                  style={alignment.MTsmall}
                  numberOfLines={2}
                  medium>
                  Để đặt lại mật khẩu, vui lòng nhập địa chỉ Email của bạn bên
                  dưới.
                </TextDefault>
                <FilledTextField
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
                    setEmail(text.trim());
                  }}
                />
                <TouchableOpacity
                  // disabled={loading}
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                  onPress={(event) => {
                    // if (validateCredentials() && !loading) {
                    //   mutate({
                    //     variables: { email: email.toLowerCase().trim() },
                    //   });
                    // }
                  }}>
                  {/* {loading ? (
                    <Spinner spinnerColor={colors.buttonText} />
                  ) : ( */}
                  <TextDefault bold>Tiếp tục</TextDefault>
                  {/* )} */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperView>
  );
}
export default ForgotPassword;
