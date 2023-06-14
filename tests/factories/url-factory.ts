import URL, { URLProps } from "../../src/app/domain/url";

type Override = Partial<URLProps>;

export function makeURL(override: Override = {}) {
  return new URL({
    title: "Example URL",
    origin: "https://example.com",
    updatedAt: new Date(),
    ...override,
  });
}
