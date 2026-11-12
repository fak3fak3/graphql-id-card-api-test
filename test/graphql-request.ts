import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';

export interface GraphQLResponse<TData> {
  data: TData | null;
  errors?: Array<{
    message: string;
    path?: Array<string | number>;
    extensions?: Record<string, unknown>;
  }>;
}

/** Sends a GraphQL operation over HTTP, the way a real client would. */
export async function executeGraphQL<TData>(
  app: INestApplication<App>,
  query: string,
  /** Apollo answers 400 when the request itself is invalid. */
  expectedStatus = 200,
): Promise<GraphQLResponse<TData>> {
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send({ query })
    .expect(expectedStatus);

  return response.body as GraphQLResponse<TData>;
}
