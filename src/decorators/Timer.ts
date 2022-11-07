/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export function createTimestamps(message: string) {
  return (_target: any, _name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    const startTime = new Date(Date.now());
    console.log(`${message} started at: ${startTime.toLocaleString('pl-PL')}`);

    descriptor.value = function (...innerArgs: any) {
      const result = originalMethod.apply(this, innerArgs);

      return result;
    };

    const endTime = new Date(Date.now());
    console.log(`${message} completed at: ${endTime.toLocaleString('pl-PL')}`);
    console.log(
      `${message} took ${
        endTime.getTime() - startTime.getTime()
      }ms to complete.`,
    );
  };
}
