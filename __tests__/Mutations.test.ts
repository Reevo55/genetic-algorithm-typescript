import {
  RandomMutationStrategy,
  RandomSwapMutationStrategy,
} from '../src/evolve-settings/Mutations.js';
import { Genotype } from '../src/Genotype.js';

describe('mutations functions', () => {
  let genotype1: Genotype;

  beforeEach(() => {
    const elements1 = [
      { value: 1, weight: 1 },
      { value: 6, weight: 2 },
      { value: 18, weight: 5 },
      { value: 22, weight: 6 },
      { value: 28, weight: 7 },
    ];

    genotype1 = new Genotype(elements1);
  });

  it('should test random mutation', () => {
    const mutation = new RandomMutationStrategy();

    genotype1.setGenes([1, 1, 0, 1, 0]);

    const afterMutationChild = mutation.mutate(genotype1);

    expect(afterMutationChild.genes.length).toEqual(5);
  });

  it('should test random swap mutation', () => {
    const mutation = new RandomSwapMutationStrategy();

    genotype1.setGenes([1, 1, 0, 1, 0]);

    const afterMutationChild = mutation.mutate(genotype1);

    expect(afterMutationChild.genes).toHaveLength(5);
  });
});
