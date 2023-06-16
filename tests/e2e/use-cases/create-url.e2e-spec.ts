import HTTPTesting from "supertest";
import { Server as HttpServer } from "http";
import Server from "../../../src/server";
import Prisma from "../../../src/infra/database";

const prisma = new Prisma();
const server = new Server(3000, false);
let app: HttpServer;

describe("[e2e] Create URL", () => {
  beforeAll(async () => {
    await server.init();
    app = server.getServerInstance();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should return 201 and correct data when URL is created", async () => {
    const request = {
      title: "Album do Facebook",
      origin: "https://www.google.com",
    };

    const response = await HTTPTesting(app).post("/urls").send(request);

    const urls = await prisma.uRL.findMany();

    expect(response.status).toBe(201);
    expect(response.body.origin).toBe(request.origin);

    expect(urls.length).toBe(1);
    expect(urls[0].origin).toBe(request.origin);

    await prisma.uRL.delete({ where: { id: urls[0].id } });
  });

  it("should can create a URL logged", async () => {
    const userRequest = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
    };

    await HTTPTesting(app).post("/users").send(userRequest);
    const userResponse = await HTTPTesting(app).post("/login").send({
      email: userRequest.email,
      password: userRequest.password,
    });

    const request = {
      title: "Album do Facebook",
      origin: "https://www.google.com",
      userId: userResponse.body.id,
      token: userResponse.body.token,
    };

    const response = await HTTPTesting(app).post("/urls").send(request);

    const urls = await prisma.uRL.findMany();

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(request.userId);

    expect(urls.length).toBe(1);

    await prisma.uRL.delete({ where: { id: urls[0].id } });
    await prisma.user.delete({ where: { email: userRequest.email } });
  });

  it("should return 401 when user is not logged", async () => {
    const userRequest = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
    };

    const userResponse = await HTTPTesting(app)
      .post("/users")
      .send(userRequest);

    const request = {
      title: "Album do Facebook",
      origin: "https://www.google.com",
      userId: userResponse.body.id,
      token: "invalid token",
    };

    const response = await HTTPTesting(app).post("/urls").send(request);

    const urls = await prisma.uRL.findMany();

    expect(response.status).toBe(401);
    expect(urls.length).toBe(0);

    await prisma.user.delete({ where: { email: userRequest.email } });
  });
});
