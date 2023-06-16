import { makeURL } from "../../../tests/factories/url-factory";
import { makeUser } from "../../../tests/factories/user-factory";
import MockAuth from "../../../tests/modules/auth";
import { InMemoryURLsRepository } from "../../../tests/repositories/urls-repository";
import { InMemoryUsersRepository } from "../../../tests/repositories/users-repository";
import { NotFoundError } from "../../infra/http/errors/not-found";
import { UnauthorizedError } from "../../infra/http/errors/unauthorized";
import DeleteURLUseCase from "./delete-url-use-case";

describe("DeleteURL", () => {
  let sut: DeleteURLUseCase;
  const URLRepository = new InMemoryURLsRepository();
  const usersRepository = new InMemoryUsersRepository();
  const auth = new MockAuth();

  beforeEach(() => {
    sut = new DeleteURLUseCase(URLRepository, usersRepository, auth);
    URLRepository.urls = [];
    usersRepository.users = [];
  });

  it("should delete a URL", async () => {
    const user = makeUser();
    const url = makeURL({ userId: user.id });

    await usersRepository.save(user);
    await URLRepository.save(url);

    await sut.execute({
      id: url.id,
      userId: user.id,
      token: "validToken",
    });

    const deletedURL = await URLRepository.findById(url.id);

    expect(deletedURL).toBeUndefined();
    expect(URLRepository.urls).toHaveLength(0);
  });

  it("should throw if user is not found", async () => {
    const url = makeURL();

    await URLRepository.save(url);

    const request = {
      id: url.id,
      userId: "invalidUserId",
      token: "validToken",
    };

    expect(sut.execute(request)).rejects.toThrow(NotFoundError);
  });

  it("should throw if URL is not found", async () => {
    const user = makeUser();

    await usersRepository.save(user);

    const request = {
      id: "http://invalid-url.com",
      userId: user.id,
      token: "validToken",
    };

    expect(sut.execute(request)).rejects.toThrow(NotFoundError);
  });

  it("should throw if token is invalid", async () => {
    const user = makeUser();
    const url = makeURL({ userId: user.id });

    await usersRepository.save(user);
    await URLRepository.save(url);

    const request = {
      id: url.id,
      userId: user.id,
      token: "invalidToken",
    };

    expect(sut.execute(request)).rejects.toThrow(UnauthorizedError);
  });

  it("should throw if user is not the owner of the URL", async () => {
    const user = makeUser();
    const url = makeURL();

    await usersRepository.save(user);
    await URLRepository.save(url);

    const request = {
      id: url.id,
      userId: user.id,
      token: "validToken",
    };

    expect(sut.execute(request)).rejects.toThrow(UnauthorizedError);
  });
});
