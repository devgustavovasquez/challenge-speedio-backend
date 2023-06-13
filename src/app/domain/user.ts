import { randomUUID } from "node:crypto";
import { Replace } from "../../../utils";

export type UserProps = {
  name: string;
  email: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
};

export default class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  setName(name: string) {
    if (name.trim() === "") {
      throw new Error("Invalid name");
    }

    this.props.updatedAt = new Date();
    this.props.name = name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  setPassword(password: string) {
    if (password.trim() === "") {
      throw new Error("Invalid password");
    }

    this.props.updatedAt = new Date();
    this.props.password = password;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
