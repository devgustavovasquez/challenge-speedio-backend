import URLHistory from "../../src/app/domain/url-history";
import URLsHistoryRepository from "../../src/app/repositories/urls-history-repository";

export class InMemoryURLsHistoryRepository implements URLsHistoryRepository {
  public urls: URLHistory[] = [];

  async save(url: URLHistory): Promise<void> {
    this.urls.push(url);
  }

  async update(url: URLHistory): Promise<void> {
    const index = this.urls.findIndex((u) => u.url === url.url);

    this.urls[index] = url;
  }

  async list(options: { limit?: number }): Promise<URLHistory[]> {
    if (options.limit) {
      return this.urls.slice(0, options.limit);
    }

    return this.urls;
  }

  async findByURL(url: string): Promise<URLHistory | undefined> {
    return this.urls.find((u) => u.url === url);
  }
}
