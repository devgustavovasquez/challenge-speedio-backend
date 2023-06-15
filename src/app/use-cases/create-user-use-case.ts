import User from "../domain/user";
import UsersRepository from "../repositories/users-repository";

import Hasher from "../../infra/modules/hasher";
import { BadRequestError } from "../../infra/http/errors/bad-request";

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
    const { name, email, password } = request;
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestError(`User with email ${email} already exists`);
    }

    const hashedPassword = await this.hasher.hash(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);

    return { user };
  }
}
