import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * InlineCriticalCSS - Server component that inlines critical CSS
 * This eliminates CSS from the critical request chain, improving LCP
 * by allowing the browser to parse critical styles immediately with HTML
 */
export default function InlineCriticalCSS() {
  // Read critical CSS at build time
  const criticalCSS = readFileSync(
    join(process.cwd(), 'src/app/critical.css'),
    'utf-8'
  );

  // Minify by removing comments and extra whitespace
  const minified = criticalCSS
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around punctuation
    .trim();

  return (
    <style
      data-critical="true"
      dangerouslySetInnerHTML={{ __html: minified }}
    />
  );
}
