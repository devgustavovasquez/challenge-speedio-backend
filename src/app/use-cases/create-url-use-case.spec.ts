import { makeURL } from "../../../tests/factories/url-factory";
import { makeUser } from "../../../tests/factories/user-factory";
import MockAuth from "../../../tests/modules/auth";
import { InMemoryURLsRepository } from "../../../tests/repositories/urls-repository";
import { InMemoryUsersRepository } from "../../../tests/repositories/users-repository";
import URL from "../domain/url";
import CreateURLUseCase from "./create-url-use-case";

describe("CreateURL", () => {
  let sut: CreateURLUseCase;
  const URLRepository = new InMemoryURLsRepository();
  const usersRepository = new InMemoryUsersRepository();
  const auth = new MockAuth();

  beforeEach(() => {
    sut = new CreateURLUseCase(URLRepository, usersRepository, auth);
    URLRepository.urls = [];
  });

  it("should create a new URL", async () => {
    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.id).toBeDefined();
    expect(url).toBeInstanceOf(URL);
  });

  it("should create the first URL correct", async () => {
    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.id).toBeDefined();
    expect(url).toBeInstanceOf(URL);
    expect(url.short).toBe("1a");
  });

  it("should increment the short if already exists a URL", async () => {
    const existingURL = makeURL({ short: "1a" });
    URLRepository.urls.push(existingURL);

    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.short).toBe("1b");
  });

  it("should create a URL with userId", async () => {
    const user = makeUser();
    usersRepository.users.push(user);

    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
      userId: user.id,
      token: "validToken",
    });

    expect(url.userId).toBe(user.id);
    expect(url).toBeInstanceOf(URL);
  });

  it("should throw if user is not found", async () => {
    const request = {
      title: "Example URL",
      origin: "https://example.com",
      userId: "invalid-user-id",
      token: "invalid-token",
    };

    await expect(sut.execute(request)).rejects.toThrow();
  });

  it("should throw if token is not found, when userId is provided", async () => {
    const user = makeUser();
    usersRepository.users.push(user);

    const request = {
      title: "Example URL",
      origin: "https://example.com",
      userId: user.id,
    };

    await expect(sut.execute(request)).rejects.toThrow();
  });

  it("should throw if user is not authenticated", async () => {
    const user = makeUser();
    usersRepository.users.push(user);

    const request = {
      title: "Example URL",
      origin: "https://example.com",
      userId: user.id,
      token: "invalid-token",
    };

    await expect(sut.execute(request)).rejects.toThrow();
  });
});
