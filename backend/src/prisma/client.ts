import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Create Neon adapter with connection string
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;
