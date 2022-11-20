import * as fs from 'fs/promises';
import { IElement } from '../IElement.js';

interface IDataset {
  capacity: number;
  profits: number[];
  solution: number[];
  weights: number[];
}

export async function readDataset(datasetNumber: number): Promise<IDataset> {
  const capacityFile = await fs.readFile(
    `data/dataset_${datasetNumber}/capacity.txt`,
    'utf8',
  );
  const profitsFile = await fs.readFile(
    `data/dataset_${datasetNumber}/profits.txt`,
    'utf8',
  );
  const solutionFile = await fs.readFile(
    `data/dataset_${datasetNumber}/solution.txt`,
    'utf8',
  );
  const weightsFile = await fs.readFile(
    `data/dataset_${datasetNumber}/weights.txt`,
    'utf8',
  );

  const capacity = parseInt(capacityFile);

  const solution = solutionFile
    .split('\r')
    .map((solution) => parseInt(solution));
  const profits = profitsFile.split('\r').map((profit) => parseInt(profit));
  const weights = weightsFile.split('\r').map((weight) => parseInt(weight));

  return { capacity, profits, solution, weights };
}

export function getDatasetToElements(dataset: IDataset): IElement[] {
  return dataset.profits.map((profit, index) => {
    return {
      value: profit,
      weight: dataset.weights[index],
    };
  });
}
