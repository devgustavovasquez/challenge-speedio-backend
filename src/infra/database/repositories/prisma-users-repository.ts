import { PrismaClient } from "@prisma/client";
import UsersRepository from "../../../app/repositories/users-repository";
import User from "../../../app/domain/user";
import UsersMapper from "../mappers/users-mapper";

export default class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: User): Promise<void> {
    const user = UsersMapper.toPrisma(data);

    await this.prisma.user.create({ data: user });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return undefined;

    return UsersMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return undefined;

    return UsersMapper.toDomain(user);
  }
}
