import User from "../domain/user";
import UsersRepository from "../repositories/users-repository";

import Hasher from "../../infra/modules/hasher";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  user: User;
};

export default class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      request.email,
    );

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hasher.hash(request.password);

    const user = new User({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);

    return { user };
  }
}
