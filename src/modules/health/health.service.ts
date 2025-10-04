import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async getHealthStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Check database connection
    const dbStatus = await this.checkDatabaseConnection();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      version: this.configService.get('app.version', '1.0.0'),
      environment: this.configService.get('app.environment', 'development'),
      database: {
        status: dbStatus.connected ? 'connected' : 'disconnected',
        responseTime: dbStatus.responseTime,
      },
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
    };
  }

  async ping() {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadinessStatus() {
    const dbStatus = await this.checkDatabaseConnection();
    const memoryUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const memoryPercentage = (memoryUsage.heapUsed / totalMemory) * 100;

    const checks = {
      database: dbStatus.connected ? 'ok' : 'error',
      memory: memoryPercentage < 90 ? 'ok' : 'warning',
    };

    const isReady = Object.values(checks).every(status => status === 'ok');

    return {
      status: isReady ? 'ready' : 'not ready',
      checks,
    };
  }

  async getLivenessStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    return {
      status: 'alive',
      uptime,
    };
  }

  private async checkDatabaseConnection(): Promise<{ connected: boolean; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      // Ping the database
      await this.connection.db.admin().ping();
      const responseTime = Date.now() - startTime;
      
      return {
        connected: true,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        connected: false,
        responseTime,
      };
    }
  }
}
