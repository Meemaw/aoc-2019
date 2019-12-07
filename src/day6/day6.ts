import * as input from '../utils/input';

type OrbitMap = Record<string, string | undefined>;

function parseOrbit(relation: string): [string, string] {
  return relation.split(')') as [string, string];
}

function buildOrbitMap(relations: string[]): OrbitMap {
  const firstOrbitName = parseOrbit(relations[0])[0];
  return relations.reduce(
    (acc: OrbitMap, relation: string) => {
      const [orbited, orbiting] = parseOrbit(relation);
      return { ...acc, [orbiting]: orbited };
    },
    {
      [firstOrbitName]: undefined,
    }
  );
}

function getOrbitReferenceTrail(
  orbitMap: OrbitMap,
  orbit: string
): Set<string> {
  let orbitLookup = orbit;
  const trail = new Set<string>();
  while (orbitMap[orbitLookup]) {
    const next = orbitMap[orbitLookup] as string;
    trail.add(next);
    orbitLookup = next;
  }
  return trail;
}

function orbitReferenceCount(orbitMap: OrbitMap, orbit: string): number {
  return getOrbitReferenceTrail(orbitMap, orbit).size;
}

export function partOne() {
  const relations = input.readLines({ day: 6 });
  const orbitMap = buildOrbitMap(relations);
  return Object.keys(orbitMap).reduce(
    (sum, orbit) => sum + orbitReferenceCount(orbitMap, orbit),
    0
  );
}

export function partTwo() {
  const relations = input.readLines({ day: 6 });
  const orbitMap = buildOrbitMap(relations);

  const youTrail = Array.from(getOrbitReferenceTrail(orbitMap, 'YOU'));
  const sanTrail = getOrbitReferenceTrail(orbitMap, 'SAN');

  for (let youOffset = 0; youOffset < youTrail.length; youOffset++) {
    const youOrbit = youTrail[youOffset];
    if (sanTrail.has(youOrbit)) {
      return youOffset + Array.from(sanTrail).indexOf(youOrbit);
    }
  }

  throw new Error('Could not find minimum number of orbital transfers');
}
