import { PrismaClient } from "@prisma/client";
import { Application, NextFunction, Request, Response } from "express";

import UsersRepository from "../../../app/repositories/users-repository";
import PrismaUsersRepository from "../../database/repositories/prisma-users-repository";

import CreateUserUseCase from "../../../app/use-cases/create-user-use-case";
import Hasher from "../../modules/hasher";

export class UsersController {
  private readonly usersRepository: UsersRepository;

  constructor(
    private application: Application,
    private hasher: Hasher,
    database: PrismaClient,
  ) {
    this.registerRoutes();
    this.usersRepository = new PrismaUsersRepository(database);
  }

  private registerRoutes() {
    this.application.post(
      "/users",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const useCase = new CreateUserUseCase(
            this.usersRepository,
            this.hasher,
          );
          const { user } = await useCase.execute(request.body);

          return response.status(201).json(user);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
