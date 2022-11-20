import { Genotype } from '../Genotype.js';

export interface IMutationStrategy {
  mutate(child: Genotype): Genotype;
}

export class RandomMutationStrategy implements IMutationStrategy {
  public mutate(child: Genotype): Genotype {
    const mutatedGenes = child.genes.map((gene) => {
      if (Math.random() < 0.1) {
        return gene === 0 ? 1 : 0;
      }

      return gene;
    });
    child.setGenes(mutatedGenes);

    return child;
  }
}
