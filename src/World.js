import React, {Component} from 'react';

import {StyleSheet, Text, View, Alert} from 'react-native';

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';

import randomInt from 'random-int';
import sampleSize from 'lodash.samplesize';

import Car from './components/Car';
import Box from './components/Box';
import Road from './components/Road';

import getRandomDecimal from './helpers/getRandomDecimal';

setUpdateIntervalForType(SensorTypes.accelerometer, 15);

import {
  CAR_WIDTH,
  CAR_HEIGHT,
  MID_POINT,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
} from './Constants';

import {OPPOSING_CAR_IMAGES} from './Images';

import {car, floor, road} from './Objects';

export default class World extends Component {
  state = {
    x: 0,
    y: DEVICE_HEIGHT - 200,
    isGameSetup: false,
    isGamePaused: false,
    score: 0,
  };

  constructor(props) {
    super(props);

    this.opposing_cars = [];

    const {engine, world} = this.addObjectsToWorld(car);
    this.entities = this.getEntities(engine, world, car, road);

    this.physics = (entities, {time}) => {
      let engine = entities['physics'].engine;

      engine.world.gravity.y = 0.5; // .0625, .125, .25, .5, .75, 1
      Matter.Engine.update(engine, time.delta);
      return entities;
    };

    this.roadTranslation = (entities, {time}) => {
      if (!this.state.isGamePaused) {
        Matter.Body.setPosition(road, {
          x: road.position.x,
          y: road.position.y + 1,
        });

        if (road.position.y >= DEVICE_HEIGHT / 5) {
          Matter.Body.setPosition(road, {
            x: road.position.x,
            y: 0,
          });
        }
      }
      return entities;
    };

    this.setupCollisionHandler(engine);
  }

  componentDidMount() {
    Matter.Body.setPosition(car, {
      x: DEVICE_WIDTH / 2,
      y: DEVICE_HEIGHT - 200,
    });

    this.accelerometer = accelerometer.subscribe(({x}) => {
      if (!this.state.isGamePaused) {
        Matter.Body.setPosition(car, {
          x: this.state.x + x,
          y: DEVICE_HEIGHT - 200,
        });

        this.setState(
          state => ({
            x: x + state.x,
          }),
          () => {
            if (this.state.x < 0 || this.state.x > DEVICE_WIDTH) {
              Matter.Body.setPosition(car, {
                x: MID_POINT,
                y: DEVICE_HEIGHT - 30,
              });

              this.setState({
                x: MID_POINT,
              });

              this.gameOver('You hit the side of the road!');
            }
          },
        );
      }
    });

    this.setState({
      isGameSetup: true,
    });
  }

  componentWillUnmount() {
    if (this.accelerometer) {
      this.accelerometer.stop();
    }
  }

  addObjectsToWorld = car => {
    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;

    let objects = [road, car, floor];

    for (let x = 0; x <= 4; x++) {
      const opposing_cars = Matter.Bodies.rectangle(
        randomInt(1, DEVICE_WIDTH - 10),
        0,
        CAR_WIDTH,
        CAR_HEIGHT,
        {
          frictionAir: getRandomDecimal(0.05, 0.25),
          label: 'opposing_car',
        },
      );

      this.opposing_cars.push(opposing_cars);
    }

    objects = objects.concat(this.opposing_cars);

    Matter.World.add(world, objects);

    return {
      engine,
      world,
    };
  };

  setupCollisionHandler = engine => {
    Matter.Events.on(engine, 'collisionStart', event => {
      var pairs = event.pairs;

      var objA = pairs[0].bodyA.label;
      var objB = pairs[0].bodyB.label;

      console.log(objA + ' -> ' + objB);

      if (objA === 'floor' && objB === 'opposing_car') {
        Matter.Body.setPosition(pairs[0].bodyB, {
          // set new initial position for the block
          x: randomInt(20, DEVICE_WIDTH - 20),
          y: 0,
        });

        this.setState(state => ({
          score: state.score + 1,
        }));
      }

      if (objA === 'car' && objB === 'opposing_car') {
        this.gameOver('You bumped to another car!');
      }
    });
  };

  gameOver = msg => {
    this.opposing_cars.forEach(item => {
      Matter.Body.set(item, {
        isStatic: true,
      });
    });

    this.setState({
      isGamePaused: true,
    });

    Alert.alert(`Game Over, ${msg}`, 'Want to play again?', [
      {
        text: 'Cancel',
        onPress: () => {
          this.accelerometer.unsubscribe();
          Alert.alert(
            'Bye!',
            'Just relaunch the app if you want to play again.',
          );
        },
      },
      {
        text: 'OK',
        onPress: () => {
          this.resetGame();
        },
      },
    ]);
  };

  resetGame = () => {
    this.setState({
      isGamePaused: false,
    });

    this.opposing_cars.forEach(item => {
      // loop through all the blocks
      Matter.Body.set(item, {
        isStatic: false, // make the block susceptible to gravity again
      });
      Matter.Body.setPosition(item, {
        // set new position for the block
        x: randomInt(20, DEVICE_WIDTH - 20),
        y: 0,
      });
    });

    this.setState({
      score: 0, // reset the player score
    });
  };

  getEntities = (engine, world, car, road) => {
    const entities = {
      physics: {
        engine,
        world,
      },

      theRoad: {
        body: road,
        size: [20, 100],
        renderer: Road,
      },

      playerCar: {
        body: car,
        size: [CAR_WIDTH, CAR_WIDTH],
        image: require('../assets/images/red-car.png'),
        renderer: Car,
      },

      gameFloor: {
        body: floor,
        size: [DEVICE_WIDTH, 10],
        color: '#414448',
        renderer: Box,
      },
    };

    // get unique items from array
    const selected_car_images = sampleSize(OPPOSING_CAR_IMAGES, 5);

    for (let x = 0; x <= 4; x++) {
      Object.assign(entities, {
        ['opposing_car' + x]: {
          body: this.opposing_cars[x],
          size: [CAR_WIDTH, CAR_HEIGHT],
          image: selected_car_images[x],
          renderer: Car,
        },
      });
    }

    return entities;
  };

  render() {
    const {isGameSetup, score} = this.state;

    if (isGameSetup) {
      return (
        <GameEngine
          style={styles.container}
          systems={[this.physics, this.roadTranslation]}
          entities={this.entities}
        >
          <View style={styles.infoWrapper}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
          </View>
        </GameEngine>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Something isn't right..</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  centered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },

  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    right: 50,
  },
  scoreText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
});
