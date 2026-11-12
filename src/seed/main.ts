import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { seedDatabase } from './seed.js';

/**
 * Entry point of `prisma db seed` (see prisma.config.ts). A standalone script:
 * it does not boot the Nest application, only a Prisma Client.
 */
async function main(): Promise<void> {
  const logger = new Logger('Seed');
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed the database');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    await seedDatabase(prisma);
    logger.log('Database seeded');
  } finally {
    await prisma.$disconnect();
  }
}

await main();
