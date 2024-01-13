import {
  ADD_DEVICE_ID,
  ADD_FIREBASE_TOKEN,
  SET_NUM_NOTIFY,
} from '../actions/typeAction';

const initialState = {
  deviceId: '',
  deviceInfo: '',
  firebaseToken: '',
  numNotify: 0,
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_DEVICE_ID:
      return {
        ...state,
        deviceId: action.deviceId,
        deviceInfo: action.deviceInfo,
      };
    case ADD_FIREBASE_TOKEN:
      return {
        ...state,
        firebaseToken: action.firebaseToken,
      };
    case SET_NUM_NOTIFY:
      return {
        ...state,
        numNotify: action.numNotify,
      };
    default:
      return state;
  }
}
