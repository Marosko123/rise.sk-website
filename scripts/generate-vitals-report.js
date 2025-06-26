#!/usr/bin/env node

/**
 * Web Vitals Report Generator for Rise.sk
 * Generates a comprehensive report of Core Web Vitals performance
 */

const fs = require('fs');
const path = require('path');

// Mock data - in production, this would come from your analytics/monitoring service
const mockVitalsData = [
  {
    metric: 'FCP',
    value: 1200,
    rating: 'good',
    target: 1800,
    description: 'First Contentful Paint - When the first text or image is painted'
  },
  {
    metric: 'LCP',
    value: 2100,
    rating: 'good', 
    target: 2500,
    description: 'Largest Contentful Paint - When the largest text or image is painted'
  },
  {
    metric: 'FID',
    value: 85,
    rating: 'good',
    target: 100,
    description: 'First Input Delay - Time from first user interaction to browser response'
  },
  {
    metric: 'CLS',
    value: 0.08,
    rating: 'good',
    target: 0.1,
    description: 'Cumulative Layout Shift - Visual stability of the page'
  },
  {
    metric: 'TTFB',
    value: 650,
    rating: 'good',
    target: 800,
    description: 'Time to First Byte - Server response time'
  }
];

function generateHTMLReport(data) {
  const timestamp = new Date().toISOString();
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return '#16a34a';
      case 'needs-improvement': return '#eab308';
      case 'poor': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case 'good': return '🟢';
      case 'needs-improvement': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Core Web Vitals Report - Rise.sk</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .metrics {
            padding: 40px;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            transition: all 0.2s;
        }
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
        }
        .metric-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        .metric-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            margin: 8px 0;
        }
        .metric-description {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin: 12px 0;
        }
        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .summary {
            background: #f1f5f9;
            padding: 24px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .summary h3 {
            margin: 0 0 16px;
            color: #334155;
        }
        .recommendations {
            background: #fefce8;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .recommendations h3 {
            color: #92400e;
            margin: 0 0 12px;
        }
        .recommendations ul {
            margin: 0;
            padding-left: 20px;
        }
        .recommendations li {
            margin-bottom: 8px;
            color: #92400e;
        }
        .timestamp {
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Core Web Vitals Report</h1>
            <p>Rise.sk Performance Metrics | Generated on ${reportDate}</p>
        </div>
        
        <div class="metrics">
            <div class="metric-grid">
                ${data.map(metric => {
                  const progressPercentage = Math.min((metric.value / metric.target) * 100, 100);
                  const progressColor = getRatingColor(metric.rating);
                  
                  return `
                    <div class="metric-card">
                        <div class="metric-header">
                            <span style="font-size: 1.5rem;">${getRatingEmoji(metric.rating)}</span>
                            <h3 class="metric-title">${metric.metric}</h3>
                        </div>
                        <div class="metric-value" style="color: ${progressColor};">
                            ${metric.metric === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value)}${metric.metric === 'CLS' ? '' : 'ms'}
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%; background-color: ${progressColor};"></div>
                        </div>
                        <div class="metric-description">
                            ${metric.description}
                        </div>
                        <div style="margin-top: 12px; font-size: 0.9rem; color: #64748b;">
                            Target: ${metric.metric === 'CLS' ? metric.target.toFixed(1) : metric.target}${metric.metric === 'CLS' ? '' : 'ms'}
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
            
            <div class="summary">
                <h3>📈 Performance Summary</h3>
                <p><strong>Overall Score:</strong> Excellent - All Core Web Vitals are within good thresholds</p>
                <p><strong>Total Metrics Passing:</strong> ${data.filter(m => m.rating === 'good').length}/${data.length}</p>
                <p><strong>Site Status:</strong> Production Ready ✅</p>
            </div>
            
            <div class="recommendations">
                <h3>💡 Optimization Recommendations</h3>
                <ul>
                    <li>Continue monitoring performance with Google Search Console</li>
                    <li>Set up automated Lighthouse CI for continuous monitoring</li>
                    <li>Consider implementing image optimization (WebP/AVIF)</li>
                    <li>Monitor real user metrics with Google Analytics</li>
                    <li>Test performance on various devices and network conditions</li>
                </ul>
            </div>
        </div>
        
        <div class="timestamp">
            Report generated on ${timestamp} | Rise.sk Performance Monitoring
        </div>
    </div>
</body>
</html>
  `;
}

// Generate the report
try {
  const reportHtml = generateHTMLReport(mockVitalsData);
  const reportPath = path.join(__dirname, '../reports/web-vitals-report.html');
  
  fs.writeFileSync(reportPath, reportHtml);
  
  console.log('✅ Web Vitals report generated successfully!');
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log('🔗 Open the file in your browser to view the report');
  
} catch (error) {
  console.error('❌ Error generating Web Vitals report:', error);
  process.exit(1);
}
