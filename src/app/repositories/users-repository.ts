import User from "../domain/user";

export default interface UsersRepository {
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
}
