# SendGrid Email Setup Guide

Your website is now configured to use SendGrid for sending emails. Follow these steps to complete the setup:

## 🚀 Step 1: Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address
4. Complete the onboarding process

## 🔑 Step 2: Generate API Key

1. Log into your SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and select:
   - **Mail Send** → Full Access
5. Copy the generated API key (you won't see it again!)

## ✉️ Step 3: Verify Sender Email

**Option A: Single Sender Verification (Easiest)**
1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Add your email address (the one that will send emails)
4. Check your email and click the verification link

**Option B: Domain Authentication (Recommended for production)**
1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Add your domain and follow DNS setup instructions

## 🔧 Step 4: Update Environment Variables

Update your `.env.local` file with your actual values:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
FROM_EMAIL=your-verified-email@yourdomain.com
TO_EMAIL=dadvolvarino@gmail.com
```

**Important Notes:**
- `FROM_EMAIL` must be the email you verified in SendGrid
- `TO_EMAIL` is where contact form submissions will be sent
- Keep your API key secret and never commit it to version control

## 🧪 Step 5: Test Your Setup

1. Start your development server: `npx next dev`
2. Go to your website contact form
3. Submit a test message
4. Check `dadvolvarino@gmail.com` for the email

## 📋 Troubleshooting

**Common Issues:**

1. **"Email service not configured"**
   - Make sure `SENDGRID_API_KEY` is set in `.env.local`
   - Restart your development server after adding env variables

2. **"Sender email not verified"**
   - Verify your FROM_EMAIL address in SendGrid dashboard
   - Wait a few minutes after verification

3. **"API key invalid"**
   - Double-check your API key in SendGrid dashboard
   - Make sure you copied the full key including "SG." prefix

4. **Emails not received**
   - Check spam/junk folder
   - Verify TO_EMAIL address is correct
   - Check SendGrid activity logs in dashboard

## 🌐 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables to your hosting platform
2. Consider domain authentication for better deliverability
3. Monitor your SendGrid usage and upgrade plan if needed

## 📈 SendGrid Dashboard Features

- **Activity Feed**: See all sent emails
- **Statistics**: Track open rates, clicks, etc.
- **Templates**: Create reusable email templates
- **Suppressions**: Manage bounces and unsubscribes

Your contact form is now professionally configured with SendGrid! 🎉
