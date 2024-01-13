import { SET_ADDRESS } from '../actions/typeAction';

const initialState = {
  address: {},
};

export default function addressReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADDRESS:
      return {
        address: action.payload,
      };
    default:
      return state;
  }
}
