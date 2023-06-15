import { AnyZodObject, ZodError, z } from "zod";
import { Request } from "express";

export async function validateMiddleware<T extends AnyZodObject>(
  schema: T,
  req: Request,
) {
  try {
    let response = {} as z.infer<T["shape"]["body"]> &
      z.infer<T["shape"]["params"]> &
      z.infer<T["shape"]["query"]>;

    if (schema.shape.body) {
      response = {
        ...response,
        ...schema.shape.body.parse(req.body),
      };
    }

    if (schema.shape.params) {
      response = {
        ...response,
        ...schema.shape.params.parse(req.params),
      };
    }

    if (schema.shape.query) {
      response = {
        ...response,
        ...schema.shape.query.parse(req.query),
      };
    }

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.message);
    }

    throw new Error(JSON.stringify(error));
  }
}
