import { createRandomElements } from '../src/IElement.js';

describe('Element tests', () => {
  it('should create random elements', () => {
    const maxValue = 15;
    const maxWeight = 15;
    const howMany = 10;
    const randomElements = createRandomElements(howMany, {
      maxValue,
      maxWeight,
    });

    expect(randomElements.length).toBe(howMany);

    randomElements.forEach((element) => {
      expect(element.value).toBeGreaterThanOrEqual(0);
      expect(element.value).toBeLessThanOrEqual(maxValue);
      expect(element.weight).toBeGreaterThanOrEqual(0);
      expect(element.weight).toBeLessThanOrEqual(maxWeight);
    });
  });
});
