import Scraper from "../../src/infra/modules/scraper";

export default class MockScraper implements Scraper {
  async getTitlePage(url: string): Promise<string> {
    return "Example Domain";
  }
}
