import URLHistory from "../../../app/domain/url-history";
import { URLHistory as URLHistoryPrisma } from "@prisma/client";

export default class URLsHistoryMapper {
  static toDomain(data: URLHistoryPrisma): URLHistory {
    return new URLHistory(
      {
        title: data.title,
        count: data.count,
        url: data.url,
        lastAccessedAt: data.lastAccessedAt,
        firstAccessedAt: data.firstAccessedAt,
      },
      data.id,
    );
  }

  static toPrisma(data: URLHistory): URLHistoryPrisma {
    return {
      id: data.id,
      title: data.title,
      count: data.count,
      url: data.url,
      lastAccessedAt: data.lastAccessedAt,
      firstAccessedAt: data.firstAccessedAt,
    };
  }
}
