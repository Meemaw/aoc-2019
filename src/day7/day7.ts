import * as input from '../utils/input';
import { executeProgram, executeProgramAsync } from '../utils/computer';

const permutator = (n: number[]) => {
  const permutations: number[][] = [];

  const permute = (digits: number[], memo: number[] = []) => {
    if (digits.length === 0) {
      permutations.push(memo);
      return;
    }
    for (let i = 0; i < digits.length; i++) {
      const digitsCopy = digits.slice();
      const nextDigit = digitsCopy.splice(i, 1);
      permute(digitsCopy.slice(), memo.concat(nextDigit));
    }
  };

  permute(n);
  return permutations;
};

export function partOne() {
  const settingsPermutations = permutator(Array.from(Array(5).keys()));

  function runForSettings(sequence: number[], programInput: number = 0) {
    const memory = input.readAsNumbers({ day: 7 });
    return sequence.reduce((programOutput, phaseSetting) => {
      const input = [phaseSetting, programOutput];
      const outputs = executeProgram({ memory, input });
      return outputs[0];
    }, programInput);
  }

  return settingsPermutations.reduce((maxOutputSignal, settings) => {
    const outputSignal = runForSettings(settings);
    if (outputSignal > maxOutputSignal) {
      return outputSignal;
    }
    return maxOutputSignal;
  }, Number.MIN_SAFE_INTEGER);
}
