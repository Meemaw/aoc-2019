import path from 'path';
import fs from 'fs';

type ReadInputOptions = {
  day: number;
};

export function readInput({ day }: ReadInputOptions): Buffer {
  return fs.readFileSync(
    path.join(process.cwd(), 'src', `day${day}`, 'input.txt')
  );
}

export function readAsNumbers(options: ReadInputOptions): number[] {
  return String(readInput(options))
    .split(',')
    .map(Number);
}

export function readLines(options: ReadInputOptions): string[] {
  return String(readInput(options))
    .replace(/\r/g, '')
    .split(/\n/);
}

export function readLinesAsNumbers(options: ReadInputOptions): number[] {
  return readLines(options).map(Number);
}
