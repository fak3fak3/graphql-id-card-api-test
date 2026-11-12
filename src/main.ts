import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Let Nest run OnModuleDestroy/OnApplicationShutdown hooks on SIGTERM/SIGINT,
  // so the process stops cleanly when the container is stopped.
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Application is listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
