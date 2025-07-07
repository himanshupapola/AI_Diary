/* eslint-disable react-native/no-inline-styles */
import {View, Image, Text} from 'react-native';

export default function IconsHandler({focused, image, iconName}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        top: 21,
      }}>
      {focused && (
        <Image
          source={require('../assets/nav/active.png')}
          resizeMode="contain"
          style={{
            width: 14,
            height: 14,
            position: 'absolute',
            top: -24.3,
            tintColor: focused && '#F57C00',
          }}
        />
      )}
      <Image
        source={image}
        resizeMode="contain"
        style={{
          width: image === require('../assets/nav/home.png') ? 31 : 34,
          height: image === require('../assets/nav/home.png') ? 31 : 34,
          tintColor: focused && '#F57C00',
        }}
      />
      <Text
        style={{
          color: focused ? '#e32f45' : '',
          fontSize: 12,
          textAlign: 'center',
        }}
        numberOfLines={2}
        ellipsizeMode="tail">
        {iconName}
      </Text>
    </View>
  );
}
