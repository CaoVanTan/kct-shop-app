import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationContainer,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { TextDefault, LeftButton, Sidebar } from '../components';
import Home from '../screens/Home/Home';
import CategoryItems from '../screens/CategoryItems/CategoryItems';
import Addresses from '../screens/Addresses/Addresses';
import NewAddress from '../screens/NewAddress/NewAddress';
import EditAddress from '../screens/EditAddress/EditAddress';
import Cart from '../screens/Cart/Cart';
import Profile from '../screens/Profile/Profile';
import FullMap from '../screens/FullMap/FullMap';
import CartAddress from '../screens/CartAddress/CartAddress';
import Settings from '../screens/Settings/Settings';
import ItemDetail from '../screens/ItemDetail/ItemDetail';
import Orders from '../screens/Orders/Orders';
import OrderDetail from '../screens/OrderDetail/OrderDetail';
import Chat from '../screens/Chat/Chat';
import RateAndReview from '../screens/RateAndReview/RateAndReview';
import CreateAccount from '../screens/CreateAccount/CreateAccount';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';

import { THEME } from '../theme';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../utils/constant';
import navigationService from './navigationService';
import screenOptions from './screenOptions';
import styles from './styles';
import Notification from '../screens/Notification/Notification';
import { useEffect } from 'react';

const NavigationStack = createStackNavigator();
const MainStack = createStackNavigator();
const SideDrawer = createDrawerNavigator();

function Drawer() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  let animatedStyle = {};
  let opacity;
  let OuterWindowSlide, InnerWindowSlide;

  const navigate = (data) => {
    console.log('data: ', data);
    navigation.push(NAVIGATION_SCREEN.OrderDetail, {
      id: Number.parseInt(data.res_id, 10),
    });
  };

  const subscribe = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
      if (!remoteMessage.localNotificationDisplayed) {
        remoteMessage.localNotificationDisplayed = true;

        AsyncStorage.getItem('channel_notification').then((res) => {
          PushNotification.localNotification({
            channelId: res,
            message: remoteMessage.notification.body,
            title: remoteMessage.notification.title,
            bigPictureUrl: remoteMessage.notification.android.imageUrl,
            smallIcon: remoteMessage.notification.android.imageUrl,
            data: {
              remoteMessage: remoteMessage.data,
            },
          });
        });
      }
    });
  };

  const setBackgroundMessage = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (remoteMessage && !remoteMessage.localNotificationDisplayed) {
        remoteMessage.localNotificationDisplayed = true;
        navigate(remoteMessage.data);
      }
    });
  };

  const onNotificationOpenedApp = () => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage && !remoteMessage.localNotificationDisplayed) {
          remoteMessage.localNotificationDisplayed = true;
          navigate(remoteMessage.data);
        }
      });
  };

  const configurePushNotification = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.userInteraction && notification.data.remoteMessage) {
          navigate(notification.data.remoteMessage);
        }
      },
    });
  };

  useEffect(() => {
    configurePushNotification();
    setBackgroundMessage();
    onNotificationOpenedApp();
    subscribe();
  }, [setBackgroundMessage, subscribe]);

  return (
    <SideDrawer.Navigator
      drawerType="slide"
      overlayColor="transparent"
      screenOptions={{
        drawerStyle: {
          flex: 1,
          backgroundColor: colors.drawerBackground,
          width: '60%',
          justifyContent: 'space-between',
          borderRightWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        sceneContainerStyle: { backgroundColor: colors.drawerBackground },
      }}
      drawerContent={(props) => {
        const scale = Animated.interpolateNode(props.progress, {
          inputRange: [0, 1],
          outputRange: [1, 0.7],
        });
        const Animatedopacity = Animated.interpolateNode(props.progress, {
          inputRange: [0, 0.6, 1],
          outputRange: [0, 0, 1],
        });
        const AnimatedOuterSlide = Animated.interpolateNode(props.progress, {
          inputRange: [0, 1],
          outputRange: [0, -35],
        });
        const AnimatedInnerSlide = Animated.interpolateNode(props.progress, {
          inputRange: [0, 1],
          outputRange: [0, -15],
        });
        const borderRadius = Animated.interpolateNode(props.progress, {
          inputRange: [0, 1],
          outputRange: [0, 20],
        });
        animatedStyle = { borderRadius, transform: [{ scale }] };
        opacity = Animatedopacity;
        OuterWindowSlide = AnimatedOuterSlide;
        InnerWindowSlide = AnimatedInnerSlide;

        return <Sidebar {...props} />;
      }}>
      <SideDrawer.Screen name="noDrawer" options={{ headerShown: false }}>
        {(props) => (
          <NoDrawer
            {...props}
            style={animatedStyle}
            opacity={opacity}
            OuterWindowSlide={OuterWindowSlide}
            InnerWindowSlide={InnerWindowSlide}
          />
        )}
      </SideDrawer.Screen>
    </SideDrawer.Navigator>
  );
}

function NoDrawer({ style, opacity = 1, OuterWindowSlide, InnerWindowSlide }) {
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <Animated.View
        style={[styles.outerView, style, { marginLeft: OuterWindowSlide }]}
      />
      <Animated.View
        style={[styles.innerView, style, { marginLeft: InnerWindowSlide }]}
      />
      <Animated.View style={[styles.animatedView, style]}>
        <NavigationStack.Navigator
          presentation="modal"
          screenOptions={screenOptions({
            textColor: colors.headerTextColor,
          })}>
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Home}
            component={Home}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.CategoryItems}
            component={CategoryItems}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Cart}
            component={Cart}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Profile}
            component={Profile}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Addresses}
            component={Addresses}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.NewAddress}
            component={NewAddress}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.EditAddress}
            component={EditAddress}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.FullMap}
            component={FullMap}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.CartAddress}
            component={CartAddress}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Chat}
            component={Chat}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Settings}
            component={Settings}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.ItemDetail}
            component={ItemDetail}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Notification}
            component={Notification}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.Orders}
            component={Orders}
            options={{
              headerLeft: () => <LeftButton icon={ICONS_NAME.Menu} />,
            }}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.OrderDetail}
            component={OrderDetail}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.RateAndReview}
            component={RateAndReview}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.CreateAccount}
            options={{ headerShown: false }}
            component={CreateAccount}
          />
          <NavigationStack.Screen
            options={{ headerShown: false }}
            name={NAVIGATION_SCREEN.Login}
            component={Login}
          />
          <NavigationStack.Screen
            options={{ headerShown: false }}
            name={NAVIGATION_SCREEN.Register}
            component={Register}
          />
          <NavigationStack.Screen
            name={NAVIGATION_SCREEN.ForgotPassword}
            options={{ headerShown: false }}
            component={ForgotPassword}
          />
        </NavigationStack.Navigator>
      </Animated.View>
      <Animated.View style={[styles.closeView, { opacity: opacity }]}>
        <TextDefault H4 medium>
          {'Close X'}
        </TextDefault>
      </Animated.View>
    </React.Fragment>
  );
}

function AppContainer() {
  const colorScheme = useColorScheme();
  console.log('AppContainer Working');

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer
        theme={colorScheme === 'dark' ? THEME.Dark : THEME.Light}
        ref={(ref) => {
          navigationService.setGlobalRef(ref);
        }}>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={NAVIGATION_SCREEN.Drawer}>
          <MainStack.Screen
            name={NAVIGATION_SCREEN.Drawer}
            component={Drawer}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppContainer;
