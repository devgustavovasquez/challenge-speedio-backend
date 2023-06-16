import Scraper, { CheerioScraper } from "./scraper";

describe("CheerioScraper", () => {
  let scraper: Scraper;

  beforeEach(() => {
    scraper = new CheerioScraper();
  });

  test("getTitlePage should return the title of the page", async () => {
    const url = "https://www.example.com";
    const expectedTitle = "Example Domain";

    const title = await scraper.getTitlePage(url);

    expect(title).toBe(expectedTitle);
  });
});
