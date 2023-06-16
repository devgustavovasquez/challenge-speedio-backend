import express, { Application } from "express";
import cors from "cors";
import { Server as HttpServer } from "http";

import { URLsController } from "./infra/http/controllers/urls-controller";
import { UsersController } from "./infra/http/controllers/users-controller";

import Prisma from "./infra/database";
import Hasher, { Bcrypt } from "./infra/modules/hasher";
import Auth, { Jwt } from "./infra/modules/auth";
import { errorMiddleware } from "./infra/http/middlewares/error-middleware";
import Scraper, { CheerioScraper } from "./infra/modules/scraper";

export default class Server extends HttpServer {
  private serverInstance: HttpServer | null;
  private app: Application;
  private database: Prisma;
  private hasher: Hasher;
  private auth: Auth;
  private scraper: Scraper;

  constructor(private port: number | string, private log = true) {
    super();
    this.app = express();
    this.database = new Prisma();
    this.hasher = new Bcrypt();
    this.auth = new Jwt();
    this.scraper = new CheerioScraper();
    this.serverInstance = null;
  }

  async init(): Promise<void> {
    this.app.use(
      cors({
        origin: "*",
      }),
    );
    this.app.use(express.json());
    await this.database.$connect();

    new UsersController(this.app, this.hasher, this.auth, this.database);
    new URLsController(this.app, this.auth, this.database, this.scraper);

    this.app.use(errorMiddleware);
    this.serverInstance = this.app.listen(this.port, () => {
      if (this.log) {
        console.log(`[SERVER] running at http://localhost:${this.port}`);
      }
    });
  }

  getServerInstance(): HttpServer {
    if (!this.serverInstance) {
      throw new Error("Server is not running");
    }

    return this.serverInstance;
  }

  async stop(): Promise<void> {
    if (this.serverInstance) {
      await this.database.$disconnect();
      this.serverInstance.close(() => {
        if (this.log) {
          console.log("[SERVER] closed");
        }
      });
    }
  }
}
