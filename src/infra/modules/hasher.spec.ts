import Hasher, { Bcrypt } from "./hasher";

describe("Hasher", () => {
  let sut: Hasher;

  beforeEach(() => {
    sut = new Bcrypt();
  });

  it("should hash a plaintext password", async () => {
    const plaintext = "password123";
    const hashedPassword = await sut.hash(plaintext);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(plaintext);
  });

  it("should compare and return true for a match", async () => {
    const plaintext = "password123";
    const hashedPassword = await sut.hash(plaintext);

    const isMatch = await sut.compare(plaintext, hashedPassword);

    expect(isMatch).toBe(true);
  });

  it("should compare and return false for a mismatch", async () => {
    const plaintext = "password123";
    const incorrectPlaintext = "incorrectPassword";
    const hashedPassword = await sut.hash(plaintext);

    const isMatch = await sut.compare(incorrectPlaintext, hashedPassword);

    expect(isMatch).toBe(false);
  });
});
