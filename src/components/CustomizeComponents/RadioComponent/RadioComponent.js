import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { alignment } from '../../../utils/alignment';
import RadioButton from '../../FdRadioBtn/RadioBtn';
import TextDefault from '../../Text/TextDefault/TextDefault';
import useStyle from './styles';
import { formatCurrency } from '../../../utils/format';
import i18n from '../../../configs/i18n';

function RadioComponent(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  const [options] = useState(props.options);
  const [selected, setSelected] = useState(props.selected || null);

  function onPress(option) {
    setSelected(option);
    props.onPress(option);
  }

  return (
    <>
      {options.map((option) => {
        const isChecked = selected.id === option.id;
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(option)}
            key={option.id}
            style={styles.mainContainer}>
            <View style={styles.leftContainer}>
              <RadioButton
                size={13}
                outerColor={colors.radioOuterColor}
                innerColor={colors.radioColor}
                animation={'bounceIn'}
                isSelected={isChecked}
                onPress={() => onPress(option)}
              />
              <TextDefault
                textColor={
                  isChecked ? colors.fontMainColor : colors.fontSecondColor
                }
                style={alignment.MLsmall}
                H5>
                {props.type === 'sugar'
                  ? option.title === 0
                    ? i18n.t('noSugar')
                    : `${option.title}% ${i18n.t('sugar')}`
                  : props.type === 'ice'
                  ? option.title === 0
                    ? i18n.t('noIce')
                    : `${option.title}% ${i18n.t('ice')}`
                  : option.title}
              </TextDefault>
            </View>
            {props.type !== 'sugar' && props.type !== 'ice' && (
              <View style={styles.rightContainer}>
                <TextDefault
                  textColor={
                    isChecked ? colors.fontMainColor : colors.fontSecondColor
                  }
                  H5
                  medium>{`${formatCurrency(option.price)}`}</TextDefault>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

RadioComponent.propTypes = {
  selected: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.object),
  onPress: PropTypes.func,
};
export default RadioComponent;
