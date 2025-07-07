import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const Emoji = ({mood, backgroundColor, size = 40}) => {
  const getEmojiPath = () => {
    switch (mood) {
      case 'Very Sad':
        return 'M 20 42 Q 30 25, 40 42';
      case 'Sad':
        return 'M 20 40 Q 30 30, 40 40';
      case 'Neutral':
        return 'M 20 35 H 40';
      case 'Happy':
        return 'M 20 33 Q 30 44, 40 34';
      case 'Very Happy':
        return 'M 18 30 Q 30 52, 42 30';
      default:
        return '';
    }
  };

  if (mood === 'Very Sad') {
    backgroundColor = '#FFB6A6';
  } else if (mood === 'Sad') {
    backgroundColor = '#FFCF55';
  } else if (mood === 'Neutral') {
    backgroundColor = '#FFF731';
  } else if (mood === 'Happy') {
    backgroundColor = '#00FFFF';
  } else if (mood === 'Very Happy') {
    backgroundColor = '#00FF94';
  } else {
    backgroundColor = 'white';
  }

  return (
    <Svg height={size} width={size} viewBox="0 0 60 60">
      {/* Face Circle */}
      <Circle
        cx="30"
        cy="30"
        r="20"
        stroke="black"
        strokeWidth="2"
        fill={backgroundColor}
      />
      {/* Eyes */}
      <Circle cx="24" cy="25" r="2" fill="black" />
      <Circle cx="36" cy="25" r="2" fill="black" />
      {/* Mouth */}
      <Path
        d={getEmojiPath()}
        stroke="black"
        strokeWidth="2"
        fill="transparent"
      />
    </Svg>
  );
};

export default Emoji;
