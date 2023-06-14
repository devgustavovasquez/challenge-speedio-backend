import { makeURL } from "../../../tests/factories/url-factory";
import { InMemoryURLsRepository } from "../../../tests/repositories/urls-repository";
import URL from "../domain/url";
import CreateURLUseCase from "./create-url-use-case";

describe("CreateURL", () => {
  let sut: CreateURLUseCase;
  const URLRepository = new InMemoryURLsRepository();

  beforeEach(() => {
    sut = new CreateURLUseCase(URLRepository);
    URLRepository.urls = [];
  });

  it("should create a new URL", async () => {
    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.id).toBeDefined();
    expect(url).toBeInstanceOf(URL);
  });

  it("should create the first URL correct", async () => {
    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.id).toBeDefined();
    expect(url).toBeInstanceOf(URL);
    expect(url.short).toBe("1a");
  });

  it("should increment the short if already exists a URL", async () => {
    const existingURL = makeURL({ short: "1a" });
    URLRepository.urls.push(existingURL);

    const { url } = await sut.execute({
      title: "Example URL",
      origin: "https://example.com",
    });

    expect(url.short).toBe("1b");
  });
});
