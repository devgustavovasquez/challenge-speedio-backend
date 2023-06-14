import User, { UserProps } from "../../src/app/domain/user";

type Override = Partial<UserProps>;

export function makeUser(override: Override = {}) {
  return new User({
    name: "John Doe",
    email: "johndoe@email.com",
    password: "hashedPassword",
    updatedAt: new Date(),
    ...override,
  });
}
