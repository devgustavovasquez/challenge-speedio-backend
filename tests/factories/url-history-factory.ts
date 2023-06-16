import URLHistory, { URLHistoryProps } from "../../src/app/domain/url-history";

type Override = Partial<URLHistoryProps>;

export function makeURLHistory(override: Override = {}) {
  return new URLHistory({
    title: "Example URLHistory",
    count: 0,
    url: "https://example.com",
    firstAccessedAt: new Date(),
    lastAccessedAt: new Date(),
    ...override,
  });
}
