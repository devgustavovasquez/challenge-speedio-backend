import URL from "./url";

describe("URL", () => {
  let sut: URL;
  const props = {
    title: "Example URL",
    origin: "https://example.com",
    updatedAt: new Date(),
  };

  beforeEach(() => {
    sut = new URL(props);
  });

  it("should have correct initial values", () => {
    expect(sut.id).toBeDefined();
    expect(sut.userId).toBeUndefined();
    expect(sut.title).toBe(props.title);
    expect(sut.origin).toBe(props.origin);
    expect(() => sut.short).toThrow();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it("should be able to create a new URL with custom id", () => {
    const id = "customId";

    sut = new URL(props, id);

    expect(sut.id).toBe(id);
  });

  it("should be able to create a URL with userId", () => {
    const userId = "userId";

    sut = new URL({ ...props, userId });

    expect(sut.userId).toBe(userId);
  });

  it("should be able to create a URL with createdAt", () => {
    const createdAt = new Date();

    sut = new URL({ ...props, createdAt });

    expect(sut.createdAt).toBe(createdAt);
  });

  it("should be able to create a URL with short url", () => {
    const short = "short";

    sut = new URL({ ...props, short });

    expect(sut.short).toBe(short);
  });

  it("should change title correctly", () => {
    const newTitle = "newTitle";
    const previousUpdatedAt = sut.updatedAt;

    sut.setTitle(newTitle);

    expect(sut.title).toBe(newTitle);
    expect(sut.updatedAt).not.toBe(previousUpdatedAt);
  });

  it("should throw error when changing title with invalid title", () => {
    const newTitle = "";

    expect(() => {
      sut.setTitle(newTitle);
    }).toThrow();
  });

  it("should change origin correctly", () => {
    const newOrigin = "newOrigin";
    const previousUpdatedAt = sut.updatedAt;

    sut.setOrigin(newOrigin);

    expect(sut.origin).toBe(newOrigin);
    expect(sut.updatedAt).not.toBe(previousUpdatedAt);
  });

  it("should throw error when changing origin with invalid origin", () => {
    const newOrigin = "";

    expect(() => {
      sut.setOrigin(newOrigin);
    }).toThrow();
  });
});
