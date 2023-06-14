import { randomUUID } from "node:crypto";
import { Replace } from "../../../utils";

export type URLHistoryProps = {
  title: string;
  url: string;
  count: number;
  lastAccessedAt: Date;
  firstAccessedAt: Date;
};

export default class URLHistory {
  private _id: string;
  private props: URLHistoryProps;

  constructor(
    props: Replace<URLHistoryProps, { firstAccessedAt?: Date }>,
    id?: string,
  ) {
    this.props = {
      ...props,
      firstAccessedAt: props.firstAccessedAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get url(): string {
    return this.props.url;
  }

  get count(): number {
    return this.props.count;
  }

  markAsAccessed(): void {
    this.props.count += 1;
    this.props.lastAccessedAt = new Date();
  }

  get lastAccessedAt(): Date {
    return this.props.lastAccessedAt;
  }

  get firstAccessedAt(): Date {
    return this.props.firstAccessedAt;
  }
}
