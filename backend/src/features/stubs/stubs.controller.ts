import { Controller, Post, Get } from '@nestjs/common';
import { StubsService } from './stubs.service';

@Controller('api/v1/stubs')
export class StubsController {
  constructor(private readonly stubsService: StubsService) {}

  @Post('seed')
  seed() {
    return this.stubsService.seedDemoData();
  }

  @Get('health')
  health() {
    return { status: 'ok', modulo: 'stubs-a-c' };
  }
}
