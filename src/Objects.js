import Matter from 'matter-js';
import {CAR_WIDTH, CAR_HEIGHT, DEVICE_WIDTH, DEVICE_HEIGHT} from './Constants';

import randomInt from 'random-int';

export const car = Matter.Bodies.rectangle(
  0,
  DEVICE_HEIGHT - 30,
  CAR_WIDTH,
  CAR_HEIGHT,
  {
    isStatic: true,
    label: 'car',
  },
);

export const floor = Matter.Bodies.rectangle(
  DEVICE_WIDTH / 2,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  10,
  {
    isStatic: true,
    isSensor: true,
    label: 'floor',
  },
);

export const road = Matter.Bodies.rectangle(DEVICE_WIDTH / 2, 100, 20, 100, {
  isStatic: true,
  isSensor: false,
  label: 'road',
});
