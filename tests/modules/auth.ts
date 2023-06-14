import Auth from "../../src/infra/modules/auth";

export default class MockAuth implements Auth {
  generateToken(_payload: string | object, _options?: object): string {
    return "mockedToken";
  }

  verifyToken(token: string): boolean {
    if (token === "validToken") {
      return true;
    } else {
      return false;
    }
  }
}
