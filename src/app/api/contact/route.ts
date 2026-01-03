import sgMail from '@sendgrid/mail';
import { NextRequest, NextResponse } from 'next/server';

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - allows various formats
const PHONE_REGEX = /^[\d\s+\-().]{7,20}$/;

// Sanitize text to prevent XSS in emails
function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim()
    .substring(0, 500); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, service } = await request.json();

    // Validate required fields
    if (!email || !phone || !service) {
      return NextResponse.json(
        { error: 'Email, phone number, and service selection are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (typeof phone !== 'string' || !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format.' },
        { status: 400 }
      );
    }

    // Validate service selection (optional - allow free text but sanitize)
    const sanitizedService = sanitizeText(String(service));
    const sanitizedEmail = sanitizeText(email);
    const sanitizedPhone = sanitizeText(phone);

    // Validate environment variables
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: 'Email service is not configured properly.' },
        { status: 500 }
      );
    }

    if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
      return NextResponse.json(
        { error: 'Email addresses are not configured properly.' },
        { status: 500 }
      );
    }

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Email content
    const emailContent = {
      to: process.env.TO_EMAIL, // dadvolvarino@gmail.com
      from: process.env.FROM_EMAIL, // Must be verified in SendGrid
      subject: `New Service Request from ${sanitizedEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">New Service Request</h2>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${sanitizedPhone}</p>
            <p style="margin: 5px 0;"><strong>Service Requested:</strong> ${sanitizedService}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>This request was sent from the Rise website contact form.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
      // Plain text version
      text: `
New Service Request

Email: ${sanitizedEmail}
Phone: ${sanitizedPhone}
Service: ${sanitizedService}

Sent from Rise website contact form
Timestamp: ${new Date().toISOString()}
      `,
    };

    // Send email using SendGrid
    await sgMail.send(emailContent);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    // More specific error handling for SendGrid
    if (error && typeof error === 'object' && 'response' in error) {
      const _sgError = error as { response?: { body?: unknown } };
      // Log error details for debugging (in production, use proper logging)
    }

    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
