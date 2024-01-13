import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { scale } from '../../utils/scaling';
import useStyle from './styles';

function CheckboxBtn(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.mainContainer,
        props.checked
          ? { backgroundColor: colors.selected }
          : { backgroundColor: colors.white },
      ]}>
      {props.checked ? (
        <Icon name="check" size={scale(15)} color={colors.fontWhite} />
      ) : null}
    </TouchableOpacity>
  );
}
CheckboxBtn.propTypes = {
  onPress: PropTypes.func,
  checked: PropTypes.bool,
};
export default CheckboxBtn;
