import {
  OnePointCrossoverStrategy,
  TwoPointCrossoverStrategy,
} from '../src/evolve-settings/Crossovers.js';
import {
  BasicFitness,
  LeftoverGenesMutateFitness,
} from '../src/evolve-settings/Fitness.js';
import { RandomInversionStrategy } from '../src/evolve-settings/Inversion.js';
import {
  RandomMutationStrategy,
  RandomSwapMutationStrategy,
} from '../src/evolve-settings/Mutations.js';
import {
  RouletteSelectionStrategy,
  TournamentSelectionStrategy,
} from '../src/evolve-settings/Selections.js';
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

const howMany = 7;

describe('Benchmarks', () => {
  let populationSettings: IPopulationSettings;
  let evolveSettings: IEvolveSettings;
  let benchmarks: IBenchmark[];

  beforeEach(async () => {
    populationSettings = {
      populationSize: 300,
      elitism: true,
      mutationRate: 0.01,
      crossoverRate: 0.01,
      inversionRate: 0.01,
      tournamentSize: 10,
    };
    evolveSettings = {
      selection: new RouletteSelectionStrategy(),
      crossover: new OnePointCrossoverStrategy(),
      mutation: new RandomMutationStrategy(),
      fitness: new BasicFitness(),
      inversion: new RandomInversionStrategy(),
      maxGenerations: 50,
    };

    benchmarks = await populateBenchmarks(howMany);
  });

  it("should pass benchmark's test basic", async () => {
    benchmarks.map(async (benchmark, index) => {
      const { problemSettings, expected } = benchmark;

      const population = new Population(populationSettings, problemSettings);
      population.createRandomPopulation(new BasicFitness());

      const { fittest } = population.evolve(evolveSettings);

      expect(fittest.genes).toStrictEqual(expected);
      console.log(`Benchmark ${index} successfull`);
    });
  });

  it("should pass benchmark's fitness leftover", async () => {
    benchmarks.map(async (benchmark, index) => {
      const { problemSettings, expected } = benchmark;

      const population = new Population(populationSettings, problemSettings);
      population.createRandomPopulation(new LeftoverGenesMutateFitness());

      const { fittest } = population.evolve(evolveSettings);

      expect(fittest.genes).toStrictEqual(expected);
      console.log(`Benchmark ${index} successfull`);
    });
  });

  it('should pass benchmark with tournament, two point crossover and RandomSwapMutationStrategy', () => {
    const localEvolveSettings = {
      ...evolveSettings,
      selection: new TournamentSelectionStrategy(),
      mutation: new RandomSwapMutationStrategy(),
      crossover: new TwoPointCrossoverStrategy(),
      maxGenerations: 300,
    };

    benchmarks.map(async (benchmark, index) => {
      const { problemSettings, expected } = benchmark;

      const population = new Population(populationSettings, problemSettings);
      population.createRandomPopulation(new LeftoverGenesMutateFitness());

      const { fittest } = population.evolve(localEvolveSettings);

      expect(fittest.genes).toStrictEqual(expected);
      console.log(`Benchmark ${index} successfull`);
    });
  });
});
