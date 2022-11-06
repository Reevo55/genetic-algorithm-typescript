import { Genotype } from '../Genotype.js';

export interface FitnessStrategy {
  calculate(gene: Genotype): number;
}

export class BasicFitness implements FitnessStrategy {
  calculate(gene: Genotype): number {
    const weight = gene.calculateWeight();
    const value = gene.calculateValue();

    if (weight > gene.settings.maxWeightCapacity) {
      return 0; // Check different strategies, 0 and remove element, or remove most valuable element
    }

    return value;
  }
}
