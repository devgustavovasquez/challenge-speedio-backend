import URL from "../domain/url";

export default interface URLsRepository {
  save(url: URL): Promise<void>;
  delete(url: URL): Promise<void>;
  getLastURL(): Promise<URL | undefined>;
  findByShort(short: string): Promise<URL | undefined>;
}
