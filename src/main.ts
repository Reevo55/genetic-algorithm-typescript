import { OnePointCrossoverStrategy } from './evolve-settings/Crossovers.js';
import { BasicFitness } from './evolve-settings/Fitness.js';
import { RandomMutationStrategy } from './evolve-settings/Mutations.js';
import { RouletteSelectionStrategy } from './evolve-settings/Selections.js';
import {
  IEvolveSettings,
  IPopulationSettings,
  IProblemSettings,
  Population,
} from './Population.js';

function main(): void {
  console.log('Main function');

  const populationSettings: IPopulationSettings = {
    populationSize: 200,
    elitism: true,
    mutationRate: 0.01,
    crossoverRate: 0.9,
    tournamentSize: 5,
  };

  const problemSettings: IProblemSettings = {
    maxWeightCapacity: 11,
    elements: [
      { name: 'A', weight: 1, value: 1 },
      { name: 'B', weight: 2, value: 6 },
      { name: 'C', weight: 5, value: 18 },
      { name: 'D', weight: 6, value: 22 },
      { name: 'E', weight: 7, value: 28 },
    ],
  };

  const population = new Population(populationSettings, problemSettings);

  population.createRandomPopulation(new BasicFitness());

  const evolveSettings: IEvolveSettings = {
    selection: new RouletteSelectionStrategy(),
    crossover: new OnePointCrossoverStrategy(),
    mutation: new RandomMutationStrategy(),
    fitness: new BasicFitness(),
    maxGenerations: 100,
  };

  population.evolve(evolveSettings);
}

main();
