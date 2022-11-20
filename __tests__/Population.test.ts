import { BasicFitness } from '../src/evolve-settings/Fitness.js';
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
  });

  it('should create random population', () => {
    population.createRandomPopulation(new BasicFitness());

    expect(population.population.length).toBe(
      populationSettings.populationSize,
    );

    population.population.forEach((genotype) => {
      expect(genotype.genes.length).toBe(problemSettings.elements.length);
      genotype.genes.forEach((gene) => {
        expect(gene).toBeGreaterThanOrEqual(0);
        expect(gene).toBeLessThanOrEqual(1);
      });
    });
  });
});
