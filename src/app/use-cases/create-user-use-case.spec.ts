import { InMemoryUsersRepository } from "../../../tests/repositories/users-repository";
import User from "../domain/user";
import CreateUserUseCase from "./create-user-use-case";

describe("CreateUser", () => {
  let sut: CreateUserUseCase;
  const UserRepository = new InMemoryUsersRepository();

  beforeEach(() => {
    sut = new CreateUserUseCase(UserRepository);
    UserRepository.users = [];
  });

  it("should create a new User", async () => {
    const request = {
      name: "John Doe",
      email: "john@email.com",
      password: "123456",
    };

    const response = await sut.execute(request);

    expect(response.user).toBeInstanceOf(User);
  });

  it("should throw an error if the email is already in use", async () => {
    const existingEmail = "john@email.com";
    const existingUser = {
      name: "John Doe",
      email: existingEmail,
      password: "123456",
    };

    await sut.execute(existingUser);

    const newUser = {
      name: "Another John Doe",
      email: existingEmail,
      password: "654321",
    };

    await expect(sut.execute(newUser)).rejects.toThrow();
  });
});
