import { execSync } from 'child_process';

interface GitInfo<T> {
  rev: string | T;
  shortRev: string | T;
}

/**
 * Get information about the current git commit
 *
 * @param onError value to return when the actual one can't be retrieved
 */
export function getGitData<T = string>(onError = ''): GitInfo<T> {
  let rev: string | T;
  let shortRev: string | T;

  try {
    rev = execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    rev = onError;
  }
  try {
    shortRev = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    shortRev = onError;
  }

  return {
    rev,
    shortRev,
  };
}
