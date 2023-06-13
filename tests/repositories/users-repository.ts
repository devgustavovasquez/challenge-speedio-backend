import User from "../../src/app/domain/user";
import UsersRepository from "../../src/app/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async save(User: User) {
    this.users.push(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((User) => User.email === email);
  }
}
