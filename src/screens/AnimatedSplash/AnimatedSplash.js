import React, { useEffect, useMemo } from 'react';
import { Animated, View } from 'react-native';

function AnimatedSplash() {
  const animation = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View pointerEvents="none">
        <Animated.Image
          style={{
            width: '100%',
            height: '100%',
            transform: [
              {
                scale: animation,
              },
            ],
          }}
          source={require('../../../assets/splash.png')}
          fadeDuration={0}
        />
      </Animated.View>
    </View>
  );
}

export default React.memo(AnimatedSplash);
