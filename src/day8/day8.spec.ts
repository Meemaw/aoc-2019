import { partOne, partTwo } from './day8';

describe('day8', () => {
  it('Should solve part one', () => {
    expect(partOne()).toEqual(1485);
  });

  it('Should solve part two', () => {
    expect(partTwo()).toEqual(
      `XXX  X     XX  X  X XXXX 
X  X X    X  X X X  X    
X  X X    X  X XX   XXX  
XXX  X    XXXX X X  X    
X X  X    X  X X X  X    
X  X XXXX X  X X  X X    `
    );
  });
});
