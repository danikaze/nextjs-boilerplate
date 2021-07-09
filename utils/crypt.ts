import { scrypt, scryptSync } from 'crypto';

const KEY_LEN = 64;
const SALT_CHARSET =
  '1234567890!@#$%^&*()+=-_?~' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export async function encryptPassword(
  pass: string,
  salt: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    scrypt(pass, salt, KEY_LEN, (err, pwd) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(pwd.toString());
    });
  });
}

export function encryptPasswordSync(pass: string, salt: string): string {
  return scryptSync(pass, salt, KEY_LEN).toString();
}

export function generateSalt(size: number = 16): string {
  let salt = '';

  for (let i = 0; i < size; i++) {
    const c = Math.floor(Math.random() * SALT_CHARSET.length);
    salt += SALT_CHARSET[c];
  }

  return salt;
}
