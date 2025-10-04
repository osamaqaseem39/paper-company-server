// Simple test script for health endpoints
const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testHealthEndpoints() {
  console.log('🏥 Testing Health Endpoints...\n');
  
  const endpoints = [
    { path: '/health', name: 'General Health Check' },
    { path: '/health/ping', name: 'Ping Endpoint' },
    { path: '/health/ready', name: 'Readiness Probe' },
    { path: '/health/live', name: 'Liveness Probe' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const result = await makeRequest(endpoint.path);
      
      if (result.status === 200) {
        console.log(`✅ ${endpoint.name}: OK`);
        console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
      } else {
        console.log(`❌ ${endpoint.name}: Failed (Status: ${result.status})`);
        console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}\n`);
    }
  }
}

// Run the test
testHealthEndpoints().catch(console.error);
