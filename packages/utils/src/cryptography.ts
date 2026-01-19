import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

import { Logger } from '@nestjs/common';

const IV_LENGTH = 16;

export class EncryptError extends Error {
  constructor(
    msg: string,
    readonly cause?: unknown,
  ) {
    super(msg);
  }
}

export class DecryptError extends Error {
  constructor(
    msg: string,
    readonly cause?: unknown,
  ) {
    super(msg);
  }
}

export class Cryptography {
  static readonly #logger: Logger = new Logger(this.constructor.name);

  /**
   * Generate random secure string
   * entropy will depend on length
   * e.g: length = 32 -> entropy would be around 4.16/6
   * @param length {number}
   * @returns {string}
   */
  static secureRandomString(length: number): string {
    return randomBytes(length).toString('base64url').substring(0, length).replace(/\W/g, '_');
  }

  /**
   * Encrypts the text using the algorithm and key provided
   * @param text the text to encrypt
   * @param algo the algorithm to use
   * @param key the key to use
   * @throws EncryptError
   */
  static encrypt(text: string, algo?: string, key?: string): string {
    try {
      const iv = randomBytes(IV_LENGTH);

      const algorithm = algo || (process.env['ENCRYPTION_ALGORITHM'] as string);
      const cipherKey = Buffer.from(key || (process.env['ENCRYPTION_KEY'] as string));

      const cipher = createCipheriv(algorithm, cipherKey, iv);

      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
      Cryptography.#logger.error(err);

      throw new EncryptError(`Unable to encrypt ${text} using ${algo}`, err);
    }
  }

  /**
   * Decrypts the text using the algorithm and key provided
   * @param text the text to decrypt
   * @param algo the algorithm to use
   * @param key the key to use
   * @throws DecryptError
   */
  static decrypt(text: string, algo?: string, key?: string): string {
    try {
      const textParts: string[] = text.split(':');

      const iv = Buffer.from(textParts.shift() as string, 'hex');
      const encrypted = Buffer.from(textParts.join(':'), 'hex');

      const algorithm = algo || (process.env['ENCRYPTION_ALGORITHM'] as string);
      const cipherKey = Buffer.from(key || (process.env['ENCRYPTION_KEY'] as string));
      const decipher = createDecipheriv(algorithm, cipherKey, iv);

      const decrypted = decipher.update(encrypted);
      return Buffer.concat([decrypted, decipher.final()]).toString();
    } catch (err) {
      Cryptography.#logger.error(err);

      throw new DecryptError(`Unable to decrypt ${text} using ${algo}`, err);
    }
  }

  /**
   * Hashes the text using sha256
   * @param text the text to hash
   * @param salt the salt to use
   */
  static hash(text: string, salt?: string): string {
    return createHash('sha256')
      .update(`${text}.${salt ?? process.env['ENCRYPTION_KEY']}`)
      .digest('hex');
  }

  /**
   * Hashes the text using MD5
   * @param text the text to hash
   * @param salt the salt to use
   */
  static hashMd5(text: string, salt?: string): string {
    return createHash('md5')
      .update(`${text}${salt ? `.${salt}` : ''}`)
      .digest('hex');
  }

  /**
   * Compares the text to the hashed value
   * @param text the text to compare
   * @param hashed the hashed value to compare against
   * @param salt the salt to use
   */
  static compare(text: string, hashed: string, salt?: string): boolean {
    return Cryptography.hash(text, salt ?? process.env['ENCRYPTION_KEY']) === hashed;
  }
}
