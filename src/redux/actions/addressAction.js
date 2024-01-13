import { SET_ADDRESS } from './typeAction';

export const onSetAddress = (data) => (dispatch) => {
  dispatch({
    type: SET_ADDRESS,
    payload: data,
  });
};
