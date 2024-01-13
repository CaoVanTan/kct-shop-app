import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const USER_KEY = '@USER_KEY';
const ACCESS_TOKEN = '@ACCESS_TOKEN';
const FIREBASE_TOKEN = 'FIREBASE_TOKEN';
const CART = '@CART';
const ADDRESS = '@ADDRESS';
var Database = {};

export const getAccessToken = async () => {
  let accessToken = null;
  try {
    accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
  } catch (err) {
    console.log('getAccessToken: ', err);
  }
  return accessToken;
};

export const setAccessToken = async ({ value }) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN, value);
  } catch (error) {
    console.log('setAccessToken: ', error);
  }
};

setAccessToken.propTypes = {
  value: PropTypes.string.isRequired,
};

export const getUserLogin = async () => {
  let user = null;
  try {
    user = await AsyncStorage.getItem(USER_KEY);
  } catch (error) {
    console.log('getUserLogin: ', error);
  }
  return JSON.parse(user);
};

export const setUserLogin = async ({ value }) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (error) {
    console.log('setUserLogin: ', error);
  }
};

setUserLogin.propTypes = {
  value: PropTypes.string.isRequired,
};

export const removeUserLogin = async () => {
  await AsyncStorage.multiRemove([USER_KEY, ACCESS_TOKEN]);
};

export const getFirebaseToken = async () => {
  let token = null;
  try {
    token = await AsyncStorage.getItem(FIREBASE_TOKEN);
  } catch (err) {
    console.log('getFirebaseToken: ', err);
  }
  return token;
};

export const setFirebaseToken = async ({ value }) => {
  try {
    await AsyncStorage.setItem(FIREBASE_TOKEN, value);
  } catch (error) {
    console.log('setFirebaseToken: ', error);
  }
};

setFirebaseToken.propTypes = {
  value: PropTypes.string.isRequired,
};

export const getCart = async () => {
  let cart = null;
  try {
    cart = await AsyncStorage.getItem(CART);
  } catch (err) {
    console.log('getCart: ', err);
  }
  return JSON.parse(cart);
};

export const setCart = async ({ value }) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(CART, jsonValue);
  } catch (error) {
    console.log('setCart: ', error);
  }
};

setCart.propTypes = {
  value: PropTypes.string.isRequired,
};

export const getAddress = async () => {
  let address = null;
  try {
    address = await AsyncStorage.getItem(ADDRESS);
  } catch (err) {
    console.log('getAddress: ', err);
  }
  return JSON.parse(address);
};

export const setAddress = async ({ value }) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(ADDRESS, jsonValue);
  } catch (error) {
    console.log('setAddress: ', error);
  }
};

setAddress.propTypes = {
  value: PropTypes.string.isRequired,
};

Database.getAccessToken = getAccessToken;
Database.setAccessToken = setAccessToken;
Database.getUserLogin = getUserLogin;
Database.setUserLogin = setUserLogin;
Database.removeUserLogin = removeUserLogin;
Database.getFirebaseToken = getFirebaseToken;
Database.setFirebaseToken = setFirebaseToken;
Database.getCart = getCart;
Database.setCart = setCart;
Database.getAddress = getAddress;
Database.setAddress = setAddress;

export default Database;
