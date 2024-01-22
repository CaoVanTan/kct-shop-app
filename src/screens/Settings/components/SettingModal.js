import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import RadioButton from '../../../components/FdRadioBtn/RadioBtn';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { alignment } from '../../../utils/alignment';
import useStyle from './styles';
import i18n from '../../../configs/i18n';

const languageTypes = [
  { value: 'Tiếng Việt', code: 'vn', index: 0 },
  { value: 'English', code: 'en', index: 1 },
];

function SettingModal(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  const [activeRadio, activeRadioSetter] = useState(props.activeRadio);

  return (
    <View style={styles.flex}>
      <TextDefault bolder H5 style={alignment.MTlarge}>
        {i18n.t('selectLanguage')}
      </TextDefault>

      {languageTypes.map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={item.index}
          onPress={() => activeRadioSetter(item.index)}
          style={[styles.radioContainer]}>
          <TextDefault numberOfLines={1} bold style={alignment.MLsmall}>
            {item.value}
          </TextDefault>
          <RadioButton
            animation={'bounceIn'}
            size={13}
            outerColor={colors.radioOuterColor}
            innerColor={colors.radioColor}
            isSelected={activeRadio === item.index}
            onPress={() => activeRadioSetter(item.index)}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.button}
        onPress={() => props.onSelectedLanguage(activeRadio)}>
        <TextDefault textColor={colors.lightBackground} bolder uppercase>
          {i18n.t('done')}
        </TextDefault>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.width100, alignment.PBlarge, alignment.PTlarge]}
        onPress={() => props.onClose()}>
        <TextDefault center>{i18n.t('cancelled')}</TextDefault>
      </TouchableOpacity>
    </View>
  );
}

SettingModal.propTypes = {
  activeRadio: PropTypes.number,
  onSelectedLanguage: PropTypes.func,
  onClose: PropTypes.func,
};
export default SettingModal;
