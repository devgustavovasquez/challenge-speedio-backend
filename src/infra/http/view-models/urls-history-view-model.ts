import URLHistory from "../../../app/domain/url-history";

export class URLHistoryViewModel {
  static toHTTP(urlHistory: URLHistory) {
    return {
      id: urlHistory.id,
      title: urlHistory.title,
      url: urlHistory.url,
      count: urlHistory.count,
      lastAccessedAt: urlHistory.lastAccessedAt,
      firstAccessedAt: urlHistory.firstAccessedAt,
    };
  }
}
