import { Genotype } from '../Genotype.js';

export interface ICrossoverStrategy {
  crossover(parent1: Genotype, parent2: Genotype): [Genotype, Genotype];
}

export class OnePointCrossoverStrategy implements ICrossoverStrategy {
  public crossover(parent1: Genotype, parent2: Genotype): [Genotype, Genotype] {
    const crossoverPoint = Math.floor(Math.random() * parent1.genes.length);

    const child1 = new Genotype(parent1.elements, parent1.settings);

    const child2 = new Genotype(parent2.elements, parent2.settings);

    child1.setGenes([
      ...parent1.genes.slice(0, crossoverPoint),
      ...parent2.genes.slice(crossoverPoint),
    ]);

    child2.setGenes([
      ...parent2.genes.slice(0, crossoverPoint),
      ...parent1.genes.slice(crossoverPoint),
    ]);

    return [child1, child2];
  }
}
