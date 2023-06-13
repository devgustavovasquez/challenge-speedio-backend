import User from "../domain/user";
import UsersRepository from "../repositories/users-repository";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  user: User;
};

export default class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(
      request.email,
    );

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const user = new User({
      name: request.name,
      email: request.email,
      password: request.password,
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);

    return { user };
  }
}
