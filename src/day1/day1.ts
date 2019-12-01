import * as input from 'utils/input';

function calculateRequiredFuel(moduleMass: number): number {
  return Math.floor(moduleMass / 3) - 2;
}

function calculateTotalRequiredFuel(moduleMass: number, acc = 0): number {
  const requiredFuel = calculateRequiredFuel(moduleMass);
  return requiredFuel <= 0
    ? acc
    : calculateTotalRequiredFuel(requiredFuel, acc + requiredFuel);
}

export function partOne(): number {
  return input.readLinesAsNumbers({ day: 1 }).reduce((acc, moduleMass) => {
    return acc + calculateRequiredFuel(moduleMass);
  }, 0);
}

export function partTwo(): number {
  return input.readLinesAsNumbers({ day: 1 }).reduce((acc, moduleMass) => {
    return acc + calculateTotalRequiredFuel(moduleMass);
  }, 0);
}
