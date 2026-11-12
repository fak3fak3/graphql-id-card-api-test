import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Env } from '../config/env.validation.js';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

type ClientOptions = Prisma.PrismaClientOptions & {
  log: [{ emit: 'event'; level: 'query' }];
};

/**
 * The application's single Prisma Client, bound to the Nest lifecycle.
 * Only repositories are expected to inject it.
 */
@Injectable()
export class PrismaService
  extends PrismaClient<ClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('Prisma');

  constructor(config: ConfigService<Env, true>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL', { infer: true }),
      }),
      // Queries are emitted as events rather than printed by Prisma, so they
      // can go through the Nest logger and be counted in tests.
      log: [{ emit: 'event', level: 'query' }],
    });

    if (config.get('DATABASE_LOG_QUERIES', { infer: true })) {
      this.$on('query', (event) => {
        this.logger.log(`${event.query} — ${event.duration.toFixed(1)}ms`);
      });
    }
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
