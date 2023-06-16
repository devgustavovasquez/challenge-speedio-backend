import { incrementShort } from "../../../utils";
import { BadRequestError } from "../../infra/http/errors/bad-request";
import { UnauthorizedError } from "../../infra/http/errors/unauthorized";
import Auth from "../../infra/modules/auth";
import URL from "../domain/url";
import URLsRepository from "../repositories/urls-repository";
import UsersRepository from "../repositories/users-repository";

type CreateURLRequest = {
  title: string;
  origin: string;
  userId?: string;
  token?: string;
};

type CreateURLResponse = {
  url: URL;
};

export default class CreateURLUseCase {
  constructor(
    private URLsRepository: URLsRepository,
    private usersRepository: UsersRepository,
    private auth: Auth,
  ) {}

  async execute(request: CreateURLRequest): Promise<CreateURLResponse> {
    const { title, origin, userId, token } = request;

    if (userId) {
      if (!token) {
        throw new BadRequestError("Token not found");
      }

      const user = await this.usersRepository.findById(userId);

      if (!user) {
        throw new BadRequestError("User not found");
      }

      const isValidToken = this.auth.verifyToken(token);

      if (!isValidToken) {
        throw new UnauthorizedError("Invalid token");
      }
    }

    let short = "";

    const lastURL = await this.URLsRepository.getLastURL();

    if (lastURL) {
      short = incrementShort(lastURL.short);
    } else {
      short = "1a";
    }

    const url = new URL({
      userId,
      title,
      origin,
      short,
      updatedAt: new Date(),
    });

    await this.URLsRepository.save(url);

    return { url };
  }
}
