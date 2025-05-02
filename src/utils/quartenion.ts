import { degToRad } from "three/src/math/MathUtils.js";
import { Euler, Quaternion } from "three";

// Helper function to create target quaternion from Y angle in degrees
export const degQuartenion = (yDeg: number) => {
  return new Quaternion().setFromEuler(new Euler(0, degToRad(yDeg), 0));
};

// Helper function to create target quartenion from rad angle
export const radQuartenion = (yRad: number) => {
  return new Quaternion().setFromEuler(new Euler(0, yRad, 0));
};
