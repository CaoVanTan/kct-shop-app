import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { alignment } from '../../../utils/alignment';
import CheckboxBtn from '../../FdCheckbox/CheckboxBtn';
import TextDefault from '../../Text/TextDefault/TextDefault';
import useStyle from './styles';

function CheckComponent(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  const [options, setOptions] = useState(
    props.options.map((option) => ({ ...option, checked: false })),
  );

  function onPress(option) {
    const tempOptions = options;
    const index = tempOptions.findIndex((opt) => opt.id === option.id);
    tempOptions[index].checked = !tempOptions[index].checked;
    setOptions(tempOptions);
    props.onPress(option);
  }

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPress(option)}
          key={option.id}
          style={styles.mainContainer}>
          <View style={styles.leftContainer}>
            <CheckboxBtn
              onPress={() => onPress(option)}
              checked={option.checked}
            />
            <TextDefault
              numberOfLines={1}
              textColor={
                option.checked ? colors.fontMainColor : colors.fontSecondColor
              }
              style={[alignment.MLsmall, alignment.PRsmall, alignment.MRlarge]}
              H5>
              {option.title}
            </TextDefault>
          </View>
          <View style={styles.rightContainer}>
            <TextDefault
              textColor={
                option.checked ? colors.fontMainColor : colors.fontSecondColor
              }
              H5
              medium>{` ${option.price} đ`}</TextDefault>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
CheckComponent.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  onPress: PropTypes.func,
};

export default CheckComponent;
