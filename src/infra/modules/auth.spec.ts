import { Jwt } from "./auth";
import { sign } from "jsonwebtoken";

describe("JWT Token", () => {
  const jwtSecret = "your-jwt-secret";
  const sut = new Jwt();

  describe("generateToken", () => {
    it("should generate a valid token", () => {
      const payload = { userId: "123", role: "admin" };
      const expectedToken = sign(payload, jwtSecret);

      const generatedToken = sut.generateToken(payload);

      expect(generatedToken).toBe(expectedToken);
    });
  });

  describe("verifyToken", () => {
    it("should return true for a valid token", () => {
      const payload = { userId: "123", role: "admin" };
      const token = sign(payload, jwtSecret);

      const isValid = sut.verifyToken(token);

      expect(isValid).toBeTruthy();
    });

    it("should return false for an invalid token", () => {
      const invalidToken = "invalid-token";

      const isValid = sut.verifyToken(invalidToken);

      expect(isValid).toBeFalsy();
    });
  });
});
