import { SET_CART } from './typeAction';

export const onSetCart = (data) => (dispatch) => {
  dispatch({
    type: SET_CART,
    payload: data,
  });
};
