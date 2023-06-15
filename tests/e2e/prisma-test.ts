import type { Config } from "@jest/types";
import { exec } from "node:child_process";
import dotenv from "dotenv";
import { TestEnvironment } from "jest-environment-node";
import util from "node:util";
import { Client } from "pg";
import crypto from "node:crypto";

dotenv.config({ path: ".env.testing" });

const execSync = util.promisify(exec);

const prismaBinary = "./node_modules/.bin/prisma";

type ConfigConstructor = {
  globalConfig: Config.GlobalConfig;
  projectConfig: Config.ProjectConfig;
};

export default class PrismaTestEnvironment extends TestEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: ConfigConstructor) {
    super(config, {
      console: console,
      docblockPragmas: {},
      testPath: "",
    });

    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASS;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;

    this.schema = `test_${crypto.randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;
  }

  async setup() {
    await execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();

    return super.teardown();
  }
}
