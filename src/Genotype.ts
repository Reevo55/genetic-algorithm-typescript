import { BasicFitness, FitnessStrategy } from './evolve-settings/Fitness.js';
import { IElement } from './IElement.js';

export type Gene = 0 | 1;

export interface ISettings {
  maxWeightCapacity: number;
  fitnessStrategy: FitnessStrategy;
}

export class Genotype {
  genes: Gene[];
  elements: IElement[];
  settings: ISettings = {
    maxWeightCapacity: 10,
    fitnessStrategy: new BasicFitness(),
  };

  constructor(elements: IElement[], settings?: ISettings) {
    this.elements = elements;

    if (settings) {
      this.settings = settings;
    }
  }

  public calculateFitness(): number {
    return this.settings.fitnessStrategy.calculate(this);
  }

  public createRandomGenes(): void {
    this.genes = this.elements.map(() => Math.round(Math.random()) as Gene);
  }

  public calculateWeight(): number {
    return this.elements.reduce((acc, element, index) => {
      return acc + element.weight * this.genes[index];
    }, 0);
  }

  public calculateValue(): number {
    return this.elements.reduce((acc, element, index) => {
      return acc + element.value * this.genes[index];
    }, 0);
  }

  public setGenes(genes: Gene[]): void {
    this.genes = genes;
  }
}
