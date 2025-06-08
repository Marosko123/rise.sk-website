'use client';

import emailjs from '@emailjs/browser';
import { useState } from 'react';

export default function TestEmail() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const testEmailJS = async () => {
    setLoading(true);
    setResult('Testing...');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setResult('❌ Environment variables missing');
      setLoading(false);
      return;
    }

    try {
      const templateParams = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        phone: '+1234567890',
        message: 'This is a test message from the Rise website.',
        to_email: 'davarinskt@gmail.com',
        reply_to: 'test@example.com',
      };

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      setResult(`✅ Success! Response: ${JSON.stringify(response, null, 2)}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setResult(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>EmailJS Test Page</h1>
      <p>Environment Variables:</p>
      <ul>
        <li>
          Service ID:{' '}
          {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '❌ Missing'}
        </li>
        <li>
          Template ID:{' '}
          {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '❌ Missing'}
        </li>
        <li>
          Public Key:{' '}
          {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            ? '✅ Present'
            : '❌ Missing'}
        </li>
      </ul>

      <button
        onClick={testEmailJS}
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Testing...' : 'Test EmailJS'}
      </button>

      <pre
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        {result}
      </pre>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
        }}
      >
        <h3>Setup Instructions:</h3>
        <ol>
          <li>
            Go to{' '}
            <a href='https://www.emailjs.com/' target='_blank'>
              EmailJS.com
            </a>
          </li>
          <li>Create an account and verify email</li>
          <li>Add Email Service (Gmail) and connect davarinskt@gmail.com</li>
          <li>
            Create Email Template with variables: from_name, from_email, phone,
            message, reply_to
          </li>
          <li>
            Update .env.local with real Service ID, Template ID, and Public Key
          </li>
          <li>Test again</li>
        </ol>
      </div>
    </div>
  );
}
