import { getUrlRoot } from "../../../utils";
import URLHistory from "../domain/url-history";
import URLsRepository from "../repositories/urls-repository";
import URLsHistoryRepository from "../repositories/urls-history-repository";
import { NotFoundError } from "../../infra/http/errors/not-found";
import Scraper from "../../infra/modules/scraper";

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
    private scraper: Scraper,
  ) {}

  async execute(request: RedirectURLRequest): Promise<RedirectURLResponse> {
    const { short } = request;

    const url = await this.URLsRepository.findByShort(short);

    if (!url) {
      throw new NotFoundError(`URL with short ${short} not found`);
    }

    const urlRoot = getUrlRoot(url.origin);

    let urlHistory = await this.urlsHistoryRepository.findByURL(urlRoot);

    if (!urlHistory) {
      urlHistory = new URLHistory({
        title: await this.scraper.getTitlePage(urlRoot),
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
