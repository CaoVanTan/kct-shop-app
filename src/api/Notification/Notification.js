import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const getNotifications = ({ access_token, device_id }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      device_id: device_id,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/get_notifications',
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

getNotifications.propTypes = {
  access_token: PropTypes.string.isRequired,
  device_id: PropTypes.string.isRequired,
};
