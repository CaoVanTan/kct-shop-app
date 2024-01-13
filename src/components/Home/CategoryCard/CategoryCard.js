import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { alignment } from '../../../utils/alignment';
import AppImage from '../../AppImage/AppImage';
import { TextDefault } from '../../Text';
import useStyle from './styles';

function CategoryCard(props) {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.flex}
      onPress={props.onPress}>
      <View style={styles.container}>
        <AppImage
          imgStyle={styles.imgResponsive}
          imgSource={props.image ? { uri: props.image } : undefined}
          spinnerProps={{ style: styles.loadingView }}
        />
        <View style={styles.textContainer}>
          <TextDefault
            numberOfLines={1}
            textColor={colors.fontWhite}
            H4
            bolder
            style={alignment.MBxSmall}>
            {props.name}
          </TextDefault>
          <TextDefault numberOfLines={1} textColor={colors.fontWhite} medium>
            {props.description ? props.description : ''}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  );
}
CategoryCard.propTypes = {
  onPress: PropTypes.func,
  name: PropTypes.string.isRequired,
};
export default CategoryCard;
