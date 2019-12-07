type Condition = (digits: string) => boolean;

function digitsDoNotDecrease(digits: string): boolean {
  for (let i = 0; i < digits.length; i++) {
    if (digits[i + 1] < digits[i]) {
      return false;
    }
  }
  return true;
}

function areTwoAdjecentDigitsTheSame(digits: string) {
  for (let i = 0; i < digits.length; i++) {
    if (digits[i + 1] === digits[i]) {
      return true;
    }
  }
  return false;
}

function areExactlyTwoAdjecentDigitsTheSame(digits: string) {
  for (let i = 1; i < digits.length; i++) {
    let numMatching = 1;
    while (digits[i] === digits[i - 1] && i < digits.length) {
      numMatching++;
      i++;
    }

    if (numMatching === 2) {
      return true;
    }
  }
  return false;
}

function matchesEveryCondition(
  digits: number,
  conditions: Condition[]
): boolean {
  const digitAsString = String(digits);
  return conditions.every(condition => condition(digitAsString));
}

function solve(conditions: Condition[]): number {
  let numMatching = 0;

  for (let digits = 278384; digits < 824795; digits++) {
    if (matchesEveryCondition(digits, conditions)) {
      numMatching++;
    }
  }

  return numMatching;
}

export function partOne(): number {
  return solve([digitsDoNotDecrease, areTwoAdjecentDigitsTheSame]);
}

export function partTwo(): number {
  return solve([digitsDoNotDecrease, areExactlyTwoAdjecentDigitsTheSame]);
}
