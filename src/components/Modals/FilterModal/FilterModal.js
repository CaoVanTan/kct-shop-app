import Icon from 'react-native-vector-icons/MaterialIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useTheme } from '@react-navigation/native';
import { get, keys } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { alignment } from '../../../utils/alignment';
import { SORT_DATA } from '../../../utils/constant';
import { moderateScale } from '../../../utils/scaling';
import RadioBtn from '../../FdRadioBtn/RadioBtn';
import TextDefault from '../../Text/TextDefault/TextDefault';
import useStyle from './styles';
import { formatCurrency } from '../../../utils/format';
import i18n from '../../../configs/i18n';

const FilterModal = (props) => {
  const styles = useStyle();
  const { colors } = useTheme();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters({
      min: 0,
      max: 100000,
      order: keys(SORT_DATA)[0],
    });
  }, [props.filterObj]);

  const setSortValue = useCallback((sortKey) => {
    setFilters((previousState) => ({
      ...previousState,
      order: sortKey,
    }));
  }, []);

  const clearItems = useCallback(() => {
    setFilters({
      min: 0,
      max: 100000,
      order: keys(SORT_DATA)[0],
    });
  }, []);

  const priceSliderChange = useCallback((values) => {
    setFilters((previousState) => ({
      ...previousState,
      min: values[0],
      max: values[1],
    }));
  }, []);

  function applyFilters() {
    props.setFilters({ ...filters });
    props.closeFilterModal();
    props.onGetProducts(
      get(filters, 'min'),
      get(filters, 'max'),
      get(filters, 'order'),
    );
  }

  return (
    <View style={{ flex: 1, padding: moderateScale(15) }}>
      <View
        style={[
          { flexDirection: 'row', justifyContent: 'space-between' },
          alignment.PTsmall,
        ]}>
        <TextDefault H5 bold>
          {i18n.t('filter')}
        </TextDefault>
        <TouchableOpacity
          onPress={clearItems}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextDefault H5 bold textColor={colors.buttonBackgroundBlue}>
            {i18n.t('removeFilter')}
          </TextDefault>
          <Icon name="refresh" size={22} color={colors.buttonBackgroundBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />

      <View style={styles.priceRangeRow}>
        <TextDefault bold H5>
          {i18n.t('rangePrice')}
        </TextDefault>
        <View>
          <TextDefault bold H5 center>
            {formatCurrency(get(filters, 'min')) +
              ' - ' +
              formatCurrency(get(filters, 'max'), false)}
          </TextDefault>
        </View>
      </View>
      <View
        style={[
          { alignItems: 'center' },
          alignment.MTlarge,
          alignment.PLlarge,
          alignment.PRlarge,
        ]}>
        <MultiSlider
          sliderLength={310}
          trackStyle={styles.trackStyle}
          selectedStyle={{ backgroundColor: colors.tagColor }}
          markerStyle={styles.markerStyle}
          pressedMarkerStyle={styles.selectedMarker}
          values={[get(filters, 'min'), get(filters, 'max')]}
          onValuesChange={priceSliderChange}
          min={get(filters, 'min')}
          max={get(filters, 'max')}
          step={5000}
          allowOverlap
          snapped
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextDefault textColor={colors.fontSecondColor} H5 center>
            {formatCurrency(filters.min)}
          </TextDefault>
          <TextDefault textColor={colors.fontSecondColor} H5 center>
            {formatCurrency(filters.max)}
          </TextDefault>
        </View>
      </View>
      <TextDefault bold H5 style={alignment.MTlarge}>
        {i18n.t('order')}
      </TextDefault>
      <View style={[alignment.PLlarge, alignment.PRlarge, alignment.MTmedium]}>
        {keys(SORT_DATA).map((item) => {
          const isSelected = get(filters, 'order') === item;
          return (
            <TouchableOpacity
              key={`SORT_${item}`}
              style={styles.sotRow}
              onPress={() => setSortValue(item)}>
              <TextDefault
                H5
                bold
                textColor={
                  isSelected
                    ? colors.fonfontMainColort
                    : colors.placeHolderColor
                }>
                {i18n.t(get(SORT_DATA, item))}
              </TextDefault>
              <RadioBtn
                size={10}
                animation={'bounceIn'}
                isSelected={isSelected}
                innerColor={colors.radioColor}
                outerColor={colors.radioOuterColor}
                onPress={() => setSortValue(item)}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[alignment.PLlarge, alignment.PRlarge]}>
        <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
          <TextDefault H5 bold textColor={colors.lightBackground}>
            {i18n.t('apply')}
          </TextDefault>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.closeFilterModal()}
          style={[styles.width100, alignment.PBmedium, alignment.PTlarge]}>
          <TextDefault center>{i18n.t('close')}</TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  );
};
FilterModal.propTypes = {
  filterObj: PropTypes.object,
  closeFilterModal: PropTypes.func,
  setFilters: PropTypes.func,
};

export default FilterModal;
