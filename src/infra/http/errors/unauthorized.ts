import { HTTPError } from "../middlewares/error-middleware";

export class UnauthorizedError extends HTTPError {
  constructor(message: string, object?: object) {
    super(401, message, object);
    this.name = "Unauthorized";
  }
}
