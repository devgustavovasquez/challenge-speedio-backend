import URLHistory from "../domain/url-history";
import URLsHistoryRepository from "../repositories/urls-history-repository";

type RedirectURLResponse = {
  urls: URLHistory[];
};

export default class ListRankedURLHistoryUseCase {
  constructor(private urlsHistoryRepository: URLsHistoryRepository) {}

  async execute(): Promise<RedirectURLResponse> {
    const urls = await this.urlsHistoryRepository.list({
      orderBy: "count",
      order: "desc",
    });

    return {
      urls,
    };
  }
}
