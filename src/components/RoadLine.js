import React from 'react';
import {View} from 'react-native';

const RoadLine = ({width, height, top = 100}) => {
	return (
		<View
			style={{
				marginTop: top,
				width: width,
				height: height,
				backgroundColor: '#fff',
			}}
		></View>
	);
};

export default RoadLine;
