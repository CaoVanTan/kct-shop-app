import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../configs/i18n';
import {
  RightButton,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import RadioButton from '../../components/FdRadioBtn/RadioBtn';
import { alignment } from '../../utils/alignment';
import {
  ICONS_NAME,
  NAVIGATION_SCREEN,
  LABEL_ADDRESS,
} from '../../utils/constant';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { editAddress, getAddress } from '../../api/Address/Address';
import Database from '../../configs/Database';
import { onSetAddress } from '../../redux/actions/addressAction';

function CartAddresses() {
  const styles = useStyle();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('myAddresses'),
      headerRight: () => (
        <RightButton
          icon={ICONS_NAME.Plus}
          iconSize={scale(18)}
          onPress={() => navigation.navigate(NAVIGATION_SCREEN.NewAddress)}
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      onGetAddress();
    }, []),
  );

  const onGetAddress = () => {
    setLoading(true);
    getAddress({ access_token: accessToken })
      .then((res) => {
        setAddresses(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const onSelectAddress = (address) => {
    editAddress({
      access_token: accessToken,
      ...address,
      selected: true,
    })
      .then(async (res) => {
        await Database.setAddress({
          value: { ...res, ...address, selected: true },
        });
        dispatch(onSetAddress({ ...res, ...address, selected: true }));
        navigation.goBack();
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <WrapperView>
      <View style={styles.containerInfo}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flex}
          data={loading ? [] : addresses}
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={styles.line} />}
          ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
          ListEmptyComponent={() => loading && <Spinner />}
          renderItem={({ item: address }) => (
            <View style={styles.width100}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.width100}
                onPress={() => {
                  onSelectAddress(address);
                }}>
                <View style={styles.width100}>
                  <View style={[styles.titleAddress, styles.width100]}>
                    <View style={[styles.homeIcon]}>
                      <RadioButton
                        size={10}
                        outerColor={colors.radioOuterColor}
                        innerColor={colors.radioColor}
                        animation={'bounceIn'}
                        isSelected={address.selected}
                        onPress={() => {
                          onSelectAddress(address);
                        }}
                      />
                    </View>
                    <TextDefault style={{ width: '78%' }} H5 bold>
                      {i18n.t(
                        LABEL_ADDRESS.find(
                          (item) => item.value === address.label,
                        ).title,
                      )}
                    </TextDefault>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.editButton}
                      onPress={() =>
                        navigation.navigate(NAVIGATION_SCREEN.EditAddress, {
                          ...address,
                        })
                      }>
                      <MaterialCommunityIcons
                        name={ICONS_NAME.Pencil}
                        size={scale(12)}
                        color={colors.tagColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ ...alignment.MTxSmall }} />
                  <View style={styles.addressDetail}>
                    <TextDefault
                      line={4}
                      textColor={colors.fontSecondColor}
                      bold>
                      {address.address}
                    </TextDefault>
                    <TextDefault
                      line={3}
                      textColor={colors.fontSecondColor}
                      bold>
                      {address.address_detail}
                    </TextDefault>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </WrapperView>
  );
}

export default CartAddresses;
