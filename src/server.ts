import "dotenv/config";
import express from "express";
import { UsersController } from "./infra/http/controllers/users-controller";
import Prisma from "./infra/database";
import { Bcrypt } from "./infra/modules/hasher";

const app = express();
const database = new Prisma();
const hasher = new Bcrypt();

app.use(express.json());

new UsersController(app, hasher, database);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
