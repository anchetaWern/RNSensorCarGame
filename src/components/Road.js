import React from 'react';
import {View} from 'react-native';

import RoadLine from './RoadLine';

const Road = ({body, size}) => {
  const width = size[0];
  const height = size[1];

  const x = body.position.x;
  const y = body.position.y;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
      }}
    >
      <RoadLine width={width} height={height} top={0} />

      <RoadLine width={width} height={height} />

      <RoadLine width={width} height={height} />

      <RoadLine width={width} height={height} />

      <RoadLine width={width} height={height} />
    </View>
  );
};

export default Road;
