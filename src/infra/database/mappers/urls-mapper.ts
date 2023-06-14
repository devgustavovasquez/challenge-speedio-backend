import URL from "../../../app/domain/url";
import { URL as URLPrisma } from "@prisma/client";

export default class URLsMapper {
  static toDomain(url: URLPrisma): URL {
    return new URL(
      {
        title: url.title,
        origin: url.origin,
        short: url.short,
        userId: url.userId || undefined,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
      url.id,
    );
  }

  static toPrisma(url: URL): URLPrisma {
    return {
      id: url.id,
      title: url.title,
      origin: url.origin,
      short: url.short,
      userId: url.userId || null,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}
