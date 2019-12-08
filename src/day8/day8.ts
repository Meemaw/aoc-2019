import * as input from '../utils/input';

type LayerMap = Record<string, number[][]>;

type Size = {
  width: number;
  height: number;
};

enum PixelValue {
  BLACK = 0,
  WHITE = 1,
  TRANSPARENT = 2,
}

function buildLayerMap({ width, height }: Size): LayerMap {
  const pixelsInLayer = width * height;
  const digits = String(input.readInput({ day: 8 }))
    .split('')
    .map(Number);

  return digits.reduce((acc: LayerMap, digit: number, index) => {
    const layer = Math.floor(index / pixelsInLayer);
    const row = Math.floor((index % pixelsInLayer) / width);
    if (!acc[layer]) {
      acc[layer] = Array.from(Array(height).keys()).map(_ => [] as number[]);
    }
    acc[layer][row].push(digit);
    return acc;
  }, {});
}

export function partOne(): number {
  const layerMap = buildLayerMap({ width: 25, height: 6 });

  const data = Object.keys(layerMap).reduce(
    (acc, layerName) => {
      const layer = layerMap[layerName];
      const numZeros = layer.reduce(
        (sum, row) => sum + row.filter(pixel => pixel === 0).length,
        0
      );

      const numOnes = layer.reduce(
        (sum, row) => sum + row.filter(pixel => pixel === 1).length,
        0
      );

      const numTwos = layer.reduce(
        (sum, row) => sum + row.filter(pixel => pixel === 2).length,
        0
      );

      if (numZeros < acc.numZeros) {
        return { numZeros, numOnes, numTwos, layerName };
      }
      return acc;
    },
    { numZeros: Number.MAX_SAFE_INTEGER, numOnes: 0, numTwos: 0 }
  );

  return data.numOnes * data.numTwos;
}

export function partTwo(): string {
  const width = 25;
  const height = 6;
  const outputMapImage = Array.from(Array(height).keys()).map(_ => {
    return Array.from(Array(width).keys()).map(_ => PixelValue.TRANSPARENT);
  });

  const layerMap = buildLayerMap({ width, height });

  Object.values(layerMap).forEach(layerImage => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const outputPixelValue = outputMapImage[y][x];
        const layerPixelValue = layerImage[y][x];
        if (outputPixelValue === PixelValue.TRANSPARENT) {
          outputMapImage[y][x] = layerPixelValue;
        }
      }
    }
  });

  return outputMapImage
    .map(row => {
      return row
        .map(pixel => {
          switch (pixel) {
            case PixelValue.WHITE:
              return 'X';
            default:
              return ' ';
          }
        })
        .join('');
    })
    .join('\n');
}
