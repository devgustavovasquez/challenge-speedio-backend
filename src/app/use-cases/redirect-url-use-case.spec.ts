import { makeURL } from "../../../tests/factories/url-factory";
import { InMemoryURLsHistoryRepository } from "../../../tests/repositories/urls-history-repository";
import { InMemoryURLsRepository } from "../../../tests/repositories/urls-repository";
import { NotFoundError } from "../../infra/http/errors/not-found";
import RedirectURLUseCase from "./redirect-url-use-case";

describe("RedirectURL", () => {
  let sut: RedirectURLUseCase;
  const URLRepository = new InMemoryURLsRepository();
  const URLHistoriesRepository = new InMemoryURLsHistoryRepository();

  beforeEach(() => {
    sut = new RedirectURLUseCase(URLRepository, URLHistoriesRepository);
    URLHistoriesRepository.urls = [];
    URLRepository.urls = [];
  });

  it("should redirect to the original URL", async () => {
    const url = makeURL({ short: "1f" });
    URLRepository.urls.push(url);

    const { redirectURL } = await sut.execute({
      short: url.short,
    });

    expect(redirectURL).toEqual(url.origin);
  });

  it("should throw an error if the URL is not found", async () => {
    const request = {
      short: "1f",
    };

    await expect(sut.execute(request)).rejects.toThrow(NotFoundError);
  });

  it("should create a new URLHistory if it does not exist", async () => {
    const url = makeURL({ short: "1f" });
    URLRepository.urls.push(url);

    await sut.execute({
      short: url.short,
    });

    const urlHistory = await URLHistoriesRepository.findByURL(url.origin);

    expect(urlHistory).toBeDefined();
  });

  it("should increment the count of the URLHistory", async () => {
    const url = makeURL({ short: "1f" });

    URLRepository.urls.push(url);

    await sut.execute({ short: url.short });

    const urlHistory = await URLHistoriesRepository.findByURL(url.origin);

    expect(urlHistory?.count).toEqual(1);

    await sut.execute({ short: url.short });

    const urlHistory2 = await URLHistoriesRepository.findByURL(url.origin);
    expect(urlHistory2?.count).toEqual(2);
  });

  it("should increment the count when urls with the same root are accessed", async () => {
    const root = "https://google.com";
    const url = makeURL({ short: "1a", origin: root + "/path" });
    const url2 = makeURL({ short: "2b", origin: root + "/search?q=123" });

    URLRepository.urls.push(url);
    URLRepository.urls.push(url2);

    await sut.execute({ short: url.short });
    await sut.execute({ short: url2.short });

    const urlHistory = await URLHistoriesRepository.findByURL(root);

    expect(urlHistory?.count).toEqual(2);
  });
});
