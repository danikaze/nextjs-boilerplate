import { scrypt, scryptSync } from 'crypto';

const KEY_LEN = 64;

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
