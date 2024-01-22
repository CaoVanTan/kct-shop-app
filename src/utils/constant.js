const FORMAT_TIME = 'HH:mm';
const VN_FORMAT_DATE = 'DD-MM-YYYY';
const VN_FORMAT_DATETIME = 'DD-MM-YYYY HH:mm:ss';
const GL_FORMAT_DATE = 'YYYY-MM-DD';
const GL_FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss';

const LATITUDE = 21.0130203;
const LONGITUDE = 105.7975438;
const LATITUDE_DELTA = 0.0015;
const LONGITUDE_DELTA = 0.0015;

const NAVIGATION_SCREEN = {
  Home: 'Home',
  Cart: 'Cart',
  Chat: 'Chat',
  Login: 'Login',
  Drawer: 'Drawer',
  Coupon: 'Coupon',
  Profile: 'Profile',
  Payment: 'Payment',
  FullMap: 'FullMap',
  Settings: 'Settings',
  Orders: 'Orders',
  Register: 'Register',
  CategoryItems: 'CategoryItems',
  Addresses: 'Addresses',
  NewAddress: 'NewAddress',
  ItemDetail: 'ItemDetail',
  Notification: 'Notification',
  EditAddress: 'EditAddress',
  CartAddress: 'CartAddress',
  OrderDetail: 'OrderDetail',
  RateAndReview: 'RateAndReview',
  ForgotPassword: 'ForgotPassword',
  CreateAccount: 'CreateAccount',
};

const ICONS_NAME = {
  Logo: 'logo',
  Menu: 'menu',
  Back: 'arrow-back-outline',
  Exit: 'exit-outline',
  Cash: 'cash',
  Visa: 'visa',
  Home: 'home',
  Cart: 'bag-outline',
  Info: 'info',
  Add: 'add',
  Radio: 'radio',
  Cross: 'close-outline',
  Subtract: 'remove',
  Trash: 'trash',
  Clock: 'alarm-outline',
  Reload: 'reload',
  Pencil: 'pencil',
  Target: 'target',
  Filter: 'filter',
  Chat: 'chatbubble-outline',
  Setting: 'settings-outline',
  Checked: 'checkmark-circle-outline',
  Refresh: 'refresh',
  Location: 'location',
  RadioSelect: 'radioSelect',
  Notification: 'notifications-outline',
};

const SORT_DATA = {
  default: 'default',
  name_asc: 'name_asc',
  name_desc: 'name_desc',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
};

const OPTION_ORDER = [
  {
    id: 1,
    title: 100,
  },
  {
    id: 2,
    title: 50,
  },
  {
    id: 3,
    title: 0,
  },
];

const LABEL_ADDRESS = [
  {
    title: 'house',
    value: 'home',
  },
  {
    title: 'office',
    value: 'work',
  },
  {
    title: 'other',
    value: 'other',
  },
];

export {
  NAVIGATION_SCREEN,
  ICONS_NAME,
  SORT_DATA,
  FORMAT_TIME,
  GL_FORMAT_DATE,
  GL_FORMAT_DATETIME,
  VN_FORMAT_DATE,
  VN_FORMAT_DATETIME,
  OPTION_ORDER,
  LABEL_ADDRESS,
  LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE,
  LONGITUDE_DELTA,
};
