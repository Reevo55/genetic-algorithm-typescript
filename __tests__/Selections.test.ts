import { BasicFitness } from '../src/evolve-settings/Fitness.js';
import { RouletteSelectionStrategy } from '../src/evolve-settings/Selections.js';
import {
  IPopulationSettings,
  IProblemSettings,
  Population,
} from '../src/Population.js';

describe('Population class', () => {
  const populationSettings: IPopulationSettings = {
    populationSize: 100,
    elitism: true,
    mutationRate: 0.01,
    crossoverRate: 0.9,
    inversionRate: 0.01,
    tournamentSize: 5,
  };

  const problemSettings: IProblemSettings = {
    maxWeightCapacity: 15,
    elements: [
      {
        value: 1,
        weight: 1,
      },
      {
        value: 2,
        weight: 2,
      },
    ],
  };

  let population: Population;

  beforeEach(() => {
    population = new Population(populationSettings, problemSettings);
    population.createRandomPopulation(new BasicFitness());
  });

  it('should select random genotype', () => {
    const selectionStrategy = new RouletteSelectionStrategy();
    const genotype = selectionStrategy.select(population);
    expect(genotype).toBeDefined();
  });
});
