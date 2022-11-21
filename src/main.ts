import {
  OnePointCrossoverStrategy,
  TwoPointCrossoverStrategy,
} from './evolve-settings/Crossovers.js';
import {
  BasicFitness,
  IFitnessStrategy,
  LeftoverGenesMutateFitness,
} from './evolve-settings/Fitness.js';
import { RandomInversionStrategy } from './evolve-settings/Inversion.js';
import {
  RandomMutationStrategy,
  RandomSwapMutationStrategy,
} from './evolve-settings/Mutations.js';
import {
  RouletteSelectionStrategy,
  TournamentSelectionStrategy,
} from './evolve-settings/Selections.js';
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
  crossoverRate: 0.01,
  inversionRate: 0.01,
  tournamentSize: 5,
};

const globalEvolveSettings: IEvolveSettings = {
  selection: new RouletteSelectionStrategy(),
  crossover: new OnePointCrossoverStrategy(),
  mutation: new RandomMutationStrategy(),
  fitness: new BasicFitness(),
  inversion: new RandomInversionStrategy(),
  maxGenerations: 50,
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

async function researchEvolveAttribute(
  attributes,
  attributeName,
  problemSettings,
  howManyTimes,
) {
  const results = [];

  attributes.forEach((value) => {
    const { averageTime, averageFitness, averageCapacity } =
      averageFromEvolvePopulationNtimes(howManyTimes, {
        populationSettings: globalPopulationSettings,
        problemSettings: problemSettings,
        evolveSettings: {
          ...globalEvolveSettings,
          [attributeName]: value,
        },
        fitnessStrategy: new BasicFitness(),
      });

    results.push({
      [attributeName]: value,
      averageTime,
      averageFitness,
      averageCapacity,
    });
  });

  return results;
}

async function researchPopulationAttribute(
  attributes,
  attributeName,
  problemSettings,
  howManyTimes,
) {
  const results = [];

  attributes.forEach((value) => {
    const populationSettings: IPopulationSettings = {
      ...globalPopulationSettings,
      [attributeName]: value,
    };

    const { averageTime, averageFitness, averageCapacity } =
      averageFromEvolvePopulationNtimes(howManyTimes, {
        populationSettings: populationSettings,
        problemSettings: problemSettings,
        evolveSettings: globalEvolveSettings,
        fitnessStrategy: new BasicFitness(),
      });

    results.push({
      [attributeName]: value,
      averageTime,
      averageFitness,
      averageCapacity,
    });
  });

  return results;
}

async function main(): Promise<void> {
  const maxGenerations = [10, 50, 100, 200, 500];
  const populationSizes = [10, 50, 100, 200, 500];
  const mutationRates = [0.01, 0.05, 0.1, 0.2, 0.5];
  const crossoverRates = [0.01, 0.05, 0.1, 0.2, 0.5];
  const inversionRates = [0.01, 0.05, 0.1, 0.2, 0.5];
  const elitism = [true, false];

  const problemSettings = await getBenchmark(5);
  const howManyTimes = 5;

  const generationsResults = await researchEvolveAttribute(
    maxGenerations,
    'maxGenerations',
    problemSettings,
    howManyTimes,
  );

  const populationResults = await researchPopulationAttribute(
    populationSizes,
    'populationSize',
    problemSettings,
    howManyTimes,
  );

  const mutationResults = await researchPopulationAttribute(
    mutationRates,
    'mutationRate',
    problemSettings,
    howManyTimes,
  );

  const crossoverResults = await researchPopulationAttribute(
    crossoverRates,
    'crossoverRate',
    problemSettings,
    howManyTimes,
  );

  const inversionResults = await researchPopulationAttribute(
    inversionRates,
    'inversionRate',
    problemSettings,
    howManyTimes,
  );

  const elitismResults = await researchPopulationAttribute(
    elitism,
    'elitism',
    problemSettings,
    howManyTimes,
  );

  const fitnessStrategies = [
    new BasicFitness(),
    new LeftoverGenesMutateFitness(),
  ];

  const crossoverStrategies = [
    new OnePointCrossoverStrategy(),
    new TwoPointCrossoverStrategy(),
  ];

  const mutationStrategies = [
    new RandomMutationStrategy(),
    new RandomSwapMutationStrategy(),
  ];

  const selectionStrategies = [
    new RouletteSelectionStrategy(),
    new TournamentSelectionStrategy(),
  ];

  const fitnessResults = await researchEvolveAttribute(
    fitnessStrategies,
    'fitness',
    problemSettings,
    howManyTimes,
  );

  const crossoverStrategyResults = await researchEvolveAttribute(
    crossoverStrategies,
    'crossover',
    problemSettings,
    howManyTimes,
  );

  const mutationStrategyResults = await researchEvolveAttribute(
    mutationStrategies,
    'mutation',
    problemSettings,
    howManyTimes,
  );

  const selectionResults = await researchEvolveAttribute(
    selectionStrategies,
    'selection',
    problemSettings,
    howManyTimes,
  );

  console.log('==== POULATION RESULTS =====');
  console.table(populationResults);

  console.log('==== GENERATIONS RESULTS =====');
  console.table(generationsResults);

  console.log('==== MUTATIONS RESULTS =====');
  console.table(mutationResults);

  console.log('==== CROSSOVER RESULTS =====');
  console.table(crossoverResults);

  console.log('==== INVERSION RESULTS =====');
  console.table(inversionResults);

  console.log('==== ELITISM RESULTS =====');
  console.table(elitismResults);

  console.log('==== FITNESS RESULTS =====');
  console.table(fitnessResults);

  console.log('==== CROSSOVER RESULTS =====');
  console.table(crossoverStrategyResults);

  console.log('==== MUTATION RESULTS =====');
  console.table(mutationStrategyResults);

  console.log('==== SELECTION RESULTS =====');
  console.table(selectionResults);
}

main();
