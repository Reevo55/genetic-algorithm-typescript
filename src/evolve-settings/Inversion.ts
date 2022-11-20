import { Genotype } from '../Genotype.js';

export interface IInversionStrategy {
  invert(child: Genotype): Genotype;
}

export class RandomInversionStrategy implements IInversionStrategy {
  invert(child: Genotype): Genotype {
    const inversionPoint = Math.floor(Math.random() * child.genes.length);
    const inversionLength = Math.floor(
      Math.random() * (child.genes.length - inversionPoint),
    );

    const invertedGenes = child.genes
      .slice(inversionPoint, inversionPoint + inversionLength)
      .reverse();

    child.setGenes([
      ...child.genes.slice(0, inversionPoint),
      ...invertedGenes,
      ...child.genes.slice(inversionPoint + inversionLength),
    ]);

    return child;
  }
}
