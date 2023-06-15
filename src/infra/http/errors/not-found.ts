import { HTTPError } from "../middlewares/error-middleware";

export class NotFoundError extends HTTPError {
  constructor(message: string, object?: object) {
    super(404, message, object);
    this.name = "NotFound";
  }
}
