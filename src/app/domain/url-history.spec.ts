import URLHistory from "./url-history";

describe("URLHistory", () => {
  let sut: URLHistory;
  const props = {
    title: "Example URLHistory",
    url: "https://example.com",
    count: 0,
    lastAccessedAt: new Date(),
  };

  beforeEach(() => {
    sut = new URLHistory(props);
  });

  it("should have correct initial values", () => {
    expect(sut.id).toBeDefined();
    expect(sut.title).toBe(props.title);
    expect(sut.url).toBe(props.url);
    expect(sut.count).toBe(props.count);
    expect(sut.lastAccessedAt).toBeInstanceOf(Date);
    expect(sut.firstAccessedAt).toBeInstanceOf(Date);
  });

  it("should be able to create a new URLHistory with custom id", () => {
    const id = "customId";

    sut = new URLHistory(props, id);

    expect(sut.id).toBe(id);
  });

  it("should be able to create a URLHistory with firstAccessedAt", () => {
    const firstAccessedAt = new Date();

    sut = new URLHistory({ ...props, firstAccessedAt });

    expect(sut.firstAccessedAt).toBe(firstAccessedAt);
  });

  it("should be able mark as accessed", () => {
    const previousUpdatedAt = sut.lastAccessedAt;

    sut.markAsAccessed();

    expect(sut.count).toBe(1);
    expect(sut.lastAccessedAt).not.toBe(previousUpdatedAt);

    sut.markAsAccessed();
    expect(sut.count).toBe(2);
  });
});
