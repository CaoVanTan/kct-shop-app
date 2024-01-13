import { SET_CART } from '../actions/typeAction';

const initialState = {
  cart: [],
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {
        cart: action.payload,
      };
    default:
      return state;
  }
}
