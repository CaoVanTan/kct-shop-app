import PropTypes from 'prop-types';
import HTTP from '../../configs/HTTP';

export const getCategories = async () =>
  new Promise((handleSuccess, handleError) => {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };
    HTTP.post(
      '/get_categories',
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

export const getProducts = async ({
  category_id,
  min,
  max,
  order,
  page = 1,
  items_per_page = 50,
}) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      category_id: category_id,
      min: min,
      max: max,
      order: order,
      page: page,
      items_per_page: items_per_page,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/get_products',
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

export const getProductDetail = async ({ product_id }) =>
  new Promise((handleSuccess, handleError) => {
    let body = {
      product_id: product_id,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    HTTP.post(
      '/get_product_detail',
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

getProducts.propTypes = {
  category_id: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  order: PropTypes.string,
};

getProductDetail.propTypes = {
  product_id: PropTypes.number.isRequired,
};
