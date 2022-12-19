import { performance } from 'perf_hooks';
import { IElement } from './IElement.js';

export default class BeeOptimization {
  private items: IElement[];
  private maxWeight: number;
  private numBees: number;
  private numEliteBees: number;
  private numOnlookerBees: number;
  private numScoutBees: number;
  private maxIterations: number;
  private currentIteration: number;
  private bestSolution: number[];
  private bestFitness: number;
  private elitism: boolean;

  constructor(
    items: IElement[],
    maxWeight: number,
    numBees: number,
    numEliteBees: number,
    numOnlookerBees: number,
    numScoutBees: number,
    maxIterations: number,
    elistism: boolean = true,
  ) {
    this.items = items;
    this.maxWeight = maxWeight;
    this.numBees = numBees;
    this.numEliteBees = numEliteBees;
    this.numOnlookerBees = numOnlookerBees;
    this.numScoutBees = numScoutBees;
    this.maxIterations = maxIterations;
    this.currentIteration = 0;
    this.bestSolution = new Array(items.length).fill(0);
    this.bestFitness = 0;
    this.elitism = elistism;
  }

  public calculateFitness(solution: number[]): number {
    let fitness = 0;
    let weight = 0;
    for (let i = 0; i < solution.length; i++) {
      fitness += solution[i] * this.items[i].value;
      weight += solution[i] * this.items[i].weight;
      if (weight > this.maxWeight) {
        return -1;
      }
    }
    return fitness;
  }

  public calculateWeight(solution: number[]): number {
    let weight = 0;
    for (let i = 0; i < solution.length; i++) {
      weight += solution[i] * this.items[i].weight;
    }
    return weight;
  }

  private generateRandomSolution(): number[] {
    const solution = new Array(this.items.length).fill(0);
    for (let i = 0; i < solution.length; i++) {
      solution[i] = Math.round(Math.random());
    }
    return solution;
  }

  private generateNeighbor(solution: number[]): number[] {
    const neighbor = solution.slice();
    const randIndex = Math.floor(Math.random() * solution.length);
    neighbor[randIndex] = 1 - neighbor[randIndex];
    return neighbor;
  }

  private selectNeighbor(solution: number[], neighbor: number[]): number[] {
    const fitness = this.calculateFitness(solution);
    const neighborFitness = this.calculateFitness(neighbor);
    if (
      neighborFitness > fitness ||
      (neighborFitness === fitness && Math.random() < 0.5)
    ) {
      return neighbor;
    } else {
      return solution;
    }
  }

  private generateScout(): number[] {
    return this.generateRandomSolution();
  }

  private updateBestSolution(solution: number[], fitness: number): void {
    if (fitness > this.bestFitness) {
      this.bestFitness = fitness;
      this.bestSolution = solution;
    }
  }

  private runIteration(): void {
    // Elitarne pszczółki, które sprawdzają czy w sąsiedztwie są lepsze rozwiązania

    if (this.elitism) {
      for (let i = 0; i < this.numEliteBees; i++) {
        const neighbor = this.generateNeighbor(this.bestSolution);
        const chosen = this.selectNeighbor(this.bestSolution, neighbor);
        this.updateBestSolution(chosen, this.calculateFitness(chosen));
      }
    }

    // Patrzące pszczeółki, generowane są randomowe rozwiązania i wybierane jest najlepsze
    // z nich, a następnie sprawdzane są sąsiedztwa tego rozwiązania
    // szansa wyboru jest proporcjonalna do fitnessu
    // i jeszcze sprawdzam z sąsiedztwem czy nie ma lepszego rozwiązania
    const probabilites = new Array(this.numBees).fill(0);
    for (let i = 0; i < this.numOnlookerBees; i++) {
      let totalFitness = 0;
      const solutions = new Array(this.numBees)
        .fill(0)
        .map(() => this.generateRandomSolution());
      const fitnesses = solutions.map((solution) =>
        this.calculateFitness(solution),
      );
      for (const fitness of fitnesses) {
        totalFitness += fitness;
      }
      for (let j = 0; j < probabilites.length; j++) {
        probabilites[j] = fitnesses[j] / totalFitness;
      }
      let chosenIndex = 0;
      let rand = Math.random();
      while (rand > 0) {
        rand -= probabilites[chosenIndex];
        chosenIndex++;
      }
      chosenIndex--;
      const chosenSolution = solutions[chosenIndex];
      const neighbor = this.generateNeighbor(chosenSolution);
      const chosen = this.selectNeighbor(chosenSolution, neighbor);
      this.updateBestSolution(chosen, this.calculateFitness(chosen));
    }

    // Skauci, generują nowe rozwiązania i sprawdzają czy są lepsze od najlepszego
    for (let i = 0; i < this.numScoutBees; i++) {
      const scout = this.generateScout();
      const scoutFitness = this.calculateFitness(scout);
      if (scoutFitness > this.bestFitness) {
        this.updateBestSolution(scout, scoutFitness);
      }
    }
  }

  public optimize(): { solution: number[]; time: number } {
    const start = performance.now();
    while (this.currentIteration < this.maxIterations) {
      this.runIteration();
      this.currentIteration++;
    }
    const end = performance.now();

    const time = end - start;

    return { solution: this.bestSolution, time: time };
  }
}
