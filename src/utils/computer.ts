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
  memory: Memory;
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

function accessValue({
  memory,
  pointer,
  accessMode,
}: AccessValueOptions): Value {
  switch (accessMode) {
    case AccessMode.POSITION:
      return memory[Number(memory[pointer])];
    case AccessMode.IMMEDIATE:
      return memory[pointer];
    default:
      throw new Error(`Unexpected parameter mode: ${accessMode}`);
  }
}

type ProgramOptions = {
  memory: Memory;
  inputs?: number[];
};

export function executeProgram({ memory, inputs }: ProgramOptions): number[] {
  const safeInputs = (inputs || []).slice();
  const output = [];
  let instructionPointer = 0;

  function accessFirstParameterImmediate() {
    return accessValue({
      memory,
      pointer: instructionPointer + 1,
      accessMode: AccessMode.IMMEDIATE,
    });
  }

  function accessFirstParameter(accessMode: AccessMode) {
    return accessValue({ memory, pointer: instructionPointer + 1, accessMode });
  }

  function accessSecondParameter(accessMode: AccessMode) {
    return accessValue({ memory, pointer: instructionPointer + 2, accessMode });
  }

  function accessThirdParameter(accessMode: AccessMode) {
    return accessValue({ memory, pointer: instructionPointer + 3, accessMode });
  }

  function addOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    const v2 = accessSecondParameter(p2Mode);
    memory[memory[instructionPointer + 3]] = v1 + v2;
    instructionPointer += 4;
  }

  function multiplyOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    const v2 = accessSecondParameter(p2Mode);
    memory[memory[instructionPointer + 3]] = v1 * v2;
    instructionPointer += 4;
  }

  function jitOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    if (v1 !== 0) {
      instructionPointer = accessSecondParameter(p2Mode);
    } else {
      instructionPointer += 3;
    }
  }

  function jifOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    if (v1 === 0) {
      instructionPointer = accessSecondParameter(p2Mode);
    } else {
      instructionPointer += 3;
    }
  }

  function ltOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    const v2 = accessSecondParameter(p2Mode);
    const address = accessThirdParameter(AccessMode.IMMEDIATE);
    memory[address] = v1 < v2 ? 1 : 0;
    instructionPointer += 4;
  }

  function eqOp(p1Mode: AccessMode, p2Mode: AccessMode) {
    const v1 = accessFirstParameter(p1Mode);
    const v2 = accessSecondParameter(p2Mode);
    const address = accessThirdParameter(AccessMode.IMMEDIATE);
    memory[address] = v1 === v2 ? 1 : 0;
    instructionPointer += 4;
  }

  function inOp() {
    const address = accessFirstParameterImmediate();
    if (safeInputs.length === 0) {
      throw new Error('Missing input');
    }
    memory[address] = safeInputs.shift() as number;
    instructionPointer += 2;
  }

  function outOp() {
    const position = accessFirstParameterImmediate();
    instructionPointer += 2;
    return position;
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
        output.push(memory[outOp()]);
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

  return output;
}
