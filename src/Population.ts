import { performance } from 'perf_hooks';
import { createTimestamps } from './decorators/Timer.js';
import { ICrossoverStrategy } from './evolve-settings/Crossovers.js';
import { IFitnessStrategy } from './evolve-settings/Fitness.js';
import { IInversionStrategy } from './evolve-settings/Inversion.js';
import { IMutationStrategy } from './evolve-settings/Mutations.js';
import { ISelectionStrategy } from './evolve-settings/Selections.js';
import { Genotype } from './Genotype.js';
import { IElement } from './IElement.js';

export interface IPopulationSettings {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  inversionRate: number;
  elitism: boolean;
  tournamentSize: number;
}

export interface IProblemSettings {
  maxWeightCapacity: number;
  elements: IElement[];
}
export interface IEvolveSettings {
  selection: ISelectionStrategy;
  crossover: ICrossoverStrategy;
  mutation: IMutationStrategy;
  fitness: IFitnessStrategy;
  inversion: IInversionStrategy;
  maxGenerations?: number;
}

export class Population {
  population: Genotype[];
  generations: Genotype[][];
  populationSettings: IPopulationSettings;
  problemSettings: IProblemSettings;

  numberOfGenerations = 0;
  finished: false;

  constructor(
    populationSettings: IPopulationSettings,
    problemSettings: IProblemSettings,
  ) {
    this.populationSettings = populationSettings;
    this.problemSettings = problemSettings;
  }

  public createRandomPopulation(fitnessStrategy: IFitnessStrategy): void {
    this.population = Array.from(
      { length: this.populationSettings.populationSize },
      () => {
        const genotype = new Genotype(this.problemSettings.elements, {
          maxWeightCapacity: this.problemSettings.maxWeightCapacity,
          fitnessStrategy: fitnessStrategy,
        });

        genotype.createRandomGenes();
        return genotype;
      },
    );
  }

  public getFittest(): Genotype {
    return this.population.reduce((prev, current) =>
      prev.calculateFitness() > current.calculateFitness() ? prev : current,
    );
  }

  @createTimestamps('Evolve function')
  public evolve(settings: IEvolveSettings): {
    fittest: Genotype;
    time: number;
  } {
    const start = performance.now();

    const { selection, crossover, mutation } = settings;
    this.generations = [];
    this.numberOfGenerations = 0;
    this.finished = false;

    this.createRandomPopulation(settings.fitness);

    const MAX_GENERATIONS = settings.maxGenerations || 1000;

    while (!this.finished && this.numberOfGenerations < MAX_GENERATIONS) {
      this.numberOfGenerations++;

      this.generations.push(this.population);

      const newPopulation: Genotype[] = [];

      if (this.populationSettings.elitism) {
        newPopulation.push(this.getFittest());
      }

      while (newPopulation.length < this.populationSettings.populationSize) {
        const parent1 = selection.select(this);
        const parent2 = selection.select(this);

        let [child1, child2] = crossover.crossover(parent1, parent2);

        if (Math.random() < this.populationSettings.mutationRate) {
          child1 = mutation.mutate(child1);
          child2 = mutation.mutate(child2);
        }

        if (Math.random() < this.populationSettings.inversionRate) {
          child1 = settings.inversion.invert(child1);
          child2 = settings.inversion.invert(child2);
        }

        newPopulation.push(child1);
        newPopulation.push(child2);
      }

      this.population = newPopulation;
    }

    const fittest = this.getFittest();

    const end = performance.now();

    const time = end - start;

    return { fittest, time };
  }
}
