import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ICONS_NAME } from '../../../utils/constant';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../Text/TextDefault/TextDefault';
import useStyle from './styles';
import i18n from '../../../configs/i18n';

function CartComponent(props) {
  const { colors } = useTheme();
  const styles = useStyle();
  const [quantity, setQuantity] = useState(1);

  function onAdd() {
    setQuantity(quantity + 1);
  }

  function onSubtract() {
    if (quantity === 1) {
      return;
    }
    setQuantity(quantity - 1);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSubtract}
          style={styles.icon}>
          <Ionicons
            name={ICONS_NAME.Subtract}
            size={scale(18)}
            color={colors.placeHolderColor}
          />
        </TouchableOpacity>
        <TextDefault H5 bold center>
          {quantity}
        </TextDefault>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAdd}
          style={styles.icon}>
          <Ionicons
            name={ICONS_NAME.Add}
            size={scale(18)}
            color={colors.placeHolderColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.onPress(quantity)}
          style={styles.btnContainer}>
          <TextDefault textColor={colors.buttonText} H5 bold center>
            {i18n.t('addToCart')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  );
}
CartComponent.propTypes = {
  onPress: PropTypes.func,
};

export default CartComponent;
