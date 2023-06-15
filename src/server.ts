import "dotenv/config";
import express from "express";
import { UsersController } from "./infra/http/controllers/users-controller";
import Prisma from "./infra/database";
import { Bcrypt } from "./infra/modules/hasher";
import { Jwt } from "./infra/modules/auth";
import { URLsController } from "./infra/http/controllers/urls-controller";

const app = express();
const database = new Prisma();
const auth = new Jwt();
const hasher = new Bcrypt();

app.use(express.json());

new UsersController(app, hasher, auth, database);
new URLsController(app, auth, database);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
