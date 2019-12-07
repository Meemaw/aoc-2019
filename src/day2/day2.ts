import * as input from '../utils/input';

export function partOne(): number {
  return executeTrack({ noun: 12, verb: 2 });
}

export function partTwo(): number {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (executeTrack({ verb, noun }) === 19690720) {
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

function executeTrack({ noun, verb }: ExecuteTrackOptions): number {
  const memory = input.readAsNumbers({ day: 2 });

  memory[1] = noun;
  memory[2] = verb;

  for (let instructionPointer = 0; instructionPointer < memory.length; ) {
    const opcode = memory[instructionPointer];

    switch (opcode) {
      case 1: {
        const v1 = memory[memory[instructionPointer + 1]];
        const v2 = memory[memory[instructionPointer + 2]];
        memory[memory[instructionPointer + 3]] = v1 + v2;
        instructionPointer += 4;
        break;
      }
      case 2: {
        const v1 = memory[memory[instructionPointer + 1]];
        const v2 = memory[memory[instructionPointer + 2]];
        memory[memory[instructionPointer + 3]] = v1 * v2;
        instructionPointer += 4;
        break;
      }
      case 99:
        instructionPointer = memory.length;
        break;
      default:
        throw new Error(`Unexpected opcode: ${opcode}`);
    }
  }
  return memory[0];
}
