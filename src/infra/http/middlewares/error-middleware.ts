import { NextFunction, Request, Response } from "express";

export class HTTPError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public object?: object,
  ) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = statusCode;
    this.object = object;
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HTTPError) {
    if (err.statusCode >= 500) {
      console.error(err);
    }
    if (err.object) {
      return res
        .status(err.statusCode)
        .send({ error: err.message, ...err.object });
    }

    return res.status(err.statusCode).send({ error: err.message });
  }

  console.error(err);
  return res.status(500).send({ error: "Internal Server Error" });
}
