import URL from "../../../app/domain/url";

export class URLViewModel {
  static toHTTP(url: URL) {
    return {
      id: url.id,
      title: url.title,
      origin: url.origin,
      short: url.short,
      userId: url.userId,
      updatedAt: url.updatedAt,
      createdAt: url.createdAt,
    };
  }
}
