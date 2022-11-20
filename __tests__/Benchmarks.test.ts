import { OnePointCrossoverStrategy } from '../src/evolve-settings/Crossovers.js';
import { BasicFitness } from '../src/evolve-settings/Fitness.js';
import { RandomInversionStrategy } from '../src/evolve-settings/Inversion.js';
import { RandomMutationStrategy } from '../src/evolve-settings/Mutations.js';
import { RouletteSelectionStrategy } from '../src/evolve-settings/Selections.js';
import { Gene } from '../src/Genotype.js';
import {
  IPopulationSettings,
  Population,
  IEvolveSettings,
  IProblemSettings,
} from '../src/Population.js';
import { getDatasetToElements, readDataset } from '../src/utils/fileReader.js';

interface IBenchmark {
  problemSettings: IProblemSettings;
  expected: Gene[];
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

const howMany = 8;

describe('Benchmarks', () => {
  const populationSettings: IPopulationSettings = {
    populationSize: 100,
    elitism: true,
    mutationRate: 0.01,
    crossoverRate: 0.9,
    inversionRate: 0.01,
    tournamentSize: 5,
  };

  const evolveSettings: IEvolveSettings = {
    selection: new RouletteSelectionStrategy(),
    crossover: new OnePointCrossoverStrategy(),
    mutation: new RandomMutationStrategy(),
    fitness: new BasicFitness(),
    inversion: new RandomInversionStrategy(),
    maxGenerations: 300,
  };

  it("should pass benchmark's test", async () => {
    const benchmarks = await populateBenchmarks(howMany);

    benchmarks.map(async (benchmark, index) => {
      const { problemSettings, expected } = benchmark;
      const population = new Population(populationSettings, problemSettings);
      population.createRandomPopulation(new BasicFitness());

      const { fittest } = population.evolve(evolveSettings);

      expect(fittest.genes).toStrictEqual(expected);
      console.log(`Benchmark ${index} successfull`);
    });
  });
});
