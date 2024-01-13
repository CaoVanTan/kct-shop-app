import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale } from '../../../utils/scaling';
const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    height: height * 0.22,
  },
});
