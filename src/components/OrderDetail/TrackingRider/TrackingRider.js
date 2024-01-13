import React, { useEffect } from 'react';
import { View, Dimensions, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import PropTypes from 'prop-types';
import Spinner from '../../../components/Spinner/Spinner';
import { scale } from '../../../utils/scaling';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

const TrackingRider = ({ id, delivery_address: deliveryAddress }) => {
  let map = null;

  const fitMarkers = markers => {
    map.fitToCoordinates(markers, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  };

  return (
    <>
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          height: scale(200),
          marginTop: scale(20),
        }}>
        <MapView
          ref={ref => {
            map = ref;
          }}
          style={{ flex: 1 }}
          // scrollEnabled={false}
          // zoomEnabled={false}
          // zoomControlEnabled={false}
          // rotateEnabled={false}
          // cacheEnabled={true}
          initialRegion={{
            // latitude: parseFloat(data.rider.location.latitude),
            latitudeDelta: LATITUDE_DELTA,
            // longitude: parseFloat(data.rider.location.longitude),
            longitudeDelta: LONGITUDE_DELTA,
          }}
          provider={PROVIDER_GOOGLE}>
          <Marker
            title="Delivery Address"
            coordinate={{
              latitude: parseFloat(deliveryAddress.latitude),
              longitude: parseFloat(deliveryAddress.longitude),
            }}>
            <Image
              style={{ width: scale(30), height: scale(30) }}
              source={require('../../../assets/images/home.png')}
            />
          </Marker>
          <Marker
            title="Rider"
            coordinate={
              {
                // latitude: parseFloat(data.rider.location.latitude),
                // longitude: parseFloat(data.rider.location.longitude),
              }
            }>
            <Image
              style={{ width: scale(30), height: scale(30) }}
              source={require('../../../assets/images/rider.png')}
            />
          </Marker>
        </MapView>
      </View>
    </>
  );
};
TrackingRider.propTypes = {
  delivery_address: PropTypes.shape({
    latitude: PropTypes.string,
    longitude: PropTypes.string,
  }),
  id: PropTypes.string,
};

export default TrackingRider;
