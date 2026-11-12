import type { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * Records the SQL statements Prisma sends, so a test can assert how many
 * queries a GraphQL operation costs. Subscribe once per PrismaService.
 */
export class QueryRecorder {
  private statements: string[] = [];

  constructor(prisma: PrismaService) {
    prisma.$on('query', (event) => {
      this.statements.push(event.query);
    });
  }

  /** Runs `operation` and returns the SQL statements it caused. */
  async record(operation: () => Promise<unknown>): Promise<string[]> {
    this.statements = [];
    await operation();

    return [...this.statements];
  }
}
