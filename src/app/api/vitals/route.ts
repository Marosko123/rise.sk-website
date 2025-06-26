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

export async function POST(request: NextRequest) {
  try {
    const data: WebVitalsData = await request.json();
    
    // Validate the data
    if (!data.metric || !data.url) {
      return NextResponse.json(
        { error: 'Invalid vitals data' },
        { status: 400 }
      );
    }

    // In production, you would send this to your analytics service
    // For now, we'll log it and could store in a database
    
    const vitalsEntry = {
      ...data,
      timestamp: new Date(data.timestamp).toISOString(),
      // Add any additional metadata
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown',
    };

    // Here you could:
    // 1. Store in database (PostgreSQL, MongoDB, etc.)
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Send to monitoring service (DataDog, New Relic, etc.)
    // 4. Store in logging service (Winston, etc.)
    
    // For development, log the vitals
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Web Vitals Received:', {
        metric: data.metric.name,
        value: data.metric.value,
        rating: data.metric.rating,
        url: data.url,
        timestamp: vitalsEntry.timestamp,
      });
    }

    // TODO: Implement actual storage/forwarding logic
    // Example implementations:
    
    // 1. Send to Google Analytics Measurement Protocol
    // if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    //   await sendToGoogleAnalytics(vitalsEntry);
    // }
    
    // 2. Store in database
    // await storeInDatabase(vitalsEntry);
    
    // 3. Send to external monitoring service
    // await sendToMonitoringService(vitalsEntry);

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing web vitals:', error);
    
    return NextResponse.json(
      { error: 'Failed to process vitals data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return basic info about the vitals endpoint
  return NextResponse.json({
    endpoint: '/api/vitals',
    description: 'Core Web Vitals collection endpoint',
    methods: ['POST'],
    version: '1.0.0',
  });
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
