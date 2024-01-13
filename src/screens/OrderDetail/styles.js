import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PTlarge,
    },
    marginBottom20: {
      ...alignment.MBlarge,
    },
    marginBottom10: {
      ...alignment.MBsmall,
    },
    orderReceipt: {
      ...alignment.PTlarge,
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PBlarge,
    },
    horizontalLine: {
      borderBottomColor: colors.horizontalLine,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    floatView: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    empBtnStyle: {
      backgroundColor: colors.buttonBackgroundBlue,
      height: 44,
      width: '47%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(10),
    },
  });
};
export default useStyle;
