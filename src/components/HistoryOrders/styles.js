import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: '20%',
      ...alignment.PBlarge,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBlarge,
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge,
    },
    emptyButton: {
      width: '70%',
      height: scale(50),
      backgroundColor: colors.blueColor,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(15),
      ...alignment.MTlarge,
    },
  });
};

export default useStyle;
