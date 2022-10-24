import { Genotype } from '../Genotype.js';
import { Population } from '../Population.js';

export interface ISelectionStrategy {
  select(population: Population): Genotype[];
}

export class RouletteSelectionStrategy implements ISelectionStrategy {
  public select(population: Population): Genotype[] {
    const totalFitness = population.population.reduce(
      (prev, current) => prev + current.calculateFitness(),
      0,
    );

    const selection = Array.from(
      { length: population.population.length },
      () => {
        let randomFitness = Math.random() * totalFitness;
        let selectedGenotype: Genotype;

        population.population.forEach((genotype) => {
          randomFitness -= genotype.calculateFitness();
          if (randomFitness <= 0 && !selectedGenotype) {
            selectedGenotype = genotype;
          }
        });

        return selectedGenotype;
      },
    );

    return selection;
  }
}
