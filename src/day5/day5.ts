import * as input from '../utils/input';
import { executeProgram } from '../utils/computer';

export function partOne() {
  const memory = input.readAsNumbers({ day: 5 });
  const output = executeProgram({ memory, input: [1] });
  return output[output.length - 1];
}

export function partTwo() {
  const memory = input.readAsNumbers({ day: 5 });
  const output = executeProgram({ memory, input: [5] });
  return output[output.length - 1];
}
