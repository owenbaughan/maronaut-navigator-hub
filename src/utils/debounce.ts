
/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
