import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import EmptyFood from '../../assets/images/SVG/imageComponents/EmptyFood';
import {
  CategoryCard,
  Spinner,
  TextDefault,
  WrapperView,
} from '../../components';
import { alignment } from '../../utils/alignment';
import { NAVIGATION_SCREEN } from '../../utils/constant';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { getCategories } from '../../api/Home/Home';
import i18n from '../../configs/i18n';

function Home() {
  const styles = useStyle();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('home'),
    });
  }, []);

  useEffect(() => {
    onGetCategories();
  }, []);

  const onGetCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  function emptyView() {
    if (loading) {
      return <Spinner />;
    } else {
      return (
        <View style={styles.emptyContainer}>
          <EmptyFood width={scale(250)} height={scale(250)} />
          <TextDefault H4 bold style={alignment.MTlarge}>
            Không có danh mục nào
          </TextDefault>
        </View>
      );
    }
  }

  return (
    <WrapperView>
      <View style={[styles.flex, styles.mainContentContainer]}>
        <FlatList
          style={styles.flex}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={emptyView()}
          data={loading ? [] : categories}
          refreshing={false}
          ListHeaderComponent={() => {
            if (!loading) {
              return (
                <TextDefault style={alignment.Psmall} H4 medium>
                  {i18n.t('category')}
                </TextDefault>
              );
            }
            return null;
          }}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.cardViewContainer}>
              <CategoryCard
                onPress={() =>
                  navigation.navigate(NAVIGATION_SCREEN.CategoryItems, {
                    ...item,
                  })
                }
                name={item.name}
                description={item.description}
                image={item.image || ''}
              />
            </View>
          )}
        />
      </View>
    </WrapperView>
  );
}

export default React.memo(Home);
