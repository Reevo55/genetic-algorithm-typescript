import BeeOptimization from '../src/BOA.js';
import { IProblemSettings } from '../src/Population.js';
import { getDatasetToElements, readDataset } from '../src/utils/fileReader.js';

const numBees = 20;
const numEliteBees = 10;
const numOnlookerBees = 5;
const numScoutBees = 5;
const maxIterations = 100;

interface IBenchmark {
  problemSettings: IProblemSettings;
  expected: number[];
}

async function populateBenchmarks(howMany: number): Promise<IBenchmark[]> {
  const benchmarks = [];
  for (let i = 0; i < howMany; i++) {
    const dataset = await readDataset(i);

    const elements = getDatasetToElements(dataset);

    const benchmark = {
      problemSettings: {
        maxWeightCapacity: dataset.capacity,
        elements: elements,
      },
      expected: dataset.solution,
    };

    benchmarks.push(benchmark);
  }

  return benchmarks;
}

const howMany = 6;

describe('Benchmarks for BOA', () => {
  let benchmarks: IBenchmark[];
  let boa: BeeOptimization;

  beforeEach(async () => {
    benchmarks = await populateBenchmarks(howMany);
  });

  it('should solve benchmark 0', () => {
    const benchmark = benchmarks[0];
    const { problemSettings, expected } = benchmark;

    boa = new BeeOptimization(
      problemSettings.elements,
      problemSettings.maxWeightCapacity,
      numBees,
      numEliteBees,
      numOnlookerBees,
      numScoutBees,
      maxIterations,
    );

    const solution = boa.optimize();

    expect(solution).toEqual(expected);
  });

  it('should solve benchmarks', () => {
    for (let i = 0; i < howMany; i++) {
      const benchmark = benchmarks[i];
      const { problemSettings, expected } = benchmark;

      boa = new BeeOptimization(
        problemSettings.elements,
        problemSettings.maxWeightCapacity,
        numBees,
        numEliteBees,
        numOnlookerBees,
        numScoutBees,
        maxIterations,
      );

      const solution = boa.optimize();

      console.log('solution: ', solution);
      console.log('expected: ', expected);

      expect(solution).toEqual(expected);
    }
  });
});
