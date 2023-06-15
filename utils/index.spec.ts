import { incrementShort, getUrlRoot } from ".";

describe("incrementShort", () => {
  it('should increment the value when letter is not "z"', () => {
    expect(incrementShort("1a")).toBe("1b");
    expect(incrementShort("9z")).toBe("10a");
    expect(incrementShort("10a")).toBe("10b");
  });

  it('should wrap around when letter is "z"', () => {
    expect(incrementShort("1z")).toBe("2a");
    expect(incrementShort("99z")).toBe("100a");
    expect(incrementShort("100z")).toBe("101a");
  });

  it("should throw a error when short not valid", () => {
    expect(() => incrementShort("123")).toThrow();
    expect(() => incrementShort("abc")).toThrow();
    expect(() => incrementShort("")).toThrow();
  });
});

describe("getUrlRoot", () => {
  it("returns the root URL for a valid URL", () => {
    const url = "https://www.example.com/path/to/page?query=string";

    const rootUrl = getUrlRoot(url);

    expect(rootUrl).toBe("https://example.com");
  });

  it("returns the root URL for a URL without path or query", () => {
    const url = "https://www.example.com";

    const rootUrl = getUrlRoot(url);

    expect(rootUrl).toBe("https://example.com");
  });

  it("returns the root URL for a URL with subdomains", () => {
    const url = "https://subdomain.example.com/path/to/page";

    const rootUrl = getUrlRoot(url);

    expect(rootUrl).toBe("https://subdomain.example.com");
  });

  it("returns the root URL for a URL with trailing slash", () => {
    const url = "https://example.com/";

    const rootUrl = getUrlRoot(url);

    expect(rootUrl).toBe("https://example.com");
  });
});
