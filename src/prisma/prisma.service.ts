import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Env } from '../config/env.validation.js';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * The application's single Prisma Client, bound to the Nest lifecycle.
 * Only repositories are expected to inject it.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService<Env, true>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL', { infer: true }),
      }),
    });
  }

  /**
   * Prisma connects lazily, and with a driver adapter `$connect()` does not
   * open a connection either. A real query during bootstrap turns an
   * unreachable database into a startup failure instead of a failed request.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$queryRaw`SELECT 1`;
    } catch (error) {
      throw new Error(
        'Database is unreachable: check DATABASE_URL and that PostgreSQL is running',
        { cause: error },
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
