import Auth from "../../infra/modules/auth";
import Hasher from "../../infra/modules/hasher";
import UsersRepository from "../repositories/users-repository";

type LoginUserRequest = {
  email: string;
  password: string;
};

type LoginUserResponse = {
  token: string;
  type: string;
};

export default class LoginUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private auth: Auth,
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password } = request;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await this.hasher.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password");
    }

    const token = this.auth.generateToken(
      {
        userId: user.id,
      },
      {
        expiresIn: "1d",
      },
    );

    return {
      token,
      type: "Bearer",
    };
  }
}
