'use client';

import Script from 'next/script';

export default function GoogleTagManager({ nonce }: { nonce?: string }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-script" strategy="lazyOnload" nonce={nonce}>
        {`
          // Use requestIdleCallback to defer GTM initialization
          function initGTM() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            var f = document.getElementsByTagName('script')[0];
            var j = document.createElement('script');
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=${gtmId}';
            f.parentNode.insertBefore(j, f);
          }

          if ('requestIdleCallback' in window) {
            requestIdleCallback(initGTM, { timeout: 3000 });
          } else {
            setTimeout(initGTM, 100);
          }
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
