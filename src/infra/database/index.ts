import { PrismaClient } from "@prisma/client";

export default class Prisma extends PrismaClient {
  constructor() {
    super();
  }
}
