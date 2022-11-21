import {
  OnePointCrossoverStrategy,
  TwoPointCrossoverStrategy,
} from '../src/evolve-settings/Crossovers.js';
import { Genotype } from '../src/Genotype.js';

describe('crossover functions', () => {
  let parent1: Genotype;
  let parent2: Genotype;

  beforeEach(() => {
    const elements1 = [
      { value: 1, weight: 1 },
      { value: 6, weight: 2 },
      { value: 18, weight: 5 },
      { value: 22, weight: 6 },
      { value: 28, weight: 7 },
    ];

    const elements2 = [
      { value: 1, weight: 1 },
      { value: 6, weight: 2 },
      { value: 18, weight: 5 },
      { value: 22, weight: 6 },
      { value: 28, weight: 7 },
    ];
    parent1 = new Genotype(elements1);
    parent2 = new Genotype(elements2);

    parent1.setGenes([1, 1, 0, 1, 0]);
    parent2.setGenes([0, 0, 1, 0, 1]);
  });

  it('should test one point crossover function', () => {
    const crossover = new OnePointCrossoverStrategy();

    Math.floor = jest.fn().mockReturnValue(2);

    const [child1Result, child2Result] = crossover.crossover(parent1, parent2);

    expect(child1Result.genes).toEqual([1, 1, 1, 0, 1]);
    expect(child2Result.genes).toEqual([0, 0, 0, 1, 0]);
  });

  it('should test two point crossover function', () => {
    const crossover = new TwoPointCrossoverStrategy();

    const [child1Result, child2Result] = crossover.crossover(parent1, parent2);

    expect(child1Result.genes).toHaveLength(5);
    expect(child2Result.genes).toHaveLength(5);
  });
});
