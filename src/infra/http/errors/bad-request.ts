import { HTTPError } from "../middlewares/error-middleware";

export class BadRequestError extends HTTPError {
  constructor(message: string, object?: object) {
    super(400, message);
    this.name = "BadRequest";
    this.object = object;
  }
}
