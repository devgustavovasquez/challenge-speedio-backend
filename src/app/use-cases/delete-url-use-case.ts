import { NotFoundError } from "../../infra/http/errors/not-found";
import { UnauthorizedError } from "../../infra/http/errors/unauthorized";
import Auth from "../../infra/modules/auth";
import URLsRepository from "../repositories/urls-repository";
import UsersRepository from "../repositories/users-repository";

type DeleteURLRequest = {
  id: string;
  userId: string;
  token: string;
};

export default class DeleteURLUseCase {
  constructor(
    private URLsRepository: URLsRepository,
    private usersRepository: UsersRepository,
    private auth: Auth,
  ) {}

  async execute(request: DeleteURLRequest): Promise<void> {
    const { id: urlId, userId, token } = request;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    const url = await this.URLsRepository.findById(urlId);

    if (!url) {
      throw new NotFoundError(`URL with id ${urlId} not found`);
    }

    const isTokenValid = this.auth.verifyToken(token);

    if (!isTokenValid) {
      throw new UnauthorizedError("Invalid token");
    }

    if (url.userId !== userId) {
      throw new UnauthorizedError("You can't delete this URL");
    }

    await this.URLsRepository.delete(url);
  }
}
