import { PrismaClient } from "@prisma/client";
import URLsHistoryRepository from "../../../app/repositories/urls-history-repository";
import URLsHistoryMapper from "../mappers/urls-history-mappers";
import URLHistory, { URLHistoryProps } from "../../../app/domain/url-history";

type ListOptions = {
  limit?: number;
  offset?: number;
  orderBy?: keyof URLHistoryProps;
  order?: "asc" | "desc";
};
export default class PrismaURLsHistoryRepository
  implements URLsHistoryRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: URLHistory): Promise<void> {
    const urlHistory = URLsHistoryMapper.toPrisma(data);

    await this.prisma.uRLHistory.create({ data: urlHistory });
  }

  async update(data: URLHistory): Promise<void> {
    const urlHistory = URLsHistoryMapper.toPrisma(data);

    await this.prisma.uRLHistory.update({
      where: { url: urlHistory.url },
      data: urlHistory,
    });
  }

  async findByURL(url: string): Promise<URLHistory | undefined> {
    const urlHistory = await this.prisma.uRLHistory.findUnique({
      where: { url },
    });

    if (!urlHistory) return undefined;

    return URLsHistoryMapper.toDomain(urlHistory);
  }

  async list(options: ListOptions): Promise<URLHistory[]> {
    const { limit, offset, orderBy = "count", order = "desc" } = options;

    const urlsHistory = await this.prisma.uRLHistory.findMany({
      take: limit,
      skip: offset,
      orderBy: { [orderBy]: order },
    });

    return urlsHistory.map((urlHistory) =>
      URLsHistoryMapper.toDomain(urlHistory),
    );
  }
}
