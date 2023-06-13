import { hash, compare } from "bcrypt";

export default interface Hasher {
  hash(plaintext: string): Promise<string>;
  compare(plaintext: string, digest: string): Promise<boolean>;
}

export class Bcrypt implements Hasher {
  private readonly salt: number;

  constructor() {
    this.salt = 10;
  }

  async hash(plaintext: string): Promise<string> {
    return hash(plaintext, this.salt);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return compare(plaintext, digest);
  }
}
