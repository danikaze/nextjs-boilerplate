import 'jest';
import { setBuildTimeConstants } from '../set-build-time-constants';

describe('setBuildTimeConstants', () => {
  it('should load constants in runtime', () => {
    setBuildTimeConstants({
      type: 'server',
      dev: false,
      isServer: true,
    });

    expect(IS_PRODUCTION).toBe(true);
    expect(IS_SERVER).toBe(true);
    expect(IS_TEST).toBe(false);
  });

  it('should load constants in runtime with different options', () => {
    setBuildTimeConstants({
      type: 'client',
      dev: true,
      isServer: false,
      isTest: true,
    });

    expect(IS_PRODUCTION).toBe(false);
    expect(IS_SERVER).toBe(false);
    expect(IS_TEST).toBe(true);
  });
});
