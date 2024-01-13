import { useTheme } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alignment } from '../../utils/alignment';
import { moderateScale, verticalScale } from '../../utils/scaling';
const { width } = Dimensions.get('window');

const useStyle = () => {
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();

  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    bottom: {
      paddingBottom: inset.bottom,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      ...alignment.MBmedium,
      backgroundColor: colors.cardContainer,
      elevation: 5,
      padding: 10,
      shadowColor: colors.placeHolderColor,
      shadowOffset: {
        width: verticalScale(2),
        height: verticalScale(1),
      },
      borderRadius: 16,
      height: width * 0.28,
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(10),
      ...alignment.PLsmall,
      ...alignment.PRsmall,
    },
    imgResponsive: {
      width: moderateScale(75),
      height: moderateScale(75),
      borderRadius: moderateScale(16),
    },
    loadingView: {
      backgroundColor: colors.background,
      width: '100%',
      height: '100%',
    },
    textContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'space-evenly',
      ...alignment.MLsmall,
    },
    lightColor: {
      color: colors.fontSecondColor,
    },
  });
};
export default useStyle;
