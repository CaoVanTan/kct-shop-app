import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const getAddress = async ({ access_token }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/get_address',
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

getAddress.propTypes = {
  access_token: PropTypes.string.isRequired,
};

export const createAddress = ({
  access_token,
  label,
  address,
  address_detail,
  lat,
  long,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      label: label,
      address: address,
      address_detail: address_detail,
      lat: lat,
      long: long,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/address/create',
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

createAddress.propTypes = {
  access_token: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  address_detail: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};

export const editAddress = ({
  access_token,
  id,
  label,
  address,
  address_detail,
  lat,
  long,
  selected,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      id: id,
      label: label,
      address: address,
      address_detail: address_detail,
      lat: lat,
      long: long,
      selected: selected,
    };
    console.log(body);
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/address/edit',
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

editAddress.propTypes = {
  access_token: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  address_detail: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  selected: PropTypes.bool,
};

export const deleteAddress = ({ access_token, id }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      id: id,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/address/delete',
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

deleteAddress.propTypes = {
  access_token: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};
