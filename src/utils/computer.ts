type Opcode = 1 | 2 | 3 | 4 | 99;

enum Instruction {
  ADD = 1,
  MULTIPLY = 2,
  IN = 3,
  OUT = 4,
  JIT = 5,
  JIF = 6,
  LT = 7,
  EQ = 8,
  HALT = 99,
}

enum AccessMode {
  POSITION = 0,
  IMMEDIATE = 1,
}

type Memory = number[];

type Pointer = number;

type Value = number;

type AccessValueOptions = {
  pointer: Pointer;
  accessMode: AccessMode;
};

function parseInstruction(instruction: Instruction) {
  const paddedInstruction = String(instruction).padStart(5, ' ');
  const thirdParameterAccessMode = Number(
    paddedInstruction.charAt(0)
  ) as AccessMode;
  const secondParameterAccessMode = Number(
    paddedInstruction.charAt(1)
  ) as AccessMode;
  const firstParameterAccessMode = Number(
    paddedInstruction.charAt(2)
  ) as AccessMode;
  const opcode = Number(
    paddedInstruction.substring(3, paddedInstruction.length)
  ) as Opcode;
  return {
    opcode,
    firstParameterAccessMode,
    secondParameterAccessMode,
    thirdParameterAccessMode,
  };
}

type ProgramOptions = {
  memory: Memory;
  input?: number[];
};

export function executeProgram({ memory, input }: ProgramOptions): number[] {
  const output: number[] = [];
  const asyncProgram = executeProgramAsync({ memory, input });
  let nextResult = asyncProgram.next();
  while (!nextResult.done) {
    output.push(nextResult.value);
    nextResult = asyncProgram.next();
  }
  return output;
}

export function* executeProgramAsync({
  memory,
  input,
}: ProgramOptions): Generator<number, any, undefined> {
  const safeInputs = (input || []).slice();
  let instructionPointer = 0;

  function getInputValue(): number {
    if (safeInputs.length === 0) {
      throw new Error(
        `Missing input, instructionPointer: ${instructionPointer}`
      );
    }
    return safeInputs.shift() as number;
  }

  function getArg({ pointer, accessMode }: AccessValueOptions): Value {
    switch (accessMode) {
      case AccessMode.POSITION:
        return memory[Number(memory[pointer])];
      case AccessMode.IMMEDIATE:
        return memory[pointer];
      default:
        throw new Error(`Unexpected parameter mode: ${accessMode}`);
    }
  }

  function getFirstArg(accessMode: AccessMode) {
    return getArg({ pointer: instructionPointer + 1, accessMode });
  }

  function getSecondArg(accessMode: AccessMode) {
    return getArg({ pointer: instructionPointer + 2, accessMode });
  }

  function getThirdArg(accessMode: AccessMode) {
    return getArg({ pointer: instructionPointer + 3, accessMode });
  }

  function addOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const address = getThirdArg(AccessMode.IMMEDIATE);
    memory[address] = getFirstArg(p1Mode) + getSecondArg(p2Mode);
    instructionPointer += 4;
  }

  function multiplyOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const address = getThirdArg(AccessMode.IMMEDIATE);
    memory[address] = getFirstArg(p1Mode) * getSecondArg(p2Mode);
    instructionPointer += 4;
  }

  function jitOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = getFirstArg(p1Mode);
    if (v1 !== 0) {
      instructionPointer = getSecondArg(p2Mode);
    } else {
      instructionPointer += 3;
    }
  }

  function jifOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = getFirstArg(p1Mode);
    if (v1 === 0) {
      instructionPointer = getSecondArg(p2Mode);
    } else {
      instructionPointer += 3;
    }
  }

  function ltOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const address = getThirdArg(AccessMode.IMMEDIATE);
    memory[address] = getFirstArg(p1Mode) < getSecondArg(p2Mode) ? 1 : 0;
    instructionPointer += 4;
  }

  function eqOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const address = getThirdArg(AccessMode.IMMEDIATE);
    memory[address] = getFirstArg(p1Mode) === getSecondArg(p2Mode) ? 1 : 0;
    instructionPointer += 4;
  }

  function inOp() {
    const address = getFirstArg(AccessMode.IMMEDIATE);
    memory[address] = getInputValue();
    instructionPointer += 2;
  }

  function outOp() {
    const address = getFirstArg(AccessMode.IMMEDIATE);
    instructionPointer += 2;
    return address;
  }

  while (instructionPointer < memory.length) {
    const nextInstruction = memory[instructionPointer];
    const {
      opcode,
      firstParameterAccessMode,
      secondParameterAccessMode,
    } = parseInstruction(nextInstruction);

    switch (opcode) {
      case Instruction.ADD:
        addOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.MULTIPLY:
        multiplyOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.IN:
        inOp();
        break;
      case Instruction.OUT:
        yield memory[outOp()];
        break;
      case Instruction.JIT:
        jitOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.JIF:
        jifOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.LT:
        ltOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.EQ:
        eqOp(firstParameterAccessMode, secondParameterAccessMode);
        break;
      case Instruction.HALT:
        instructionPointer = memory.length;
        break;
      default:
        throw new Error(`Unexpected opcode: ${opcode}`);
    }
  }
}
