// packages
import { BackHandler, Alert } from 'react-native';
/**
 * Attaches an event listener that handles the android-only hardware
 * back button
 * @param  {Function} callback The function to call on click
 */
const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.remove('hardwareBackPress');
};
const exitAlert = () => {
  Alert.alert('Xác nhận thoát', 'Bạn có muốn thoát khỏi ứng dụng?', [
    { text: 'Hủy', style: 'cancel' },
    {
      text: 'Đồng ý',
      onPress: () => {
        BackHandler.exitApp();
      },
    },
  ]);
  return true;
};

export { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert };
