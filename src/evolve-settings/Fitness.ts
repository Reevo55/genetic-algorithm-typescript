import { Genotype } from '../Genotype.js';

export interface IFitnessStrategy {
  calculate(gene: Genotype): number;
}

export class BasicFitness implements IFitnessStrategy {
  calculate(gene: Genotype): number {
    const weight = gene.calculateWeight();
    const value = gene.calculateValue();

    if (weight > gene.settings.maxWeightCapacity) {
      return 0; // Check different strategies, 0 and remove element, or remove most valuable element
    }

    return value;
  }
}

export class LeftoverGenesMutateFitness implements IFitnessStrategy {
  calculate(gene: Genotype): number {
    const maxWeight = gene.settings.maxWeightCapacity;
    let sumOfValues = 0;
    let sumOfWeights = 0;

    for (let i = 0; i < gene.genes.length; i++) {
      const geneWeight = gene.elements[i].weight * gene.genes[i];
      const geneValue = gene.elements[i].value * gene.genes[i];

      if (sumOfWeights + geneWeight <= maxWeight) {
        sumOfWeights += geneWeight;
        sumOfValues += geneValue;
      } else {
        gene.genes[i] = 0;
      }
    }

    return sumOfValues;
  }
}
