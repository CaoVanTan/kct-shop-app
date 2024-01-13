import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import SimpleLineIconsIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  DrawerActions,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../../configs/i18n';
import NavigationService from '../../routes/navigationService';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import SideDrawerProfile from '../Drawer/Profile/DrawerProfile';
import { TextDefault } from '../Text';
import useStyle from './styles';
import AuthenticationContext from '../../context/Authentication';

const MENU = [
  {
    title: 'home',
    icon: ICONS_NAME.Home,
    navigateTo: NAVIGATION_SCREEN.Home,
    isAuth: false,
  },
  {
    title: 'titleProfile',
    icon: 'user',
    navigateTo: NAVIGATION_SCREEN.Profile,
    isAuth: true,
  },
  {
    title: 'titleOrders',
    icon: ICONS_NAME.Cart,
    navigateTo: NAVIGATION_SCREEN.Orders,
    isAuth: true,
  },
  {
    title: 'titleNotification',
    icon: ICONS_NAME.Notification,
    navigateTo: NAVIGATION_SCREEN.Notification,
    isAuth: true,
  },
  // {
  //   title: 'titleChat',
  //   icon: 'chat',
  //   navigateTo: NAVIGATION_SCREEN.Chat,
  //   isAuth: true,
  // },
  {
    title: 'titleSettings',
    icon: ICONS_NAME.Setting,
    navigateTo: NAVIGATION_SCREEN.Settings,
    isAuth: true,
  },
];

function SidebBar(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const { signOut } = useContext(AuthenticationContext);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigationName = NavigationService.currentRoute()?.name;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollContent}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          marginBottom: inset.bottom,
        }}>
        <View style={styles.headerContainer}>
          <SideDrawerProfile />
        </View>
        <View style={styles.menuContainer}>
          <View>
            {MENU.map((item, index) => (
              <DrawerItem
                pressColor={'rgba(0,0,0,0.2)'}
                key={`DRAWER_ITEM_LIST_${index}`}
                style={styles.drawerItem}
                activeBackgroundColor={'transparent'}
                activeTintColor={colors.black}
                inactiveTintColor={colors.fontWhite}
                focused={navigationName === item.navigateTo}
                label={(props) => (
                  <TextDefault
                    H5
                    medium
                    textColor={props.color}
                    style={[styles.textView, styles.flex, { paddingTop: 2 }]}>
                    {i18n.t(item.title)}
                  </TextDefault>
                )}
                icon={(props) => {
                  if (item.icon === 'home') {
                    return (
                      <MaterialIcons
                        name={item.icon}
                        size={22}
                        color={props.color}
                      />
                    );
                  } else if (item.icon === 'user') {
                    return (
                      <SimpleLineIconsIcon
                        name={item.icon}
                        color={props.color}
                        size={scale(22)}
                      />
                    );
                  } else if (item.icon === 'chat') {
                    return (
                      <IoniconsIcon
                        name={'chatbubble-outline'}
                        color={props.color}
                        size={scale(22)}
                      />
                    );
                  } else {
                    return (
                      <IoniconsIcon
                        name={item.icon}
                        size={22}
                        color={props.color}
                      />
                    );
                  }
                }}
                onPress={async () => {
                  if (item.isAuth && !isLogin) {
                    navigation.navigate(NAVIGATION_SCREEN.CreateAccount);
                  } else {
                    navigation.navigate(item.navigateTo);
                  }
                }}
              />
            ))}
          </View>
          <View style={alignment.PBmedium}>
            {isLogin && (
              <DrawerItem
                pressColor={'rgba(0,0,0,0.2)'}
                style={styles.drawerItem}
                label={() => (
                  <TextDefault
                    H5
                    medium
                    textColor={styles.whiteFont.color}
                    style={[styles.textView, styles.flex]}>
                    {i18n.t('titleLogout')}
                  </TextDefault>
                )}
                icon={() => (
                  <IoniconsIcon
                    name={ICONS_NAME.Exit}
                    color={styles.whiteFont.color}
                    size={scale(22)}
                  />
                )}
                onPress={async () => {
                  signOut(accessToken);
                  navigation.reset({
                    routes: [{ name: 'Home' }],
                  });
                  navigation.dispatch(DrawerActions.closeDrawer());
                }}
              />
            )}
          </View>
        </View>
      </Animated.View>
    </DrawerContentScrollView>
  );
}
export default SidebBar;
