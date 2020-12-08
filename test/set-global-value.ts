/*
 * The stack is a list of values that have been assigned to globalThis so
 * they can be restored in tests.
 * lower values in the array are older
 */
const stack: { [key: string]: unknown[] } = {};

/**
 * For testing purposes.
 * Change the value of a global variable saving its previous one so it can
 * be restored by using `restoreGlobalValue` or `resetAllGlobalValues`
 */
export function setGlobalValue(key: string, value: unknown): void {
  // tslint:disable: no-any
  if (!stack[key]) {
    stack[key] = [];
  }
  stack[key].push((globalThis as any)[key]);
  (globalThis as any)[key] = value;
}

/**
 * For testing purposes.
 * Restore the value of a global variable previously modified with
 * `setGlobalValue`
 */
export function restoreGlobalValue(key: string): void {
  // tslint:disable: no-any
  if (!stack[key] || stack[key].length === 0) return;
  (globalThis as any)[key] = stack[key].pop();
}

/**
 * For testing purposes.
 * Reset the values of all the global values modified by `setGlobalValue`.
 * Recommended to be run at the end of tests to leave a clean environment.
 */
export function resetAllGlobalValues(): void {
  // tslint:disable: no-any
  Object.entries(stack).forEach(([key, values]) => {
    if (!values || values.length === 0) return;
    (globalThis as any)[key] = values[0];
    stack[key] = [];
  });
}
