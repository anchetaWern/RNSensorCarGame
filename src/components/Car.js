import React from 'react';
import {Image} from 'react-native';

import {DEVICE_WIDTH, DEVICE_HEIGHT} from '../Constants';

const BODY_DIAMETER = Math.trunc(Math.max(DEVICE_WIDTH, DEVICE_HEIGHT) * 0.05);

function Car({body, image}) {
	const {position} = body;

	const x = position.x - BODY_DIAMETER / 2;
	const y = position.y - BODY_DIAMETER / 2;

	return (
		<Image
			source={image}
			resizeMode="contain"
			style={{
				width: BODY_DIAMETER,
				height: BODY_DIAMETER,
				position: 'absolute',
				left: x,
				top: y,
			}}
		/>
	);
}

export default Car;
