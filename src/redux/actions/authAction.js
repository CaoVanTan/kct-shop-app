import { SET_USER_LOGIN, SET_USER_LOGOUT, REVOKE } from './typeAction';

export const onRevoke = (data, accessToken) => (dispatch) => {
  dispatch({
    type: REVOKE,
    payload: data,
    accessToken: accessToken,
  });
};

export const onUserLogin = (data, accessToken) => (dispatch) => {
  dispatch({
    type: SET_USER_LOGIN,
    payload: data,
    accessToken: accessToken,
  });
  return Promise.resolve();
};

export const onUserLogout = () => (dispatch) => {
  dispatch({
    type: SET_USER_LOGOUT,
  });
};
