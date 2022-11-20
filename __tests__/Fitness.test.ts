import { BasicFitness } from '../src/evolve-settings/Fitness.js';
import { Genotype } from '../src/Genotype.js';

describe('fitness functions', () => {
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

  it('should test basic fitness strategy', () => {
    const fitness = new BasicFitness();
    genotype1.setGenes([1, 1, 0, 1, 0]);
    genotype1.settings.maxWeightCapacity = 11;

    const result = fitness.calculate(genotype1);

    expect(result).toEqual(29);
  });

  it('should test basic fitness strategy above weight', () => {
    const fitness = new BasicFitness();
    genotype1.setGenes([1, 1, 1, 1, 1]);
    genotype1.settings.maxWeightCapacity = 10;

    const result = fitness.calculate(genotype1);

    expect(result).toEqual(0);
  });
});
