import { PrismaClient } from "@prisma/client";
import { Application, NextFunction, Request, Response } from "express";

import UsersRepository from "../../../app/repositories/users-repository";
import PrismaUsersRepository from "../../database/repositories/prisma-users-repository";

import CreateUserUseCase from "../../../app/use-cases/create-user-use-case";
import Hasher from "../../modules/hasher";
import LoginUserUseCase from "../../../app/use-cases/login-user-use-case";
import Auth from "../../modules/auth";
import { UserViewModel } from "../view-models/users-view-model";
import { validateMiddleware } from "../middlewares/validate-middleware";
import { z } from "zod";

export class UsersController {
  private readonly usersRepository: UsersRepository;

  constructor(
    private readonly application: Application,
    private readonly hasher: Hasher,
    private readonly auth: Auth,
    private readonly database: PrismaClient,
  ) {
    this.registerRoutes();
    this.usersRepository = new PrismaUsersRepository(database);
  }

  private registerRoutes() {
    this.application.post(
      "/users",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const schema = z.object({
            body: z.object({
              name: z.string().min(3).max(255),
              email: z.string().email(),
              password: z.string().min(4).max(50),
            }),
          });

          const data = await validateMiddleware(schema, request);

          const useCase = new CreateUserUseCase(
            this.usersRepository,
            this.hasher,
          );

          const { user } = await useCase.execute(data);

          return response.status(201).send(UserViewModel.toHTTP(user));
        } catch (error) {
          next(error);
        }
      },
    );

    this.application.post(
      "/users/login",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const schema = z.object({
            body: z.object({
              email: z.string().email(),
              password: z.string().min(4).max(50),
            }),
          });

          const data = await validateMiddleware(schema, request);

          const useCase = new LoginUserUseCase(
            this.usersRepository,
            this.hasher,
            this.auth,
          );
          const { type, token } = await useCase.execute(data);

          return response.status(200).send({ type, token });
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
