import { getUrlRoot } from "../../../utils";
import URLHistory from "../domain/url-history";
import URLsRepository from "../repositories/urls-repository";
import URLsHistoryRepository from "../repositories/urls-history-repository";

type RedirectURLRequest = {
  short: string;
};

type RedirectURLResponse = {
  redirectURL: string;
};

export default class RedirectURLUseCase {
  constructor(
    private URLsRepository: URLsRepository,
    private urlsHistoryRepository: URLsHistoryRepository,
  ) {}

  async execute(request: RedirectURLRequest): Promise<RedirectURLResponse> {
    const { short } = request;

    const url = await this.URLsRepository.findByShort(short);

    if (!url) {
      throw new Error("URL not found");
    }

    const urlRoot = getUrlRoot(url.origin);

    let urlHistory = await this.urlsHistoryRepository.findByURL(urlRoot);

    if (!urlHistory) {
      urlHistory = new URLHistory({
        title: "mock-title", // TODO: scrape title from url
        url: urlRoot,
        count: 0,
        lastAccessedAt: new Date(),
      });

      await this.urlsHistoryRepository.save(urlHistory);
    }

    urlHistory.markAsAccessed();

    await this.urlsHistoryRepository.update(urlHistory);

    return { redirectURL: url.origin };
  }
}
