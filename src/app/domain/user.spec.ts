import User from "./user";

describe("User", () => {
  let sut: User;
  const props = {
    name: "Example User",
    email: "example@email.com",
    password: "examplePassword",
    updatedAt: new Date(),
  };

  beforeEach(() => {
    sut = new User(props);
  });

  it("should have correct initial values", () => {
    expect(sut.id).toBeDefined();
    expect(sut.name).toBe(props.name);
    expect(sut.email).toBe(props.email);
    expect(sut.password).toBe(props.password);
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it("should be able to create a new user with custom id", () => {
    const id = "customId";

    sut = new User(props, id);

    expect(sut.id).toBe(id);
  });

  it("should be able to create a new user with createdAt", () => {
    const createdAt = new Date();

    sut = new User({ ...props, createdAt });

    expect(sut.createdAt).toBe(createdAt);
  });

  it("should change name correctly", () => {
    const newName = "newName";
    const previousUpdatedAt = sut.updatedAt;

    sut.setName(newName);

    expect(sut.name).toBe(newName);
    expect(sut.updatedAt).not.toBe(previousUpdatedAt);
  });

  it("should throw error when changing name with invalid name", () => {
    const newName = "";

    expect(() => {
      sut.setName(newName);
    }).toThrow();
  });

  it("should change password correctly", () => {
    const newPassword = "newPassword";
    const previousUpdatedAt = sut.updatedAt;

    sut.setPassword(newPassword);

    expect(sut.password).toBe(newPassword);
    expect(sut.updatedAt).not.toBe(previousUpdatedAt);
  });

  it("should throw error when changing name with invalid password", () => {
    const newPassword = "";

    expect(() => {
      sut.setPassword(newPassword);
    }).toThrow();
  });
});
