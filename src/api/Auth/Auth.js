import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const signUp = ({
  name,
  email,
  phone,
  password,
  deviceId,
  deviceInfo,
  firebaseToken,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      name,
      email,
      phone,
      password,
      device_id: deviceId,
      device_info: deviceInfo,
      firebase_token: firebaseToken,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    HTTP.post(
      '/sign_up',
      options,
      (res) => {
        if (res.result !== undefined && res.result.code === 200) {
          handleSuccess(res.result.data);
        } else {
          handleError(res.result.message);
        }
      },
      (err) => {
        handleError(err);
      },
    );
  });

export const signIn = async ({
  login,
  password,
  deviceId,
  deviceInfo,
  firebaseToken,
  role,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      login: login,
      password: password,
      device_id: deviceId,
      device_info: deviceInfo,
      firebase_token: firebaseToken,
      role: role,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/sign_in',
      options,
      (res) => {
        if (res.result !== undefined && res.result.code === 200) {
          handleSuccess(res.result.data);
        } else {
          handleError(res.result.message);
        }
      },
      (err) => {
        handleError(err);
      },
    );
  });

export const signOut = async ({ accessToken }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: accessToken,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/sign_out',
      options,
      (res) => {
        if (res.result !== undefined && res.result.code === 200) {
          handleSuccess(res.result.data);
        } else {
          handleError(res.result.message);
        }
      },
      (err) => {
        handleError(err);
      },
    );
  });

export const changePassword = ({ access_token, old_password, new_password }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      old_password: old_password,
      new_password: new_password,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/change_password',
      options,
      (res) => {
        if (res.result !== undefined && res.result.code === 200) {
          handleSuccess(res.result.data);
        } else {
          handleError(res.result.message);
        }
      },
      (err) => {
        handleError(err);
      },
    );
  });

signIn.propTypes = {
  login: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  type: PropTypes.string,
  deviceId: PropTypes.string.isRequired,
  deviceInfo: PropTypes.string,
  firebaseToken: PropTypes.string,
  accessToken: PropTypes.string,
};

signOut.propTypes = {
  accessToken: PropTypes.string.isRequired,
};

signUp.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  deviceId: PropTypes.string.isRequired,
  deviceInfo: PropTypes.string,
  firebaseToken: PropTypes.string,
};

changePassword.propTypes = {
  access_token: PropTypes.string.isRequired,
  old_password: PropTypes.string.isRequired,
  new_password: PropTypes.string.isRequired,
};
