import HTTPTesting from "supertest";
import { Server as HttpServer } from "http";
import Server from "../../../src/server";
import Prisma from "../../../src/infra/database";

const prisma = new Prisma();
const server = new Server(3000, false);
let app: HttpServer;

describe("[e2e] Create User", () => {
  beforeAll(async () => {
    await server.init();
    app = server.getServerInstance();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should return 201 and correct data when user is created", async () => {
    const request = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
    };

    const response = await HTTPTesting(app).post("/users").send(request);

    const users = await prisma.user.findMany();

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(request.name);
    expect(response.body.email).toBe(request.email);

    expect(users.length).toBe(1);
    expect(users[0].name).toBe(request.name);
    expect(users[0].email).toBe(request.email);

    await prisma.user.delete({ where: { id: users[0].id } });
  });

  it("should return 400 when user already exists", async () => {
    const request = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
    };

    await HTTPTesting(app).post("/users").send(request);
    const response = await HTTPTesting(app).post("/users").send(request);

    const users = await prisma.user.findMany();

    expect(response.status).toBe(400);
    expect(users.length).toBe(1);

    await prisma.user.delete({ where: { id: users[0].id } });
  });

  it("should return 400 when some data is missing", async () => {
    const request = {
      email: "johndoe.com",
      password: "123456",
    };

    const response = await HTTPTesting(app).post("/users").send(request);

    const users = await prisma.user.findMany();

    expect(response.status).toBe(400);
    expect(users.length).toBe(0);
  });
});
