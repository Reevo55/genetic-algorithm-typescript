import BeeOptimization from './BOA.js';
import { TwoPointCrossoverStrategy } from './evolve-settings/Crossovers.js';
import {
  IFitnessStrategy,
  LeftoverGenesMutateFitness,
} from './evolve-settings/Fitness.js';
import { RandomInversionStrategy } from './evolve-settings/Inversion.js';
import { RandomMutationStrategy } from './evolve-settings/Mutations.js';
import { TournamentSelectionStrategy } from './evolve-settings/Selections.js';
import { Genotype } from './Genotype.js';
import {
  IEvolveSettings,
  IPopulationSettings,
  IProblemSettings,
  Population,
} from './Population.js';
import { readDataset, getDatasetToElements } from './utils/fileReader.js';

const globalPopulationSettings: IPopulationSettings = {
  populationSize: 50,
  elitism: true,
  mutationRate: 0.01,
  crossoverRate: 0.9,
  inversionRate: 0.01,
  tournamentSize: 5,
};

const globalEvolveSettings: IEvolveSettings = {
  selection: new TournamentSelectionStrategy(),
  crossover: new TwoPointCrossoverStrategy(),
  mutation: new RandomMutationStrategy(),
  fitness: new LeftoverGenesMutateFitness(),
  inversion: new RandomInversionStrategy(),
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

function researchGenetic(problemSettings, howManyTimes) {
  const { averageTime, averageFitness, averageCapacity } =
    averageFromEvolvePopulationNtimes(howManyTimes, {
      populationSettings: globalPopulationSettings,
      evolveSettings: globalEvolveSettings,
      problemSettings: problemSettings,
      fitnessStrategy: new LeftoverGenesMutateFitness(),
    });

  return { averageTime, averageFitness, averageCapacity };
}

function researchBoa(problemSettings, howManyTimes, boaOptions) {
  const { averageTime, averageFitness, averageCapacity } = avarageFromBoaNTimes(
    howManyTimes,
    problemSettings,
    boaOptions,
  );

  return { averageTime, averageFitness, averageCapacity };
}

function avarageFromBoaNTimes(
  times: number,
  problemSettings: IProblemSettings,
  boaOptions: any,
): { averageTime: number; averageFitness: number; averageCapacity: number } {
  let averageTime = 0;
  let averageFitness = 0;
  let averageCapacity = 0;

  const {
    numBees,
    numEliteBees,
    numOnlookerBees,
    numScoutBees,
    maxIterations,
    elitism,
  } = boaOptions;

  for (let i = 0; i < times; i++) {
    const boa = new BeeOptimization(
      problemSettings.elements,
      problemSettings.maxWeightCapacity,
      numBees,
      numEliteBees,
      numOnlookerBees,
      numScoutBees,
      maxIterations,
      elitism,
    );

    const { time, solution } = boa.optimize();

    averageTime += time;
    averageFitness += boa.calculateFitness(solution);
    averageCapacity += boa.calculateWeight(solution);
  }

  return {
    averageTime: averageTime / times,
    averageFitness: averageFitness / times,
    averageCapacity: averageCapacity / times,
  };
}

const runEveryBenchmark = async (boa_options) => {
  for (let i = 0; i < 8; i++) {
    const problemSettings = await getBenchmark(i);
    const howManyTimes = 10;

    const geneticResults = researchGenetic(problemSettings, howManyTimes);
    const boaResults = researchBoa(problemSettings, howManyTimes, boa_options);

    console.log('==== RESULTS =====');
    console.table({ BOA: boaResults, Genetic: geneticResults });
  }
};

const logDivider = (text) => {
  console.log(
    '================================================================================================================================',
  );
  console.log(
    `=====================================================           ${text}             ====================================================`,
  );
  console.log(
    '================================================================================================================================',
  );
};

async function main(): Promise<void> {
  logDivider('WITH ELITISM');

  globalPopulationSettings.populationSize = 10;
  const BOA_OPTIONS_SMALL = {
    numBees: 10,
    numEliteBees: 2,
    numOnlookerBees: 4,
    numScoutBees: 4,
    maxIterations: 100,
    elitism: true,
  };
  logDivider('SMALL');
  await runEveryBenchmark(BOA_OPTIONS_SMALL);

  const BOA_OPTIONS_MEDIUM = {
    numBees: 20,
    numEliteBees: 4,
    numOnlookerBees: 8,
    numScoutBees: 8,
    maxIterations: 100,
    elitism: true,
  };
  globalPopulationSettings.populationSize = 20;

  logDivider('MEDIUM');
  await runEveryBenchmark(BOA_OPTIONS_MEDIUM);

  const BOA_OPTIONS_LARGE = {
    numBees: 50,
    numEliteBees: 10,
    numOnlookerBees: 20,
    numScoutBees: 20,
    maxIterations: 100,
    elitism: true,
  };
  globalPopulationSettings.populationSize = 50;

  logDivider('LARGE');
  await runEveryBenchmark(BOA_OPTIONS_LARGE);

  logDivider('WITHOUT ELITISM');

  const BOA_OPTIONS_SMALL_WITHOUT_ELITISM = {
    numBees: 10,
    numEliteBees: 2,
    numOnlookerBees: 4,
    numScoutBees: 4,
    maxIterations: 100,
    elitism: false,
  };
  globalPopulationSettings.populationSize = 10;

  logDivider('SMALL');
  await runEveryBenchmark(BOA_OPTIONS_SMALL_WITHOUT_ELITISM);

  const BOA_OPTIONS_MEDIUM_WITHOUT_ELITISM = {
    numBees: 20,
    numEliteBees: 4,
    numOnlookerBees: 8,
    numScoutBees: 8,
    maxIterations: 100,
    elitism: false,
  };

  globalPopulationSettings.populationSize = 20;

  logDivider('MEDIUM');
  await runEveryBenchmark(BOA_OPTIONS_MEDIUM_WITHOUT_ELITISM);

  const BOA_OPTIONS_LARGE_WITHOUT_ELITISM = {
    numBees: 50,
    numEliteBees: 10,
    numOnlookerBees: 20,
    numScoutBees: 20,
    maxIterations: 100,
    elitism: false,
  };
  globalPopulationSettings.populationSize = 50;

  logDivider('LARGE');
  await runEveryBenchmark(BOA_OPTIONS_LARGE_WITHOUT_ELITISM);
}

await main();
