import { makeUser } from "../../../tests/factories/user-factory";
import { InMemoryUsersRepository } from "../../../tests/repositories/users-repository";
import LoginUserUseCase from "./login-user-use-case";
import HasherMock from "../../../tests/modules/hasher";
import MockAuth from "../../../tests/modules/auth";

describe("LoginUser", () => {
  let sut: LoginUserUseCase;
  const UserRepository = new InMemoryUsersRepository();
  const auth = new MockAuth();
  const hasher = new HasherMock();

  beforeEach(() => {
    sut = new LoginUserUseCase(UserRepository, hasher, auth);
    const initialUser = makeUser();
    UserRepository.users = [initialUser];
  });

  it("should login a user", async () => {
    const request = {
      email: "johndoe@email.com",
      password: "correctPassword",
    };

    const response = await sut.execute(request);

    expect(response).toHaveProperty("token");
  });

  it("should throw an error if the user is not found", async () => {
    const request = {
      email: "invalid_email",
      password: "123456",
    };

    await expect(sut.execute(request)).rejects.toThrow();
  });

  it("should throw an error if the password is incorrect", async () => {
    const request = {
      email: "johndoe@email.com",
      password: "invalid_password",
    };

    await expect(sut.execute(request)).rejects.toThrow();
  });
});
