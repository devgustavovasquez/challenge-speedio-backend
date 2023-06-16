import URLHistory, { URLHistoryProps } from "../../src/app/domain/url-history";
import URLsHistoryRepository from "../../src/app/repositories/urls-history-repository";

type ListOptions = {
  limit?: number;
  offset?: number;
  orderBy?: keyof URLHistoryProps;
  order?: "asc" | "desc";
};
export class InMemoryURLsHistoryRepository implements URLsHistoryRepository {
  public urls: URLHistory[] = [];

  async save(url: URLHistory): Promise<void> {
    this.urls.push(url);
  }

  async update(url: URLHistory): Promise<void> {
    const index = this.urls.findIndex((u) => u.url === url.url);

    this.urls[index] = url;
  }

  async list(options: ListOptions): Promise<URLHistory[]> {
    const { limit, offset, orderBy = "count", order = "desc" } = options;

    return this.urls
      .sort((a, b) => {
        if (order === "asc") {
          return (a[orderBy] as number) - (b[orderBy] as number);
        }

        return (b[orderBy] as number) - (a[orderBy] as number);
      })
      .slice(offset, limit);
  }

  async findByURL(url: string): Promise<URLHistory | undefined> {
    return this.urls.find((u) => u.url === url);
  }
}
