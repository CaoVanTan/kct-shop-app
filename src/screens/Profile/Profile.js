import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../../configs/i18n';
import {
  FlashMessage,
  RightButton,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME } from '../../utils/constant';
import { moderateScale, scale } from '../../utils/scaling';
import { textStyles } from '../../utils/textStyles';
import ChangePassword from './ChangePassword';
import useStyle from './styles';
import { editProfile } from '../../api/Profile/Profile';
import { onUserLogin } from '../../redux/actions/authAction';
import Database from '../../configs/Database';

function Profile() {
  const route = useRoute();
  const styles = useStyle();
  const refName = useRef();
  const refPhone = useRef(null);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [toggleView, setToggleView] = useState(true);
  const [modelVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const backScreen = route.params ? route.params.backScreen : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t('titleProfile'),
      headerRight: () => (
        <RightButton
          icon={toggleView ? ICONS_NAME.Pencil : ICONS_NAME.Cross}
          onPress={viewHideAndShow}
          iconSize={scale(18)}
        />
      ),
    });
  }, [navigation, toggleView]);

  useEffect(() => {
    if (backScreen) {
      viewHideAndShow();
      setPhoneError('Số điện thoại không được để trống');
      FlashMessage({
        message: 'Số điện thoại bị thiếu',
      });
    }
  }, [backScreen]);

  function viewHideAndShow() {
    setNameError('');
    setPhoneError('');
    setToggleView((prev) => !prev);
  }

  function validateInfo() {
    setNameError('');
    setPhoneError('');

    const name = refName.current.value();
    const phone = refPhone.current.value();
    let res = true;

    if (name.trim() === '') {
      refName.current.focus();
      setNameError('Họ và tên không được để trống');
      res = false;
    }
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{1,50}$/;
    if (!nameRegex.test(name)) {
      setNameError('Họ và tên không hợp lệ');
      res = false;
    }
    if (phone.trim() === '') {
      setPhoneError('Số điện thoại không được để trống');
      res = false;
    }
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      if (res) {
        refPhone.current.focus();
      }
      setPhoneError('Số điện thoại không hợp lệ');
      res = false;
    }

    return res;
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    if (validateInfo()) {
      await editProfile({
        access_token: accessToken,
        name: refName.current.value().trim(),
        phone: refPhone.current.value(),
      })
        .then((res) => {
          const result = {
            ...user,
            user_id: {
              ...user.user_id,
              name: refName.current.value().trim(),
              phone: refPhone.current.value(),
            },
          };
          Database.setUserLogin({ value: result });
          dispatch(onUserLogin(result, accessToken));
          viewHideAndShow();
          FlashMessage({
            message: 'Cập nhật hồ sơ thành công',
          });
          setIsLoading(false);
        })
        .catch((err) => {
          FlashMessage({ message: err });
          setIsLoading(false);
        });
    }
  };

  function changePasswordTab() {
    return (
      <View style={styles.containerInfo}>
        <TextField
          label={i18n.t('name')}
          ref={refName}
          editable={false}
          defaultValue={user.user_id.name}
          labelFontSize={scale(12)}
          fontSize={scale(12)}
          style={{
            ...textStyles.Medium,
            ...textStyles.H5,
            color: colors.fontMainColor,
          }}
          maxLength={20}
          textColor={colors.fontMainColor}
          baseColor={colors.fontSecondColor}
          errorColor={colors.errorColor}
          tintColor={!nameError ? colors.tagColor : 'red'}
          labelTextStyle={{
            ...textStyles.Normal,
            paddingTop: scale(1),
          }}
          error={nameError}
        />
        <View style={{ ...alignment.MTxSmall }} />
        <TextField
          keyboardType={'email-address'}
          label={i18n.t('email')}
          style={{
            ...textStyles.Medium,
            ...textStyles.H5,
            color: colors.fontMainColor,
          }}
          editable={false}
          defaultValue={user.user_id.email}
          labelFontSize={scale(12)}
          fontSize={scale(12)}
          textColor={colors.fontMainColor}
          baseColor={colors.fontSecondColor}
          errorColor={colors.errorColor}
          tintColor={colors.tagColor}
          labelTextStyle={{
            ...textStyles.Normal,
            paddingTop: scale(1),
          }}
        />
        <View style={{ ...alignment.MTxSmall }} />
        <TextField
          keyboardType={'phone-pad'}
          label={i18n.t('phone')}
          ref={refPhone}
          editable={false}
          defaultValue={user.user_id.phone}
          style={{
            ...textStyles.Medium,
            ...textStyles.H5,
            color: colors.fontMainColor,
          }}
          labelFontSize={scale(12)}
          fontSize={scale(12)}
          maxLength={15}
          textColor={colors.fontMainColor}
          baseColor={colors.fontSecondColor}
          errorColor={colors.errorColor}
          tintColor={!phoneError ? colors.tagColor : 'red'}
          labelTextStyle={{
            ...textStyles.Normal,
            paddingTop: scale(1),
          }}
          error={phoneError}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.changePassword}>
          <TextDefault>{i18n.t('changePassword')}</TextDefault>
          <Icon name={ICONS_NAME.Pencil} size={20} color={colors.tagColor} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <WrapperView>
      <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false);
        }}
      />
      <View style={styles.formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.flex}>
          <ScrollView style={styles.flex}>
            <View style={[styles.formSubContainer]}>
              <View
                style={{
                  width: scale(100),
                  paddingTop: scale(10),
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: scale(100),
                  top: moderateScale(-50),
                  borderColor: colors.buttonBackground,
                  borderWidth: 2,
                  borderRadius: scale(10),
                  borderStyle: 'dashed',
                }}>
                <View style={styles.imgContainer}>
                  {user.user_id.name && (
                    <TextDefault textColor={colors.tagColor} bold H1>
                      {user.user_id.name.substr(0, 1).toUpperCase()}
                    </TextDefault>
                  )}
                </View>
              </View>
              {toggleView ? (
                changePasswordTab()
              ) : (
                <View style={styles.containerInfo}>
                  <View>
                    <TextField
                      label={i18n.t('name')}
                      ref={refName}
                      defaultValue={user.user_id.name}
                      style={{
                        ...textStyles.Bold,
                        ...textStyles.H5,
                        color: colors.fontMainColor,
                      }}
                      labelFontSize={scale(12)}
                      fontSize={scale(12)}
                      maxLength={20}
                      textColor={colors.fontMainColor}
                      baseColor={colors.fontSecondColor}
                      errorColor={colors.errorColor}
                      tintColor={!nameError ? colors.buttonBackground : 'red'}
                      labelTextStyle={{
                        ...textStyles.Normal,
                        paddingTop: scale(1),
                      }}
                      error={nameError}
                    />
                    <View style={{ ...alignment.MTxSmall }} />
                    <TextField
                      keyboardType={'email-address'}
                      label={i18n.t('email')}
                      style={{
                        ...textStyles.Bold,
                        ...textStyles.H5,
                        color: colors.fontMainColor,
                      }}
                      editable={false}
                      defaultValue={user.user_id.email}
                      labelFontSize={scale(12)}
                      fontSize={scale(12)}
                      textColor={colors.fontMainColor}
                      baseColor={colors.fontSecondColor}
                      errorColor={colors.errorColor}
                      tintColor={colors.buttonBackground}
                      labelTextStyle={{
                        ...textStyles.Normal,
                        paddingTop: scale(1),
                      }}
                    />
                    <View style={{ ...alignment.MTxSmall }} />
                    <TextField
                      keyboardType={'phone-pad'}
                      label={i18n.t('phone')}
                      style={{
                        ...textStyles.Bold,
                        ...textStyles.H5,
                        color: colors.fontMainColor,
                      }}
                      ref={refPhone}
                      defaultValue={user.user_id.phone}
                      labelFontSize={scale(12)}
                      fontSize={scale(12)}
                      maxLength={15}
                      textColor={colors.fontMainColor}
                      baseColor={colors.fontSecondColor}
                      errorColor={colors.errorColor}
                      tintColor={!phoneError ? colors.buttonBackground : 'red'}
                      labelTextStyle={{
                        ...textStyles.Normal,
                        paddingTop: scale(1),
                      }}
                      error={phoneError}
                    />
                  </View>

                  <TouchableOpacity
                    disabled={isLoading}
                    activeOpacity={0.7}
                    style={styles.saveContainer}
                    onPress={() => handleUpdate()}>
                    <TextDefault
                      textColor={colors.buttonText}
                      H5
                      bold
                      style={[alignment.MTsmall, alignment.MBsmall]}>
                      {i18n.t('saveBtn')}
                    </TextDefault>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignSelf: 'center', ...alignment.MTsmall }}
                    activeOpacity={0.7}
                    onPress={viewHideAndShow}>
                    <TextDefault
                      textColor={colors.fontMainColor}
                      H5
                      bold
                      style={[alignment.MTsmall, alignment.MBsmall]}>
                      {i18n.t('cancelled')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </WrapperView>
  );
}

export default Profile;
