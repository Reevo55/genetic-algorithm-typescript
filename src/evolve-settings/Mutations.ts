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

export class RandomSwapMutationStrategy implements IMutationStrategy {
  public mutate(child: Genotype): Genotype {
    const swapPoint1 = Math.floor(Math.random() * child.genes.length);
    const swapPoint2 = Math.floor(Math.random() * child.genes.length);

    const swappedGenes = [...child.genes];
    const temp = swappedGenes[swapPoint1];

    swappedGenes[swapPoint1] = swappedGenes[swapPoint2];
    swappedGenes[swapPoint2] = temp;

    child.setGenes(swappedGenes);

    return child;
  }
}
