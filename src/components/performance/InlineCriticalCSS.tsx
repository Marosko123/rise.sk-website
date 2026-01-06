/**
 * InlineCriticalCSS - Server component that inlines critical CSS
 * This eliminates CSS from the critical request chain, improving LCP
 * by allowing the browser to parse critical styles immediately with HTML
 *
 * The CSS is embedded as a constant string to ensure it works in all deployment
 * modes including Next.js standalone builds.
 */

// Critical CSS embedded directly - this ensures it's available in standalone builds
// Last updated: 2026-01-06 - sync with src/app/critical.css when making changes
const CRITICAL_CSS = `
:root{--background:#1a1a1a;--foreground:#fff;--secondary:#1e293b;--accent:#64748b;--neutral-light:#f1f5f9;--neutral-dark:#94a3b8;--border:#334155;--glass:rgb(255 255 255 / 10%)}
:root,:root[data-theme="gradient"]{--primary:#DAB549;--primary-dark:#8B6723;--primary-darker:#6A4C1A;--primary-light:#FEFBD8;--glow:#DAB549}
:root[data-theme="bronze"]{--primary:#b09155;--primary-dark:#9a7f4b;--primary-darker:#8b7355;--primary-light:#c9a66b;--glow:#b09155}
:root[data-theme="gold1"]{--primary:#ffd700;--primary-dark:#e6c200;--primary-darker:#ccad00;--primary-light:#ffe44d;--glow:#ffd700}
:root[data-theme="gold2"]{--primary:#d4af37;--primary-dark:#b8991f;--primary-darker:#9d8419;--primary-light:#e6c84d;--glow:#d4af37}
:root[data-theme="gold3"]{--primary:#ffcc33;--primary-dark:#e6b71f;--primary-darker:#cca31a;--primary-light:#ffdb66;--glow:#ffcc33}
@media(prefers-color-scheme:dark){:root{--background:#1a1a1a;--foreground:#fff;--secondary:#1e293b;--border:#334155;--neutral-dark:#94a3b8;--accent:#64748b}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:5rem}
body{background:var(--background);color:var(--foreground);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;overflow-x:hidden;margin:0}
@supports(padding-bottom:env(safe-area-inset-bottom)){.safe-bottom{padding-bottom:env(safe-area-inset-bottom)}}
.glass{background:var(--glass);backdrop-filter:blur(20px);border:1px solid rgb(255 255 255 / 20%)}
.hero-gradient{background:radial-gradient(ellipse at top,rgb(176 145 85 / 15%) 0%,transparent 50%),radial-gradient(ellipse at bottom,rgb(154 127 75 / 10%) 0%,transparent 50%),var(--background)}
.gradient-text{background:linear-gradient(-45deg,var(--primary),var(--primary-light),var(--primary-dark),var(--primary-light));background-size:400% 400%;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
[data-theme="gradient"] .gradient-text{background:linear-gradient(45deg,#FEFBD8 0%,#DAB549 25%,#8B6723 50%,#DAB549 75%,#FEFBD8 100%);background-size:200% auto;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
:focus-visible{outline:2px solid var(--primary);outline-offset:2px;border-radius:4px}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
.loading-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:var(--background)}
.loaded .loading-screen{display:none}
`;

export default function InlineCriticalCSS() {
  return (
    <style
      data-critical="true"
      dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }}
    />
  );
}
