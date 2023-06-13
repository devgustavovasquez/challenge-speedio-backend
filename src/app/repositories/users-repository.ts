import User from "../domain/user";

export default interface UsersRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
}
