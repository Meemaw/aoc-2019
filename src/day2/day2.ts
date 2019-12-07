import * as input from '../utils/input';
import { executeProgram } from '../utils/computer';

export function partOne(): number {
  return executeProgramWithOverrides({ noun: 12, verb: 2 });
}

export function partTwo(): number {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (executeProgramWithOverrides({ verb, noun }) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  throw new Error('Could not find input noun and verb');
}

type ExecuteTrackOptions = {
  noun: number;
  verb: number;
};

function executeProgramWithOverrides({
  noun,
  verb,
}: ExecuteTrackOptions): number {
  const memory = input.readAsNumbers({ day: 2 });
  memory[1] = noun;
  memory[2] = verb;
  executeProgram({ memory });
  return memory[0];
}
