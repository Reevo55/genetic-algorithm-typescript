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
  selectionStrategy: 'roulette' | 'tournament';
  crossoverStrategy: 'onePoint' | 'twoPoint' | 'uniform';
  mutationStrategy: 'random' | 'swap';
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

  public createRandomPopulation(): void {
    this.population = Array.from(
      { length: this.populationSettings.populationSize },
      () => {
        const genotype = new Genotype(this.problemSettings.elements, {
          maxWeightCapacity: this.problemSettings.maxWeightCapacity,
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

  public evolve(settings: IEvolveSettings): void {
    this.generations = [];
    this.numberOfGenerations = 0;
    this.finished = false;

    this.createRandomPopulation();

    while (!this.finished) {
      this.numberOfGenerations++;
    }
  }
}
