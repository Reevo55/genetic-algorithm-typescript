import { Genotype } from '../Genotype.js';
import { Population } from '../Population.js';

export interface ISelectionStrategy {
  select(population: Population): Genotype;
}

export class RouletteSelectionStrategy implements ISelectionStrategy {
  public select(population: Population): Genotype {
    const totalFitness = population.population.reduce(
      (prev, current) => prev + current.calculateFitness(),
      0,
    );

    let randomFitness = Math.random() * totalFitness;

    for (const genotype of population.population) {
      randomFitness -= genotype.calculateFitness();

      if (randomFitness < 0) {
        return genotype;
      }
    }

    return population.population[0];
  }
}
