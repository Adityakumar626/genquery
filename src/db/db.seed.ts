import { db } from "./db"; // import your drizzle db instance
import { productTable, salesTable } from "./schema"; // import your schema

export async function seed() {
  console.log("Seeding DATA 🌱");

  // Insert Products
  const products = await db
    .insert(productTable)
    .values([
      {
        name: "Wireless Ergonomic Mouse",
        category: "Electronics",
        price: 29.99,
        stock: 150,
      },
      {
        name: "Mechanical Gaming Keyboard",
        category: "Electronics",
        price: 89.99,
        stock: 75,
      },
      {
        name: "Ergonomic Office Chair",
        category: "Furniture",
        price: 249.99,
        stock: 20,
      },
      {
        name: "Electric Standing Desk",
        category: "Furniture",
        price: 399.99,
        stock: 12,
      },
      {
        name: "USB-C Multiport Hub",
        category: "Accessories",
        price: 19.99,
        stock: 200,
      },
    ])
    .returning();

  // Insert Sales (quantity is kept as a string to match your schema)
  await db.insert(salesTable).values([
    {
      product_id: 1, // Wireless Ergonomic Mouse
      quantity: "2",
      total_amount: 59.98,
      costumer_name: "Alice Smith",
      region: "North America",
      sale_date: "2026-06-01 14:20:00",
    },
    {
      product_id: 2, // Mechanical Gaming Keyboard
      quantity: "1",
      total_amount: 89.99,
      costumer_name: "Bob Jones",
      region: "Europe",
      sale_date: "2026-06-02 09:15:30",
    },
    {
      product_id: 3, // Ergonomic Office Chair
      quantity: "1",
      total_amount: 249.99,
      costumer_name: "Charlie Brown",
      region: "Asia-Pacific",
      sale_date: "2026-06-03 18:45:10",
    },
    {
      product_id: 5, // USB-C Multiport Hub
      quantity: "3",
      total_amount: 59.97,
      costumer_name: "Diana Prince",
      region: "North America",
      sale_date: "2026-06-04 11:05:00",
    },
  ]);
}

seed();
