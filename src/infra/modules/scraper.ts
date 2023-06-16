import { load } from "cheerio";

export default interface Scraper {
  getTitlePage(url: string): Promise<string>;
}

export class CheerioScraper implements Scraper {
  async getTitlePage(url: string): Promise<string> {
    const response = await fetch(url);

    const html = await response.text();

    const $ = load(html);

    return $("title").text();
  }
}
