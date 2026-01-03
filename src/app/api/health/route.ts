import { NextResponse } from 'next/server';

// Cache health check for 60 seconds
export const revalidate = 60;

export async function GET() {
  const response = NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
  
  // Add cache headers
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  
  return response;
}
