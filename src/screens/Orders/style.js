import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyle = () => {
  const inset = useSafeAreaInsets();

  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    bottom: {
      paddingBottom: inset.bottom,
    },
    toggleContainer: {
      width: '90%',
      borderRadius: scale(10),
      justifyContent: 'space-between',
      height: verticalScale(50),
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: scale(10),
      backgroundColor: 'white',
      marginTop: verticalScale(12),
      alignSelf: 'center',
      elevation: 2,
    },
    toggleBtn: {
      justifyContent: 'center',
      height: '70%',
      alignItems: 'center',
      width: '47%',
      borderRadius: scale(10),
    },
  });
};
export default useStyle;
