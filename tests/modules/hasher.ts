import Hasher from "../../src/infra/modules/hasher";

class HasherMock implements Hasher {
  async hash(_plaintext: string): Promise<string> {
    return Promise.resolve("hashedValue");
  }

  async compare(_plaintext: string, _digest: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export default HasherMock;
