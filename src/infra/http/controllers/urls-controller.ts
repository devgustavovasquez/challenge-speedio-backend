import { PrismaClient } from "@prisma/client";
import { Application, NextFunction, Request, Response } from "express";

import URLsRepository from "../../../app/repositories/urls-repository";
import PrismaUrlsRepository from "../../database/repositories/prisma-urls-repository";
import CreateURLUseCase from "../../../app/use-cases/create-url-use-case";
import UsersRepository from "../../../app/repositories/users-repository";
import PrismaUsersRepository from "../../database/repositories/prisma-users-repository";
import Auth from "../../modules/auth";
import RedirectURLUseCase from "../../../app/use-cases/redirect-url-use-case";
import URLsHistoryRepository from "../../../app/repositories/urls-history-repository";
import PrismaURLsHistoryRepository from "../../database/repositories/prisma-urls-history-repository";

export class URLsController {
  private readonly urlsRepositoy: URLsRepository;
  private readonly usersRepository: UsersRepository;
  private readonly urlsHistoryRepository: URLsHistoryRepository;

  constructor(
    private readonly application: Application,
    private readonly auth: Auth,
    private readonly database: PrismaClient,
  ) {
    this.registerRoutes();
    this.urlsRepositoy = new PrismaUrlsRepository(database);
    this.usersRepository = new PrismaUsersRepository(database);
    this.urlsHistoryRepository = new PrismaURLsHistoryRepository(database);
  }

  private registerRoutes() {
    this.application.post(
      "/urls",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const useCase = new CreateURLUseCase(
            this.urlsRepositoy,
            this.usersRepository,
            this.auth,
          );

          const { url } = await useCase.execute(request.body);

          return response.status(201).json(url);
        } catch (error) {
          next(error);
        }
      },
    );

    this.application.get(
      "/:short",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const { short } = request.params;

          const useCase = new RedirectURLUseCase(
            this.urlsRepositoy,
            this.urlsHistoryRepository,
          );

          const { redirectURL } = await useCase.execute({ short });

          return response.status(200).json({ redirectURL });
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
