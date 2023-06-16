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
import { URLViewModel } from "../view-models/urls-view-model";
import { validateMiddleware } from "../middlewares/validate-middleware";
import { z } from "zod";
import ListRankedURLHistoryUseCase from "../../../app/use-cases/list-ranked-url-history-use-case";
import { URLHistoryViewModel } from "../view-models/urls-history-view-model";
import DeleteURLUseCase from "../../../app/use-cases/delete-url-use-case";

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
          const schema = z.object({
            body: z.object({
              title: z.string().min(3).max(255),
              origin: z.string().url(),
              userId: z.string().uuid().optional(),
              token: z.string().optional(),
            }),
          });

          const data = await validateMiddleware(schema, request);

          const useCase = new CreateURLUseCase(
            this.urlsRepositoy,
            this.usersRepository,
            this.auth,
          );

          const { url } = await useCase.execute(data);

          return response.status(201).send(URLViewModel.toHTTP(url));
        } catch (error) {
          next(error);
        }
      },
    );

    this.application.get(
      "/urls",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const useCase = new ListRankedURLHistoryUseCase(
            this.urlsHistoryRepository,
          );

          const { urls } = await useCase.execute();

          return response
            .status(200)
            .send(urls.map((url) => URLHistoryViewModel.toHTTP(url)));
        } catch (error) {
          next(error);
        }
      },
    );

    this.application.delete(
      "/urls/:id",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const schema = z.object({
            params: z.object({
              id: z.string().uuid(),
            }),
            body: z.object({
              userId: z.string().uuid(),
              token: z.string(),
            }),
          });

          const data = await validateMiddleware(schema, request);

          const useCase = new DeleteURLUseCase(
            this.urlsRepositoy,
            this.usersRepository,
            this.auth,
          );

          await useCase.execute(data);

          return response.status(204).send();
        } catch (error) {
          next(error);
        }
      },
    );

    this.application.get(
      "/:short",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const schema = z.object({
            params: z.object({
              short: z.string().min(2),
            }),
          });

          const data = await validateMiddleware(schema, request);

          const useCase = new RedirectURLUseCase(
            this.urlsRepositoy,
            this.urlsHistoryRepository,
          );

          const { redirectURL } = await useCase.execute(data);

          return response.status(200).send({ redirectURL });
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
