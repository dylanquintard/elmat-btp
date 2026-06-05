import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
export const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export async function safeDbQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (isBuildPhase || !hasDatabaseUrl) return fallback;

  try {
    return await query();
  } catch (error) {
    if (isBuildPhase) return fallback;

    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("DATABASE_URL")) return fallback;
    throw error;
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
