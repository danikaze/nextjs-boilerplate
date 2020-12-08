import 'jest';
import { encryptPassword, encryptPasswordSync } from '../crypt';

const pass = 'password';
const salt = 'salt123';
const expected = '��R+��������V=VKR�����w+n��w*`�;��p�S�hUd���D�W��';

describe('encryptPassword', () => {
  it('should encrypt password asynchronously', async () => {
    const result = await encryptPassword(pass, salt);
    expect(result).toBe(expected);
  });

  it('should reject on wrong data', async () => {
    // tslint:disable-next-line:no-any
    expect(encryptPassword(null as any, salt)).rejects.toThrow();
  });
});

describe('encryptPasswordSync', () => {
  it('should encrypt password synchronously', async () => {
    const result = encryptPasswordSync(pass, salt);
    expect(result).toBe(expected);
  });

  it('should throw error on wrong data', async () => {
    // tslint:disable-next-line:no-any
    expect(() => encryptPasswordSync(null as any, salt)).toThrow();
  });
});
