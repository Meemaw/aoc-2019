import { partOne, partTwo } from './day1';

describe('day1', () => {
  it('Should solve part one', () => {
    expect(partOne()).toEqual(3337604);
  });

  it('Should solve part two', () => {
    expect(partTwo()).toEqual(5003530);
  });
});
