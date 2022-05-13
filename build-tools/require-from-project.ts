import { join } from 'path';

/**
 * Wrapper for requiring a file in runtime, with a route relative to the
 * project root, since it changes when it's running on source typescript code
 * (on dev, with ts-node) or pure javascript built code (from the `dist`
 * folder)
 *
 * @param filePath path of the file to require relative to the project root
 * @param onNotFound value to return if the file is not found instead of
 * throwing an error
 */
export function requireFromProject<T = never>(
  filePath: string,
  onNotFound?: T
) {
  const relativeRoutes = ['..', '../..'];
  for (const rel of relativeRoutes) {
    try {
      const path = join(__dirname, rel, filePath);
      return require(path);
    } catch (e) {}
  }

  if (onNotFound !== undefined) return onNotFound;
  throw new Error(`Can't found ${filePath}`);
}
