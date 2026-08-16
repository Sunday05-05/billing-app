import mysql, { type Pool } from "mysql2/promise";
import { z } from "zod";

const databaseEnvironmentSchema = z.object({
  MYSQL_HOST: z.string().min(1),
  MYSQL_PORT: z.coerce.number().int().positive(),
  MYSQL_USER: z.string().min(1),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string().min(1),
  MYSQL_SSL: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

const databaseEnvironment = databaseEnvironmentSchema.parse({
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_SSL: process.env.MYSQL_SSL,
});

const globalForDatabase = globalThis as typeof globalThis & {
  mysqlPool?: Pool;
};

export const db =
  globalForDatabase.mysqlPool ??
  mysql.createPool({
    host: databaseEnvironment.MYSQL_HOST,
    port: databaseEnvironment.MYSQL_PORT,
    user: databaseEnvironment.MYSQL_USER,
    password: databaseEnvironment.MYSQL_PASSWORD,
    database: databaseEnvironment.MYSQL_DATABASE,
    ssl: databaseEnvironment.MYSQL_SSL
      ? {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        }
      : undefined,
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.mysqlPool = db;
}
