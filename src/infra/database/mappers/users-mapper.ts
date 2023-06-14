import User from "../../../app/domain/user";
import { User as UserPrisma } from "@prisma/client";

export default class UsersMapper {
  static toDomain(user: UserPrisma): User {
    return new User(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }

  static toPrisma(user: User): UserPrisma {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
