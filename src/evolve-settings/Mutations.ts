import { Gene } from '../Genotype.js';
import { Population } from '../Population.js';

export interface IMutationStrategy {
  mutate(population: Population): void;
}

export class RandomMutationStrategy implements IMutationStrategy {
  public mutate(population: Population): void {
    population.population.forEach((genotype) => {
      genotype.genes.forEach((gene, index) => {
        if (Math.random() < population.populationSettings.mutationRate) {
          genotype.genes[index] = Math.round(Math.random()) as Gene;
        }
      });
    });
  }
}
