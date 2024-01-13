import {
  ADD_DEVICE_ID,
  ADD_FIREBASE_TOKEN,
  SET_NUM_NOTIFY,
} from './typeAction';

export const onAddDeviceId = (deviceId, deviceInfo) => (dispatch) => {
  dispatch({
    type: ADD_DEVICE_ID,
    deviceId: deviceId,
    deviceInfo: deviceInfo,
  });
  return Promise.resolve();
};

export const onAddFirebaseToken = (firebaseToken) => (dispatch) => {
  dispatch({
    type: ADD_FIREBASE_TOKEN,
    firebaseToken: firebaseToken,
  });
};

export const setNumNotify = (num) => (dispatch) => {
  dispatch({
    type: SET_NUM_NOTIFY,
    numNotify: num,
  });
};
