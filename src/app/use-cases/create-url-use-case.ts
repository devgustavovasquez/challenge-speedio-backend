import { incrementShort } from "../../../utils";
import URL from "../domain/url";
import URLsRepository from "../repositories/urls-repository";

type CreateURLRequest = {
  userId?: string;
  title: string;
  origin: string;
};

type CreateURLResponse = {
  url: URL;
};

export default class CreateURLUseCase {
  constructor(private URLsRepository: URLsRepository) {}

  async execute(request: CreateURLRequest): Promise<CreateURLResponse> {
    const { userId, title, origin } = request;

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
