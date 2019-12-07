import * as input from '../utils/input';

type Point = {
  x: number;
  y: number;
};

type Direction = 'R' | 'L' | 'D' | 'U';

type Subpath = {
  direction: Direction;
  distance: number;
};

const nextPointLookup: Record<Direction, (p: Point) => Point> = {
  R: p => ({ x: p.x + 1, y: p.y }),
  L: p => ({ x: p.x - 1, y: p.y }),
  U: p => ({ x: p.x, y: p.y + 1 }),
  D: p => ({ x: p.x, y: p.y - 1 }),
};

function manhattanDistance(p1: Point, p2: Point = { x: 0, y: 0 }): number {
  return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

function parsePath(path: string): Subpath[] {
  return path.split(',').map(subpath => ({
    direction: subpath.charAt(0) as Direction,
    distance: Number(subpath.substring(1)),
  }));
}

function encodePoint(p: Point): string {
  return `${p.x}:${p.y}`;
}

function decodePoint(p: string): Point {
  const [x, y] = p.split(':').map(Number);
  return { x, y };
}

function getPathTrail(path: string): Map<string, number> {
  let currentPoint: Point = { x: 0, y: 0 };
  let stepsTaken = 0;
  return parsePath(path).reduce(
    (trail: Map<string, number>, { direction, distance }: Subpath) => {
      for (let offset = 0; offset < distance; offset++) {
        stepsTaken++;
        const nextPoint = nextPointLookup[direction](currentPoint);
        const encodedPoint = encodePoint(nextPoint);
        if (!trail.has(encodedPoint)) {
          trail.set(encodedPoint, stepsTaken);
        }
        currentPoint = nextPoint;
      }
      return trail;
    },
    new Map<string, number>()
  );
}

function findIntersections(
  firstTrail: Map<string, number>,
  secondTrail: Map<string, number>
): string[] {
  let intersections: string[] = [];
  Array.from(firstTrail.keys()).forEach(v1 => {
    if (secondTrail.has(v1)) {
      intersections.push(v1);
    }
  });
  return intersections;
}

function readInput() {
  const paths = input.readLines({ day: 3 });
  const [firstTrail, secondTrail] = paths.map(getPathTrail);
  const intersections = findIntersections(firstTrail, secondTrail);
  return { intersections, firstTrail, secondTrail };
}

export function partOne() {
  const { intersections } = readInput();
  return intersections.reduce((closestDistance, intersection) => {
    const intersectionDistance = manhattanDistance(decodePoint(intersection));
    if (intersectionDistance < closestDistance) {
      return intersectionDistance;
    }
    return closestDistance;
  }, Number.MAX_SAFE_INTEGER);
}

export function partTwo() {
  const { intersections, firstTrail, secondTrail } = readInput();
  return intersections.reduce((leastStepsTaken, intersection) => {
    const numStepsFirstPath = firstTrail.get(intersection) || 0;
    const numStepsSecondPath = secondTrail.get(intersection) || 0;
    const numStepsTaken = numStepsFirstPath + numStepsSecondPath;

    if (numStepsTaken < leastStepsTaken) {
      return numStepsTaken;
    }

    return leastStepsTaken;
  }, Number.MAX_SAFE_INTEGER);
}
