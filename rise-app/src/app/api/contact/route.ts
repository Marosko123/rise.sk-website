import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

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

    // Validate environment variables
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured properly.' },
        { status: 500 }
      );
    }

    if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
      console.error('FROM_EMAIL or TO_EMAIL is not configured');
      return NextResponse.json(
        { error: 'Email addresses are not configured properly.' },
        { status: 500 }
      );
    }

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);    // Email content
    const emailContent = {
      to: process.env.TO_EMAIL, // dadvolvarino@gmail.com
      from: process.env.FROM_EMAIL, // Must be verified in SendGrid
      subject: `New Service Request from ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">New Service Request</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Service Requested:</strong> ${service}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>This request was sent from the Rise website contact form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      // Plain text version
      text: `
New Service Request

Email: ${email}
Phone: ${phone}
Service: ${service}

Sent from Rise website contact form
Timestamp: ${new Date().toLocaleString()}
      `,
    };

    // Send email using SendGrid
    await sgMail.send(emailContent);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
      // More specific error handling for SendGrid
    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as { response?: { body?: unknown } };
      console.error('SendGrid error details:', sgError.response?.body);
    }
    
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
