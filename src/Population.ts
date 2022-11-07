import { createTimestamps } from './decorators/Timer.js';
import { ICrossoverStrategy } from './evolve-settings/Crossovers.js';
import { IFitnessStrategy } from './evolve-settings/Fitness.js';
import { IMutationStrategy } from './evolve-settings/Mutations.js';
import { ISelectionStrategy } from './evolve-settings/Selections.js';
import { Genotype } from './Genotype.js';
import { IElement } from './IElement.js';

export interface IPopulationSettings {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
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
  public evolve(settings: IEvolveSettings): void {
    console.log('Evolve started...');
    console.log(settings);
    const { selection, crossover, mutation } = settings;
    this.generations = [];
    this.numberOfGenerations = 0;
    this.finished = false;

    this.createRandomPopulation(settings.fitness);

    const MAX_GENERATIONS = settings.maxGenerations || 1000;

    while (!this.finished && this.numberOfGenerations < MAX_GENERATIONS) {
      console.log(`Generation ${this.numberOfGenerations}`);
      this.numberOfGenerations++;

      this.generations.push(this.population);

      const newPopulation: Genotype[] = [];

      if (this.populationSettings.elitism) {
        newPopulation.push(this.getFittest());
      }

      while (newPopulation.length < this.populationSettings.populationSize) {
        console.log('Selecting parents...');
        const parent1 = selection.select(this);
        const parent2 = selection.select(this);

        console.log('Crossover...');
        let [child1, child2] = crossover.crossover(parent1, parent2);

        if (Math.random() < this.populationSettings.mutationRate) {
          console.log('Mutation...');
          child1 = mutation.mutate(child1);
          child2 = mutation.mutate(child2);
        } else {
          console.log('No mutation...');
        }

        console.log('Adding to new population...');
        newPopulation.push(child1);
        newPopulation.push(child2);
      }

      console.log('Replacing population...');
      console.log('New generation added');

      this.population = newPopulation;
    }

    console.log('Evolve finished');
    console.log('Best solution found:');
    const fittest = this.getFittest();
    console.log(this.getFittest());
    console.log(`Best solution value: ${fittest.calculateValue()}`);
    console.log(`Best solution weight: ${fittest.calculateWeight()}`);
  }
}
