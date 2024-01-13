import { SET_USER_LOGIN, SET_USER_LOGOUT, REVOKE } from '../actions/typeAction';

const initialState = {
  user: {},
  accessToken: '',
  isLoading: true,
  isLogin: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REVOKE:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isLogin: true,
        accessToken: action.accessToken,
      };
    case SET_USER_LOGIN:
      return {
        ...state,
        isLogin: true,
        user: action.payload,
        accessToken: action.accessToken,
      };
    case SET_USER_LOGOUT:
      return {
        ...state,
        isLogin: false,
        user: {},
        accessToken: null,
      };
    default:
      return state;
  }
}
