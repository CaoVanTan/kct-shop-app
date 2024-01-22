import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  AppImage,
  FdEmailBtn,
  FlashMessage,
  RegistrationHeader,
  TextDefault,
  WrapperView,
} from '../../components';
import AuthenticationContext from '../../context/Authentication';
import { alignment } from '../../utils/alignment';
import { NAVIGATION_SCREEN } from '../../utils/constant';
import useStyle from './styles';
import i18n from '../../configs/i18n';

// const Logo = require('../../../assets/logo.png');

const CreateAccount = () => {
  const styles = useStyle();
  const navigation = useNavigation();
  const [loginButton, loginButtonSetter] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setTokenAsync } = useContext(AuthenticationContext);

  async function onCompleted(data) {
    if (!data.login.is_active) {
      FlashMessage({
        message: "Can't Login,This Account is Deleted!",
      });
      setLoading(false);
    } else {
      try {
        const trackingOpts = {
          id: data.login.userId,
          usernameOrEmail: data.login.email,
        };
        setTokenAsync(data.login.token);
        navigation.navigate(NAVIGATION_SCREEN.Home);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  }

  // async function mutateLogin(user) {
  //   setLoading(true);
  //   let notificationToken = null;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     if (existingStatus === 'granted') {
  //       notificationToken = (await Notifications.getExpoPushTokenAsync()).data;
  //     }
  //   }
  //   // mutate({ variables: { ...user, notificationToken } });
  // }

  function renderEmailAction() {
    return (
      <FdEmailBtn
        loadingIcon={loading && loginButton === 'Email'}
        onPress={() => {
          loginButtonSetter('Email');
          navigation.navigate(NAVIGATION_SCREEN.Register);
        }}
      />
    );
  }

  return (
    <WrapperView>
      <View style={[styles.mainContainer, styles.flex]}>
        <RegistrationHeader title={i18n.t('start')} />
        <View style={styles.subContainer}>
          <View style={[styles.flex, styles.upperContainer]}>
            {/* <AppImage
              imgStyle={styles.imgResponsive}
              imgSource={Logo}
              spinnerProps={{ style: styles.loadingView }}
            /> */}
          </View>
          <View style={styles.width100}>
            <View style={alignment.MTmedium}>{renderEmailAction()}</View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.alreadyBtn}
              onPress={() => navigation.navigate(NAVIGATION_SCREEN.Login)}>
              <TextDefault style={[alignment.MLsmall]} bold>
                {i18n.t('alreadyHaveAccount')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WrapperView>
  );
};
export default CreateAccount;
