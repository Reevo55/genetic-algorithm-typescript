import { Genotype } from '../src/Genotype.js';
import { createRandomElements } from '../src/IElement.js';

describe('Genotype class', () => {
  const maxValue = 15;
  const maxWeight = 15;
  const howMany = 10;

  const randomElements = createRandomElements(howMany, {
    maxValue,
    maxWeight,
  });
  let genotype: Genotype;

  beforeEach(() => {
    genotype = new Genotype(randomElements);
  });

  it('should be defined', () => {
    expect(genotype).toBeDefined();
  });

  it('should create random genotype', () => {
    genotype.createRandomGenes();
    expect(genotype.genes.length).toBe(howMany);
    genotype.genes.forEach((gene) => {
      expect(gene).toBeGreaterThanOrEqual(0);
      expect(gene).toBeLessThanOrEqual(1);
    });
  });

  it('should calculate weight and value', () => {
    const elements = [
      {
        value: 1,
        weight: 1,
      },
      {
        value: 2,
        weight: 2,
      },
      {
        value: 3,
        weight: 3,
      },
    ];
    genotype = new Genotype(elements);
    genotype.setGenes([0, 1, 1]);

    const weight = genotype.calculateWeight();
    expect(weight).toBeGreaterThanOrEqual(5);

    const value = genotype.calculateValue();
    expect(value).toBeGreaterThanOrEqual(5);
  });

  it('should calculate fitness', () => {
    const elements = [
      {
        value: 1,
        weight: 1,
      },
      {
        value: 2,
        weight: 2,
      },
      {
        value: 3,
        weight: 3,
      },
    ];
    genotype = new Genotype(elements);
    genotype.setGenes([0, 1, 1]);

    const fitness = genotype.calculateFitness();
    expect(fitness).toBe(5);
  });

  it('should calculate fitness and return 0 if above', () => {
    const elements = [
      {
        value: 1,
        weight: 1,
      },
      {
        value: 2,
        weight: 100,
      },
      {
        value: 3,
        weight: 3,
      },
    ];
    genotype = new Genotype(elements);
    genotype.setGenes([0, 1, 1]);

    const fitness = genotype.calculateFitness();
    expect(fitness).toBe(0);
  });
});
