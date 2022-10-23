export interface IElement {
  value: number;
  weight: number;
}

export function createRandomElements(
  howMany: number,
  { maxWeight = 10, maxValue = 10 },
): IElement[] {
  const elements: IElement[] = [];

  for (let i = 0; i < howMany; i++) {
    elements.push({
      value: Math.round(Math.random() * maxValue),
      weight: Math.round(Math.random() * maxWeight),
    });
  }

  return elements;
}
