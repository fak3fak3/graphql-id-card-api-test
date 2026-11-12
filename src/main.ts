import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Let Nest run OnModuleDestroy/OnApplicationShutdown hooks on SIGTERM/SIGINT,
  // so the process stops cleanly when the container is stopped.
  app.enableShutdownHooks();

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });

  await app.listen(port);
  Logger.log(`Application is listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
