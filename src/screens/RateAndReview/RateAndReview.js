import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating-widget';
import i18n from '../../configs/i18n';
import { FlashMessage } from '../../components/FlashMessage/FlashMessage';
import Spinner from '../../components/Spinner/Spinner';
import TextDefault from '../../components/Text/TextDefault/TextDefault';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { WrapperView } from '../../components';
import { TextField } from 'react-native-material-textfield';
import { textStyles } from '../../utils/textStyles';
import { alignment } from '../../utils/alignment';
import { ratingOrder } from '../../api/Order/Order';
import { useSelector } from 'react-redux';

function RateAndReview() {
  const route = useRoute();
  const refNote = useRef();
  const styles = useStyle();
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [ratingEmp, setRatingEmp] = useState(route.params.ratingEmp || 0);
  const [ratingProduct, setRatingProduct] = useState(
    route.params.ratingProduct || 0,
  );
  const [loading, setLoading] = useState(false);
  console.log(route.params);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t('rateAndReview'),
      headerRight: null,
    });
  }, [navigation]);

  function onSubmit() {
    if (ratingEmp === 0 || ratingProduct === 0) {
      FlashMessage({
        message: 'Bạn phải chọn số sao đánh giá',
      });
    } else {
      setLoading(true);
      console.log({
        access_token: accessToken,
        id: route.params.id,
        rating_emp: ratingEmp.toString(),
        rating_product: ratingProduct.toString(),
        rating_detail: refNote.current.value(),
      });
      ratingOrder({
        access_token: accessToken,
        id: route.params.id,
        rating_emp: ratingEmp.toString(),
        rating_product: ratingProduct.toString(),
        rating_detail: refNote.current.value(),
      })
        .then((res) => {
          setLoading(false);
          FlashMessage({
            message: 'Bạn đã đánh giá đơn hàng thành công',
          });
          navigation.pop();
        })
        .catch((err) => {
          console.log('err', err);
          setLoading(false);
        });
    }
  }

  return (
    <WrapperView>
      <View style={[styles.flex]}>
        <View style={styles.reviewTextContainer}>
          <TextDefault H4 bold style={{ width: '30%' }}>
            {i18n.t('shipper')}
          </TextDefault>
          <StarRating
            color={colors.startColor}
            maxStars={5}
            rating={ratingEmp}
            onChange={route.params.state === 'done' ? () => {} : setRatingEmp}
          />
        </View>
        <View style={styles.reviewTextContainer}>
          <TextDefault H4 bold style={{ width: '30%' }}>
            {i18n.t('drinks')}
          </TextDefault>
          <StarRating
            color={colors.startColor}
            maxStars={5}
            rating={ratingProduct}
            onChange={
              route.params.state === 'done' ? () => {} : setRatingProduct
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextField
            editable={route.params.state !== 'done'}
            ref={refNote}
            label={i18n.t('reviewPlaceholder')}
            defaultValue={
              route.params.state === 'done' ? route.params.ratingDetail : ''
            }
            style={{
              ...textStyles.Normal,
              color: colors.fontMainColor,
            }}
            labelFontSize={scale(12)}
            fontSize={scale(12)}
            textColor={colors.fontMainColor}
            baseColor={colors.fontSecondColor}
            tintColor={colors.buttonBackground}
            labelTextStyle={{
              ...textStyles.Normal,
              paddingTop: scale(1),
            }}
          />
        </View>
        {route.params.state !== 'done' && (
          <View style={styles.btnContainer}>
            {loading ? (
              <Spinner />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.buttonBackground,
                  height: 44,
                  width: '70%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: scale(10),
                  ...alignment.MBmedium,
                }}
                onPress={() => onSubmit()}>
                <TextDefault
                  textColor={colors.fontMainColor}
                  H4
                  bold
                  style={{ ...alignment.PTxSmall, ...alignment.PBxSmall }}>
                  {i18n.t('submitRating')}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: colors.background,
        }}
      />
    </WrapperView>
  );
}
export default RateAndReview;
