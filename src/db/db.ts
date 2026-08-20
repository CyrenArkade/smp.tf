import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "@/db/schema"
import { getColumns, SQL, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { CockroachTable } from "drizzle-orm/cockroach-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

const db = drizzle(process.env.DB_PATH!, { relations });
db.run(sql`PRAGMA busy_timeout = 10000;`)
export default db

// from drizzle upsert docs
export function updateCols<
T extends PgTable | CockroachTable | SQLiteTable,
Q extends keyof T['_']['columns']
>(
  table: T,
  columns: Q[],
) {
  const cls = getColumns(table);

  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);

    return acc;
  }, {} as Record<Q, SQL>);
}

