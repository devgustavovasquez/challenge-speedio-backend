import URLHistory from "../domain/url-history";

type ListOptions = {
  limit?: number;
};

export default interface URLsHistoryRepository {
  save(url: URLHistory): Promise<void>;
  list(options: ListOptions): Promise<URLHistory[]>;
  findByURL(url: string): Promise<URLHistory | undefined>;
}
