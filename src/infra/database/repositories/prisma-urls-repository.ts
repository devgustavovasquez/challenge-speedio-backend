import { PrismaClient } from "@prisma/client";
import URL from "../../../app/domain/url";
import URLsRepository from "../../../app/repositories/urls-repository";
import URLsMapper from "../mappers/urls-mapper";

export default class PrismaUrlsRepository implements URLsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: URL): Promise<void> {
    const url = URLsMapper.toPrisma(data);

    await this.prisma.uRL.create({ data: url });
  }

  async delete(url: URL): Promise<void> {
    await this.prisma.uRL.delete({ where: { id: url.id } });
  }

  async findByShort(short: string): Promise<URL | undefined> {
    const url = await this.prisma.uRL.findUnique({ where: { short } });

    if (!url) return undefined;

    return URLsMapper.toDomain(url);
  }

  async getLastURL(): Promise<URL | undefined> {
    const url = await this.prisma.uRL.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!url) return undefined;

    return URLsMapper.toDomain(url);
  }

  async findById(id: string): Promise<URL | undefined> {
    const url = await this.prisma.uRL.findUnique({ where: { id } });

    if (!url) return undefined;

    return URLsMapper.toDomain(url);
  }

  async listByUser(userId: string): Promise<URL[]> {
    const urls = await this.prisma.uRL.findMany({ where: { userId } });

    return urls.map(URLsMapper.toDomain);
  }
}
