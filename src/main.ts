import { OnePointCrossoverStrategy } from './evolve-settings/Crossovers.js';
import { BasicFitness, IFitnessStrategy } from './evolve-settings/Fitness.js';
import { RandomInversionStrategy } from './evolve-settings/Inversion.js';
import { RandomMutationStrategy } from './evolve-settings/Mutations.js';
import { RouletteSelectionStrategy } from './evolve-settings/Selections.js';
import { Genotype } from './Genotype.js';
import {
  IEvolveSettings,
  IPopulationSettings,
  IProblemSettings,
  Population,
} from './Population.js';
import { readDataset, getDatasetToElements } from './utils/fileReader.js';

const globalPopulationSettings: IPopulationSettings = {
  populationSize: 200,
  elitism: true,
  mutationRate: 0.01,
  crossoverRate: 0.9,
  inversionRate: 0.01,
  tournamentSize: 5,
};

const globalEvolveSettings: IEvolveSettings = {
  selection: new RouletteSelectionStrategy(),
  crossover: new OnePointCrossoverStrategy(),
  mutation: new RandomMutationStrategy(),
  fitness: new BasicFitness(),
  inversion: new RandomInversionStrategy();
  maxGenerations: 100,
};

async function getBenchmark(datasetNumber: number): Promise<IProblemSettings> {
  const dataset = await readDataset(datasetNumber);
  const elements = getDatasetToElements(dataset);

  return {
    maxWeightCapacity: dataset.capacity,
    elements: elements,
  };
}

function averageFromEvolvePopulationNtimes(
  times: number,
  {
    populationSettings,
    problemSettings,
    evolveSettings,
    fitnessStrategy,
  }: {
    populationSettings: IPopulationSettings;
    problemSettings: IProblemSettings;
    evolveSettings: IEvolveSettings;
    fitnessStrategy: IFitnessStrategy;
  },
): { averageTime: number; averageFitness: number; averageCapacity: number } {
  let averageTime = 0;
  let averageFitness = 0;
  let averageCapacity = 0;

  for (let i = 0; i < times; i++) {
    console.log(`[${times}]: Evolve population ${i + 1} of ${times}`);
    const { time, fittest } = evolvePopulation({
      populationSettings,
      problemSettings,
      evolveSettings,
      fitnessStrategy,
    });

    averageTime += time;
    averageFitness += fittest.calculateValue();
    averageCapacity += fittest.calculateWeight();
  }

  return {
    averageTime: averageTime / times,
    averageFitness: averageFitness / times,
    averageCapacity: averageCapacity / times,
  };
}

function evolvePopulation({
  populationSettings,
  problemSettings,
  evolveSettings,
  fitnessStrategy,
}: {
  populationSettings: IPopulationSettings;
  problemSettings: IProblemSettings;
  evolveSettings: IEvolveSettings;
  fitnessStrategy: IFitnessStrategy;
}): { time: number; fittest: Genotype } {
  const population = new Population(populationSettings, problemSettings);

  population.createRandomPopulation(fitnessStrategy);

  const { time, fittest } = population.evolve(evolveSettings);

  return { time, fittest };
}

async function researchMaxGenerations(problemSettings, howManyTimes) {
  const maxGenerations = [10, 50, 100, 200, 500];
  const results = [];

  maxGenerations.forEach((maxGenerations) => {
    const { averageTime, averageFitness, averageCapacity } =
      averageFromEvolvePopulationNtimes(howManyTimes, {
        populationSettings: globalPopulationSettings,
        problemSettings: problemSettings,
        evolveSettings: {
          ...globalEvolveSettings,
          maxGenerations,
        },
        fitnessStrategy: new BasicFitness(),
      });

    results.push({
      maxGenerations,
      averageTime,
      averageFitness,
      averageCapacity,
    });
  });

  return results;
}

async function researchPopulationSize(problemSettings, howManyTimes) {
  const populationSizes = [10, 50, 100, 200, 500];
  const results = [];

  populationSizes.forEach((populationSize) => {
    const populationSettings: IPopulationSettings = {
      ...globalPopulationSettings,
      populationSize,
    };

    const { averageTime, averageFitness, averageCapacity } =
      averageFromEvolvePopulationNtimes(howManyTimes, {
        populationSettings: populationSettings,
        problemSettings: problemSettings,
        evolveSettings: globalEvolveSettings,
        fitnessStrategy: new BasicFitness(),
      });

    results.push({
      populationSize,
      averageTime,
      averageFitness,
      averageCapacity,
    });
  });

  return results;
}

async function main(): Promise<void> {
  const problemSettings = await getBenchmark(0);
  const howManyTimes = 5;

  const populationResults = await researchPopulationSize(
    problemSettings,
    howManyTimes,
  );

  console.table(populationResults);

  const generationsResults = await researchMaxGenerations(
    problemSettings,
    howManyTimes,
  );

  console.table(generationsResults);
}

main();
