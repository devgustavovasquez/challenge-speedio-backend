import "dotenv/config";
import { SignOptions, sign, verify } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export default interface Auth {
  generateToken(payload: unknown, options?: SignOptions): string;
  verifyToken(token: string): boolean;
  decodeToken<T>(token: string): T;
}

export class Jwt implements Auth {
  generateToken(payload: string | object, options?: SignOptions): string {
    return sign(payload, SECRET, options);
  }

  verifyToken(token: string): boolean {
    try {
      verify(token, SECRET, { ignoreExpiration: false });

      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken<T>(token: string): T {
    return verify(token, SECRET, { ignoreExpiration: false }) as T;
  }
}
