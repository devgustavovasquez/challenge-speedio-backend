import { incrementShort } from "../../../utils";
import { UnauthorizedError } from "../../infra/http/errors/unauthorized";
import Auth from "../../infra/modules/auth";
import URL from "../domain/url";
import URLsRepository from "../repositories/urls-repository";
import UsersRepository from "../repositories/users-repository";

type CreateURLRequest = {
  title: string;
  origin: string;
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
    const { title, origin, token } = request;

    let userId = "";

    if (token) {
      const isValid = this.auth.verifyToken(token);

      if (!isValid) {
        throw new UnauthorizedError("Invalid token");
      }

      userId = this.auth.decodeToken<{ id: string }>(token).id;

      const user = await this.usersRepository.findById(userId);

      if (!user) {
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
