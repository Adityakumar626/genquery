import { sql } from "drizzle-orm";
import { text, sqliteTable, integer, real } from "drizzle-orm/sqlite-core";

// Products Table

export const productTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Sales Table

export const salesTable = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id")
    .notNull()
    .references(() => productTable.id),
  quantity: text("quantity").notNull(),
  total_amount: real("total_amount").notNull(),
  sale_date: text("sale_date").default(sql`CURRENT_TIMESTAMP`),
  costumer_name: text("costumer_name").notNull(),
  region: text("region").notNull(),
});
