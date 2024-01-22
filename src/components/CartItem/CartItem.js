import { useNavigation, useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { alignment } from '../../utils/alignment';
import { ICONS_NAME, NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import AppImage from '../AppImage/AppImage';
import TextDefault from '../Text/TextDefault/TextDefault';
import useStyle from './styles';
import { formatCurrency } from '../../utils/format';
import i18n from '../../configs/i18n';

const cartItem = (props) => {
  const styles = useStyle();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const getOptionStr = () => {
    let optionStr = '';
    if (props.product.size_id) {
      optionStr += `Size ${props.product.size_id.title}, `;
    }
    if (props.product.topping_ids) {
      props.product.topping_ids.map((item) => {
        optionStr = optionStr + item.title + ', ';
      });
    }
    if (props.product.sugar) {
      optionStr += `${props.product.sugar.title}% ${i18n.t('sugar')}, `;
    }
    if (props.product.ice) {
      optionStr += `${props.product.ice.title}% ${i18n.t('ice')}`;
    }

    return optionStr;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate(NAVIGATION_SCREEN.ItemDetail, { id: item.id });
        console.log(props.product);
      }}
      activeOpacity={0.7}
      style={styles.itemContainer}>
      <View style={{ width: '25%' }}>
        <AppImage
          imgStyle={styles.imgResponsive}
          imgSource={{ uri: props.product.image }}
          spinnerProps={{ style: styles.loadingView }}
        />
      </View>
      <View style={styles.textContainer}>
        <TextDefault numberOfLines={1} style={alignment.MBxSmall} medium H5>
          {props.product.name}
        </TextDefault>
        <TextDefault
          numberOfLines={2}
          textColor={styles.lightColor.color}
          small
          medium>
          {getOptionStr()}
        </TextDefault>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexGrow: 1 }}>
            <TextDefault
              textColor={colors.tagColor}
              H4
              bolder
              style={alignment.MRxSmall}>
              {formatCurrency(props.dealPrice)}
            </TextDefault>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionContainerBtns}
              onPress={props.subtractQuantity}>
              <Ionicons
                name={ICONS_NAME.Subtract}
                size={scale(16)}
                color={colors.placeHolderColor}
              />
            </TouchableOpacity>
            <View style={styles.actionContainerView}>
              <TextDefault style={[alignment.PLsmall, alignment.PRsmall]}>
                {props.product.quantity}
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.actionContainerBtns, styles.tagbtn]}
              onPress={props.addQuantity}>
              <Ionicons
                name={ICONS_NAME.Add}
                size={scale(16)}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
cartItem.propTypes = {
  subtractQuantity: PropTypes.func,
  addQuantity: PropTypes.func,
  product: PropTypes.object.isRequired,
  dealPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default cartItem;
