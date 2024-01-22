import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlashMessage, TextDefault, WrapperView } from '../../components';
import {
  LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE,
  LONGITUDE_DELTA,
  NAVIGATION_SCREEN,
} from '../../utils/constant';
import useStyle from './styles';
import { hasLocationPermission } from '../../services/Location';
import i18n from '../../configs/i18n';

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

export default function FullMap() {
  const route = useRoute();
  const styles = useStyle();
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const latitude = route.params.latitude ?? LATITUDE;
  const longitude = route.params.longitude ?? LONGITUDE;
  const backScreen = route.params.currentScreen ?? null;

  const [mapMargin, setMapMargin] = useState(1);
  const [region, setRegion] = useState({
    latitude: latitude,
    latitudeDelta: LATITUDE_DELTA,
    longitude: longitude,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('map'),
      headerRight: null,
    });
  }, [navigation]);

  useEffect(() => {
    if (backScreen === 'NewAddress') {
      _getLocationAsync();
    }
  }, [backScreen]);

  async function _getLocationAsync() {
    const status = await hasLocationPermission();
    if (status) {
      Geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: parseFloat(position.coords.latitude),
            latitudeDelta: LATITUDE_DELTA,
            longitude: parseFloat(position.coords.longitude),
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(locationData);
        },
        (error) => {
          FlashMessage({
            message: 'Quyền vị trí không được cấp',
          });
          setRegion({
            latitude: latitude,
            latitudeDelta: LATITUDE_DELTA,
            longitude: longitude,
            longitudeDelta: LONGITUDE_DELTA,
          });
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        },
      );
    } else {
      FlashMessage({
        message: 'Quyền vị trí không được cấp',
      });
    }
  }

  function onSave() {
    if (backScreen === NAVIGATION_SCREEN.NewAddress) {
      navigation.navigate(NAVIGATION_SCREEN.NewAddress, {
        regionChange: region,
      });
    } else if (backScreen === NAVIGATION_SCREEN.EditAddress) {
      navigation.navigate(NAVIGATION_SCREEN.EditAddress, {
        regionChange: region,
        id: route.params.id,
      });
    }
  }

  return (
    <WrapperView>
      <View style={styles.flex}>
        <View style={[styles.flex, { backgroundColor: colors.background }]}>
          <MapView
            style={[styles.container, { marginTop: mapMargin }]}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={dark ? mapStyle : null}
            showsMyLocationButton
            onMapReady={() => setMapMargin(0)}
            showsTraffic={false}
            rotateEnabled={false}
          />
          <View style={styles.markerFixed}>
            <Icon name="location-sharp" size={36} color={'#ea4335'} />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.button}
            onPress={onSave}>
            <TextDefault textColor={colors.white} H4 bold>
              {i18n.t('save')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </WrapperView>
  );
}
