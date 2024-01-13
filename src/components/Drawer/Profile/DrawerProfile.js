import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { alignment } from '../../../utils/alignment';
import { NAVIGATION_SCREEN } from '../../../utils/constant';
import { TextDefault } from '../../Text';
import useStyle from './styles';
import i18n from '../../../configs/i18n';
import { useSelector } from 'react-redux';

function DrawerProfile() {
  const styles = useStyle();
  const navigation = useNavigation();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const user = useSelector((state) => state.auth.user);

  return (
    <View style={styles.mainContainer}>
      {!isLogin && (
        <View style={styles.logInContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(NAVIGATION_SCREEN.CreateAccount);
            }}>
            <TextDefault textColor={styles.whiteFont.color} bold H4>
              {i18n.t('loginOrCreateAccount')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.loggedInContainer}>
        {isLogin && user && (
          <>
            <View style={styles.imgContainer}>
              <TextDefault bolder H1>
                {user.user_id.name.substr(0, 1).toUpperCase()}
              </TextDefault>
            </View>
            <TextDefault
              textColor={styles.whiteFont.color}
              medium
              H5
              style={alignment.PLxSmall}>
              {i18n.t('welcome')}
            </TextDefault>
            <TextDefault
              textColor={styles.whiteFont.color}
              bold
              H4
              style={alignment.PLxSmall}>
              {user.user_id.name}
            </TextDefault>
          </>
        )}
      </View>
    </View>
  );
}
export default DrawerProfile;
