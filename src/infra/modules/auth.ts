import "dotenv/config";
import { SignOptions, sign, verify } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export default interface Auth {
  generateToken(payload: unknown, options?: SignOptions): string;
  verifyToken(token: string): boolean;
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
}
