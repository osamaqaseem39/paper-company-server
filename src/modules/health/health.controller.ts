import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Health status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 12345 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'production' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
            responseTime: { type: 'number', example: 15 }
          }
        },
        memory: {
          type: 'object',
          properties: {
            used: { type: 'number', example: 123456789 },
            total: { type: 'number', example: 1073741824 },
            percentage: { type: 'number', example: 11.5 }
          }
        }
      }
    }
  })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pong response',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async ping() {
    return this.healthService.ping();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application is ready to serve traffic',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'ok' },
            memory: { type: 'string', example: 'ok' }
          }
        }
      }
    }
  })
  async readiness() {
    return this.healthService.getReadinessStatus();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'alive' },
        uptime: { type: 'number', example: 12345 }
      }
    }
  })
  async liveness() {
    return this.healthService.getLivenessStatus();
  }
}
