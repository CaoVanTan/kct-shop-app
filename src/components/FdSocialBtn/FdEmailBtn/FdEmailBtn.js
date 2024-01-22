import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Spinner from '../../../components/Spinner/Spinner';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { COLORS } from '../../../theme';
import { alignment } from '../../../utils/alignment';
import { scale } from '../../../utils/scaling';
import useStyle from './styles';
import i18n from '../../../configs/i18n';

const FdEmailBtn = (props) => {
  const styles = useStyle();
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.mainContainer}
      onPress={props.onPress}>
      {props.loadingIcon ? (
        <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={colors.tagColor} />
      ) : (
        <>
          {/* <Image
            source={require('../../../../assets/adaptive-icon.png')}
            style={styles.marginLeft5}
            tintColor={COLORS.primary}
            width={scale(54)}
            height={scale(54)}
          /> */}
          <TextDefault style={alignment.MLxSmall} bold>
            {i18n.t('signUpByEmail')}
          </TextDefault>
        </>
      )}
    </TouchableOpacity>
  );
};
FdEmailBtn.propTypes = {
  onPress: PropTypes.func,
  loadingIcon: PropTypes.bool,
};
export default FdEmailBtn;
