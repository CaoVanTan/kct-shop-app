import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import TextDefault from '../../Text/TextDefault/TextDefault';
import styles from './styles';
import { formatCurrency } from '../../../utils/format';

function HeadingComponent(props) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <TextDefault numberOfLines={1} H4 bold>
            {props.title}
          </TextDefault>
        </View>
        <View style={styles.priceContainer}>
          <TextDefault textColor={colors.tagColor} H4 bolder>{`${formatCurrency(
            props.price,
          )}`}</TextDefault>
        </View>
      </View>
      <View style={styles.descContainer}>
        {props.desc !== false && (
          <TextDefault
            numberOfLines={3}
            textColor={colors.fontSecondColor}
            H5
            medium>
            {props.desc || ''}
          </TextDefault>
        )}
      </View>
    </>
  );
}

HeadingComponent.propTypes = {
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  desc: PropTypes.string,
};
export default HeadingComponent;
