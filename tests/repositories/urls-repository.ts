import URL from "../../src/app/domain/url";
import URLsRepository from "../../src/app/repositories/urls-repository";

export class InMemoryURLsRepository implements URLsRepository {
  public urls: URL[] = [];

  async save(url: URL) {
    this.urls.push(url);
  }

  async getLastURL(): Promise<URL | undefined> {
    return this.urls[this.urls.length - 1];
  }

  async findByShort(short: string): Promise<URL | undefined> {
    return this.urls.find((url) => url.short === short);
  }

  async delete(url: URL): Promise<void> {
    const index = this.urls.findIndex((t) => t.id === url.id);

    this.urls.splice(index, 1);
  }

  async findById(id: string): Promise<URL | undefined> {
    return this.urls.find((url) => url.id === id);
  }
}
