import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

export const DEVICE_HEIGHT = height;
export const DEVICE_WIDTH = width;

export const CAR_WIDTH = 10;
export const CAR_HEIGHT = 13;

export const MID_POINT = width / 2 - CAR_WIDTH / 2;
