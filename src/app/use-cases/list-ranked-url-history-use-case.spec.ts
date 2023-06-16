import { makeURLHistory } from "../../../tests/factories/url-history-factory";
import { InMemoryURLsHistoryRepository } from "../../../tests/repositories/urls-history-repository";
import ListRankedURLHistoryUseCase from "./list-ranked-url-history-use-case";

describe("ListRankedURLHistory", () => {
  let sut: ListRankedURLHistoryUseCase;
  const URLHistoriesRepository = new InMemoryURLsHistoryRepository();

  beforeEach(() => {
    sut = new ListRankedURLHistoryUseCase(URLHistoriesRepository);
    URLHistoriesRepository.urls = [];
  });

  it("should return a list of ranked URLs", async () => {
    const url1 = makeURLHistory({ count: 1 });
    const url2 = makeURLHistory({ count: 2 });
    const url3 = makeURLHistory({ count: 3 });

    URLHistoriesRepository.urls.push(url1, url2, url3);

    const { urls } = await sut.execute();

    expect(urls).toEqual([url3, url2, url1]);
  });
});
