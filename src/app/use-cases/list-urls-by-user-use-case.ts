import { UnauthorizedError } from "../../infra/http/errors/unauthorized";
import Auth from "../../infra/modules/auth";
import URL from "../domain/url";
import URLsRepository from "../repositories/urls-repository";
import UsersRepository from "../repositories/users-repository";

type ListURLsByUserRequest = {
  token: string;
};

type ListURLsByUserResponse = {
  urls: URL[];
};

export default class ListURLsByUserUseCase {
  constructor(
    private URLsRepository: URLsRepository,
    private usersRepository: UsersRepository,
    private auth: Auth,
  ) {}

  async execute(
    request: ListURLsByUserRequest,
  ): Promise<ListURLsByUserResponse> {
    const { token } = request;

    const isValid = this.auth.verifyToken(token);

    if (!isValid) {
      throw new UnauthorizedError("Invalid token");
    }

    const userId = this.auth.decodeToken<{ id: string }>(token).id;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }

    const urls = await this.URLsRepository.listByUser(userId);

    return {
      urls,
    };
  }
}
