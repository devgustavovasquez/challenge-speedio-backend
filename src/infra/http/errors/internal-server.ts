import { HTTPError } from "../middlewares/error-middleware";

export class InternalServerError extends HTTPError {
  constructor(message: string, object?: object) {
    super(500, message, object);
    this.name = "InternalServer";
  }
}
