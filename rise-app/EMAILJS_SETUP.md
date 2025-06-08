# EmailJS Setup Guide

This guide will walk you through setting up EmailJS for the Rise website contact form.

## Prerequisites

- EmailJS account (free tier available)
- Access to the email account you want to receive messages at (davarinskt@gmail.com)

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID** (e.g., `service_abc123`)

### Gmail Setup
If using Gmail for davarinskt@gmail.com:
1. Select Gmail as service
2. Click **Connect Account**
3. Sign in to davarinskt@gmail.com
4. Grant necessary permissions

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Submission - Rise Website

From: {{from_name}} ({{from_email}})
Phone: {{phone}}

Message:
{{message}}

---
This message was sent via the Rise website contact form.
Reply to: {{reply_to}}
```

4. Save the template and note the **Template ID** (e.g., `template_xyz789`)

### Template Variables
The contact form sends these variables:
- `from_name`: User's email address (used as name)
- `from_email`: User's email address
- `phone`: User's phone number
- `message`: User's message
- `to_email`: Target email (davarinskt@gmail.com)
- `reply_to`: User's email address for replies

## Step 4: Get Public Key

1. Go to **Account** settings
2. Find your **Public Key** (e.g., `user_abcdef123456`)
3. This is safe to use in frontend code

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your EmailJS credentials:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. For production (Vercel), add these as environment variables in your Vercel dashboard

## Step 6: Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the contact section
3. Fill out the form with test data
4. Submit and check if email is received at davarinskt@gmail.com

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Check if Public Key is correct
   - Verify template ID exists

2. **Template Not Found**
   - Ensure Template ID is correct
   - Check template is published/active

3. **Service Error**
   - Verify Service ID is correct
   - Check email service connection

4. **No Email Received**
   - Check spam folder
   - Verify template configuration
   - Check EmailJS dashboard for delivery logs

### Testing EmailJS Directly

You can test EmailJS from browser console:
```javascript
emailjs.send(
  'your_service_id',
  'your_template_id',
  {
    from_name: 'Test User',
    from_email: 'test@example.com',
    phone: '+1234567890',
    message: 'Test message',
    to_email: 'davarinskt@gmail.com',
    reply_to: 'test@example.com'
  },
  'your_public_key'
);
```

## Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add the three EmailJS variables

2. Redeploy the application

## Security Notes

- EmailJS Public Key is safe for frontend use
- All actual email sending happens on EmailJS servers
- No sensitive credentials are exposed in the client

## Alternative: Custom Domain Email

If you want emails to come from @rise.sk:
1. Set up email hosting for rise.sk domain
2. Configure EmailJS with the custom email service
3. Update template to use rise.sk email addresses

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: Available through their dashboard