import path from 'path';
import fs from 'fs/promises';
import { IElement } from '../IElement.js';

interface IDataset {
  capacity: number;
  profits: number[];
  solution: number;
  weights: number[];
}

async function datasetReader(datasetNumber: number): Promise<IDataset> {
  const projectRoot = await getProjectRoot();

  const capacityFile = await fs.readFile(
    `${projectRoot}/data/dataset_${datasetNumber}/capacity.txt`,
    'utf8',
  );
  const profitsFile = await fs.readFile(
    `${projectRoot}/data/dataset_${datasetNumber}/profits.txt`,
    'utf8',
  );
  const solutionFile = await fs.readFile(
    `${projectRoot}/data/dataset_${datasetNumber}/solution.txt`,
    'utf8',
  );
  const weightsFile = await fs.readFile(
    `${projectRoot}/data/dataset_${datasetNumber}/weights.txt`,
    'utf8',
  );

  const capacity = parseInt(capacityFile);
  const solution = parseInt(solutionFile);

  const profits = profitsFile.split('\r').map((profit) => parseInt(profit));
  const weights = weightsFile.split('\r').map((weight) => parseInt(weight));

  return { capacity, profits, solution, weights };
}

async function getProjectRoot(): Promise<string> {
  const currentPath = await fs.realpath(process.cwd());
  const projectRoot = path.resolve(currentPath, '../../..');
  return projectRoot;
}

export function datasetToElements(dataset: IDataset): IElement[] {
  return dataset.profits.map((profit, index) => {
    return {
      value: profit,
      weight: dataset.weights[index],
    };
  });
}

const dataset = await datasetReader(1);
console.log(dataset);
