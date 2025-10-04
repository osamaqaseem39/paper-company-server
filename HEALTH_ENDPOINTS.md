# Health Endpoints Documentation

This document describes the health monitoring endpoints available in the Paper Company API.

## Endpoints

### 1. General Health Check
**GET** `/health`

Returns comprehensive health status information including database connectivity, memory usage, and application metrics.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345,
  "version": "1.0.0",
  "environment": "production",
  "database": {
    "status": "connected",
    "responseTime": 15
  },
  "memory": {
    "used": 123456789,
    "total": 1073741824,
    "percentage": 11.5
  }
}
```

### 2. Simple Ping
**GET** `/health/ping`

Simple endpoint that returns a pong response. Useful for basic connectivity checks.

**Response:**
```json
{
  "message": "pong",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Readiness Probe
**GET** `/health/ready`

Kubernetes readiness probe endpoint. Checks if the application is ready to serve traffic.

**Response:**
```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "memory": "ok"
  }
}
```

### 4. Liveness Probe
**GET** `/health/live`

Kubernetes liveness probe endpoint. Checks if the application is alive and running.

**Response:**
```json
{
  "status": "alive",
  "uptime": 12345
}
```

## Usage Examples

### Basic Health Check
```bash
curl http://localhost:3001/health
```

### Ping Test
```bash
curl http://localhost:3001/health/ping
```

### Kubernetes Probes
```bash
# Readiness probe
curl http://localhost:3001/health/ready

# Liveness probe
curl http://localhost:3001/health/live
```

## Monitoring Integration

These endpoints can be integrated with various monitoring tools:

- **Prometheus**: Use `/health` for detailed metrics
- **Kubernetes**: Use `/health/ready` and `/health/live` for pod health checks
- **Load Balancers**: Use `/health/ping` for basic health checks
- **APM Tools**: Use `/health` for comprehensive application monitoring

## Status Codes

- **200**: Application is healthy
- **503**: Application is not ready (readiness probe only)
- **500**: Application has critical issues

## Configuration

The health endpoints use the following configuration from environment variables:

- `APP_VERSION`: Application version (default: "1.0.0")
- `APP_ENVIRONMENT`: Environment name (default: "development")

## Database Health Check

The database health check performs a ping operation to MongoDB and measures response time. If the database is unreachable, the status will be marked as "disconnected".

## Memory Monitoring

Memory usage is calculated as a percentage of total system memory. A warning is issued if memory usage exceeds 90%.
