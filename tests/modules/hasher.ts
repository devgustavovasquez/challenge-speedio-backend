import Hasher from "../../src/infra/modules/hasher";

export default class HasherMock implements Hasher {
  async hash(_plaintext: string): Promise<string> {
    return Promise.resolve("hashedValue");
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    if (digest === "hashedPassword") {
      return Promise.resolve(plaintext === "correctPassword");
    } else {
      return Promise.resolve(false);
    }
  }
}
