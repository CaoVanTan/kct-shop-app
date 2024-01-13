import { scale } from './scaling';
import { fontStyles } from './fontStyles';

export const textStyles = {
  H1: {
    fontSize: scale(32),
  },
  H2: {
    fontSize: scale(22),
  },
  H3: {
    fontSize: scale(18),
  },
  H4: {
    fontSize: scale(15),
  },
  H5: {
    fontSize: scale(13),
  },
  Normal: {
    fontSize: scale(11),
  },
  Small: {
    fontSize: scale(9),
  },
  Light: {
    fontFamily: fontStyles.NunitoSanLight,
  },
  Regular: {
    fontFamily: fontStyles.NunitoSanRegular,
  },
  Medium: {
    fontFamily: fontStyles.NunitoSanMedium,
  },
  Bold: {
    fontFamily: fontStyles.NunitoSanSemiBold,
  },
  Bolder: {
    fontFamily: fontStyles.NunitoSanBold,
  },
  Center: {
    textAlign: 'center',
  },
  Right: {
    textAlign: 'right',
  },
  UpperCase: {
    textTransform: 'uppercase',
  },
  LineOver: {
    textDecorationLine: 'line-through',
  },
};
