import { randomUUID } from "node:crypto";
import { Replace } from "../../../utils";

export type URLProps = {
  userId?: string;
  title: string;
  origin: string;
  short: string;
  updatedAt: Date;
  createdAt: Date;
};

export default class URL {
  private _id: string;
  private props: URLProps;

  constructor(
    props: Replace<URLProps, { createdAt?: Date; short?: string }>,
    id?: string,
  ) {
    this.props = {
      ...props,
      short: props.short || "not-set",
      createdAt: props.createdAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  setTitle(title: string) {
    if (title.trim() === "") {
      throw new Error("Invalid title");
    }

    this.props.updatedAt = new Date();
    this.props.title = title;
  }

  get origin(): string {
    return this.props.origin;
  }

  setOrigin(origin: string) {
    if (origin.trim() === "") {
      throw new Error("Invalid origin");
    }

    this.props.updatedAt = new Date();
    this.props.origin = origin;
  }

  get short(): string {
    if (this.props.short === "not-set") {
      throw new Error("Short not set");
    }

    return this.props.short;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
