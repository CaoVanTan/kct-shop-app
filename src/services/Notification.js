import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

export const onNotification = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage) {
      console.log(
        'Notification from background state',
        remoteMessage.notification,
      );
    }
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification from quit state', remoteMessage.notification);
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    console.log(
      'Notification from foreground state',
      remoteMessage.notification,
    );
  });
};

export async function getFirebaseToken() {
  return new Promise((handleSuccess, handleError) => {
    messaging()
      .getToken()
      .then(
        (res) => {
          handleSuccess(res);
        },
        (err) => {
          handleError(err);
        },
      );
  });
}

export async function backgroundListenMessage() {
  await messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //chạy mở app khi kill app
    if (remoteMessage) {
      console.log('Notification from background state', remoteMessage);
    } else {
      console.log('no version key');
    }
  });
}

export async function onInitialMessage() {
  //chạy mở app khi kill app
  await messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification from quit state', remoteMessage.notification);
      } else {
        console.log('No data notification');
      }
    });
}

export async function openMessage() {
  /**
   * Mở thông báo từ background
   */
  await messaging().onNotificationOpenedApp(async (remoteMessage) => {
    if (remoteMessage) {
      console.log('Notification from background state', remoteMessage);
    } else {
      console.log('No data notification');
    }
  });
}

export async function subscribes() {
  /**
   * Xử lý thông báo nền
   */
  await messaging().onMessage((remoteMessage) => {
    if (remoteMessage) {
      console.log(
        'Notification from foreground state',
        remoteMessage.notification,
      );
    } else {
      console.log('no version key');
    }
  });
}

export async function createChannel() {
  const channel_id = 'channel_push_notification';

  PushNotification.getChannels(function (channel_ids) {
    if (!channel_ids.includes(channel_id)) {
      PushNotification.createChannel(
        {
          channelId: 'channel_push_notification',
          channelName: 'Channel push notifition',
          importance: 4,
        },
        async (created) =>
          created &&
          (await AsyncStorage.setItem('channel_notification', channel_id)),
      );
    }
  });
}
