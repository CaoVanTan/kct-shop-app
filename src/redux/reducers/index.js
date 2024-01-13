import { combineReducers } from 'redux';
import authReducer from './authReducer';
import configReducer from './configReducer';
import cartReducer from './cartReducer';
import addressReducer from './addressReducer';

export default combineReducers({
  auth: authReducer,
  conf: configReducer,
  cart: cartReducer,
  address: addressReducer,
});
