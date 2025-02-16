import React, {memo} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {StyleService, useStyleSheet} from '@tsejerome/ui-kitten-components';
import {useNavigation} from '@react-navigation/native';

import Container from '../components/Container';
import Button from '../components/Button';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Card from '../components/Card';
import {OnBoarding} from '../constants/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {screenWidth} from '../utils/layout';
import {scale} from 'react-native-size-matters';
import useSecurity from '../hooks/useSecurity';

const OnBoardingPage = memo(() => {
  const {navigate} = useNavigation();
  const {height, width} = useWindowDimensions();
  const {supportedType} = useSecurity();
  const styles = useStyleSheet(themedStyles);

  const translationX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationX.value = event.contentOffset.x;
  });
  const snapToOffsets = [0, 400];
  /*const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translationX.value,
      OnBoarding.map((_, i) => (width - 50) * i),
      OnBoarding.map(product => product.color),
    ) as string;
    return {backgroundColor, flex: 1};
  });*/
  return (
    <Container style={styles.container}>
      <View style={[{height: height}, {flex: 1, marginLeft: 16}]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          contentContainerStyle={styles.content}
          // snapToInterval={scale(width - 80)}
          snapToOffsets={[...Array(OnBoarding.length)].map(
            (x, i) => i * (width - scale(80)),
          )}
          horizontal
          showsHorizontalScrollIndicator={true}>
          {OnBoarding.map((product, index) => (
            <Card x={translationX} product={product} key={index} />
          ))}
        </Animated.ScrollView>
      </View>

      <View style={styles.bottomView}>
        <Button
          size={'large'}
          children="Start using Whisper"
          style={{flex: 1, marginBottom: scale(16)}}
          onPress={() => {
            AsyncStorage.setItem('shownWelcome', 'true').then(() => {
              navigate('App');
            });
          }}
          status="primary-whisper"
        />
      </View>
    </Container>
  );
});

export default OnBoardingPage;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingLeft: scale(16),
  },
  content: {
    paddingRight: scale(60),
    paddingLeft: scale(16),
  },
  bottomView: {
    paddingBottom: scale(16),
    flexDirection: 'row',
    paddingLeft: scale(32),
    paddingRight: scale(24),
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: scale(0),
    marginBottom: scale(16),
    justifyContent: 'flex-end',
    width: screenWidth,
    flex: 1,
  },
  dot: {
    marginRight: scale(46),
  },
  animated: {
    flexDirection: 'row',
    paddingLeft: scale(16),
  },
});
