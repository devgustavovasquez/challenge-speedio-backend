import { incrementShort } from ".";

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
