import { NextRequest, NextResponse } from 'next/server';

interface WebVitalsData {
  metric: {
    id: string;
    name: string;
    value: number;
    label: 'web-vital' | 'custom';
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  url: string;
  timestamp: number;
  userAgent: string;
}

// Simple in-memory rate limiter for vitals endpoint
// On Hetzner (single server), this works reliably
const VITALS_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const VITALS_RATE_LIMIT_MAX = 30; // 30 vitals reports per minute per IP
const vitalsIpMap = new Map<string, { count: number; resetTime: number }>();

function checkVitalsRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = vitalsIpMap.get(ip);

  // Cleanup old entries periodically
  if (vitalsIpMap.size > 1000) {
    for (const [key, data] of vitalsIpMap.entries()) {
      if (now > data.resetTime) vitalsIpMap.delete(key);
    }
  }

  if (!record || now > record.resetTime) {
    vitalsIpMap.set(ip, { count: 1, resetTime: now + VITALS_RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= VITALS_RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  // Get client IP - Cloudflare provides this header
  const ip = request.headers.get('cf-connecting-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             'unknown';

  // Rate limit check
  if (!checkVitalsRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const data: WebVitalsData = await request.json();
    
    // Validate the data
    if (!data.metric || !data.url || typeof data.metric.name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid vitals data' },
        { status: 400 }
      );
    }

    // Validate metric name is one of the known vitals
    const validMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'];
    if (!validMetrics.includes(data.metric.name)) {
      return NextResponse.json(
        { error: 'Invalid metric name' },
        { status: 400 }
      );
    }

    // For development, log the vitals
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Web Vitals:', {
        metric: data.metric.name,
        value: Math.round(data.metric.value),
        rating: data.metric.rating,
      });
    }

    // In production, vitals are already sent to Google Analytics via gtag
    // This endpoint serves as a backup/custom analytics if needed

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to process vitals data' },
      { status: 500 }
    );
  }
}

// Disabled GET to not expose endpoint info
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

// Example function for sending to Google Analytics Measurement Protocol
// async function sendToGoogleAnalytics(vitalsEntry: any) {
//   const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
//   const apiSecret = process.env.GA_MEASUREMENT_PROTOCOL_SECRET;
  
//   if (!measurementId || !apiSecret) return;
  
//   const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  
//   await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify({
//       client_id: vitalsEntry.metric.id,
//       events: [{
//         name: 'web_vitals',
//         params: {
//           metric_name: vitalsEntry.metric.name,
//           metric_value: vitalsEntry.metric.value,
//           metric_rating: vitalsEntry.metric.rating,
//           page_location: vitalsEntry.url,
//         }
//       }]
//     })
//   });
// }
