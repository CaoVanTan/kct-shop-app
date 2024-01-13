import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const editProfile = ({ access_token, name, phone }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      name: name,
      phone: phone,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/profile/edit',
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

editProfile.propTypes = {
  access_token: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};
