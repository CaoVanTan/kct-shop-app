import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const getOrders = async ({ access_token }) =>
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
      '/get_orders',
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

export const getOrderDetail = async ({ access_token, id }) =>
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
      '/get_order_detail',
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

export const createOrder = ({
  access_token,
  product_ids,
  address_id,
  payment_method,
  note,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      product_ids: product_ids,
      address_id: address_id,
      payment_method: payment_method,
      note: note,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/sale_order/create',
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

export const cancelOrder = async ({ access_token, id }) =>
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
      '/sale_order/cancel',
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

export const ratingOrder = ({
  access_token,
  id,
  rating_emp,
  rating_product,
  rating_detail,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      access_token: access_token,
      id: id,
      rating_emp: rating_emp,
      rating_product: rating_product,
      rating_detail: rating_detail,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/rating_sale_order',
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

getOrders.propTypes = {
  access_token: PropTypes.string.isRequired,
};

getOrderDetail.propTypes = {
  access_token: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

createOrder.propTypes = {
  access_token: PropTypes.string.isRequired,
  product_ids: PropTypes.array.isRequired,
  address_id: PropTypes.number.isRequired,
  payment_method: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
};

cancelOrder.propTypes = {
  access_token: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

ratingOrder.propTypes = {
  access_token: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  rating_emp: PropTypes.string.isRequired,
  rating_product: PropTypes.string.isRequired,
  rating_detail: PropTypes.string.isRequired,
};
