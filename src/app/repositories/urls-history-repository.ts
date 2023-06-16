import URLHistory, { URLHistoryProps } from "../domain/url-history";

type ListOptions = {
  limit?: number;
  offset?: number;
  orderBy?: keyof URLHistoryProps;
  order?: "asc" | "desc";
};

export default interface URLsHistoryRepository {
  save(url: URLHistory): Promise<void>;
  update(url: URLHistory): Promise<void>;
  list(options: ListOptions): Promise<URLHistory[]>;
  findByURL(url: string): Promise<URLHistory | undefined>;
}
