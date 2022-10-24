import { Genotype } from '../Genotype.js';
import { Population } from '../Population.js';

export interface ICrossoverStrategy {
  crossover(population: Population): void;
}

export class OnePointCrossoverStrategy implements ICrossoverStrategy {
  public crossover(population: Population): void {
    const newPopulation = population.population.slice();

    for (let i = 0; i < population.population.length; i += 2) {
      const parent1 = population.population[i];
      const parent2 = population.population[i + 1];

      const crossoverPoint = Math.floor(Math.random() * parent1.genes.length);

      const child1 = new Genotype(parent1.elements, {
        maxWeightCapacity: population.problemSettings.maxWeightCapacity,
      });

      const child2 = new Genotype(parent2.elements, {
        maxWeightCapacity: population.problemSettings.maxWeightCapacity,
      });

      child1.setGenes([
        ...parent1.genes.slice(0, crossoverPoint),
        ...parent2.genes.slice(crossoverPoint),
      ]);

      child2.setGenes([
        ...parent2.genes.slice(0, crossoverPoint),
        ...parent1.genes.slice(crossoverPoint),
      ]);

      newPopulation.push(child1, child2);
    }

    population.population = newPopulation;
  }
}
