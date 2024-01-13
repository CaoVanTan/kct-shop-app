import { useTheme } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import { alignment } from '../../utils/alignment';
import { textStyles } from '../../utils/textStyles';
const { height } = Dimensions.get('window');

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    reviewTextContainer: {
      marginHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.MBsmall,
      ...alignment.MTmedium,
    },
    ratingContainer: {
      alignItems: 'center',
    },
    inputContainer: {
      marginHorizontal: 24,
      justifyContent: 'center',
    },
    textinput: {
      height: '100%',
      ...textStyles.Bold,
      ...textStyles.Normal,
    },
    btnContainer: {
      marginTop: 16,
      alignItems: 'center',
    },
    btnTouch: {
      flex: 1,
      backgroundColor: colors.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
export default useStyle;
