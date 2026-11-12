import { Controller, Get } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
}

@Controller('health')
export class HealthController {
  /**
   * Liveness probe: answers as long as the process serves HTTP. It does not
   * touch the database on purpose, so a database outage does not make the
   * orchestrator restart a healthy application.
   */
  @Get()
  check(): HealthStatus {
    return { status: 'ok' };
  }
}
