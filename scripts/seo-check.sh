#!/bin/bash

# SEO Validation Script for Rise.sk
# Run this script to validate key SEO elements

set -e  # Exit on any error
trap 'echo "❌ SEO check failed at line $LINENO"' ERR

echo "🚀 Rise.sk SEO Validation Script"
echo "================================"

BASE_URL="http://localhost:3000"
PROD_URL="https://rise.sk"

# Check if development server is running
echo ""
echo "📝 Checking development server..."
if timeout 10 curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo "✅ Development server is running at $BASE_URL"
    TEST_URL="$BASE_URL"
else
    echo "⚠️  Development server not running, testing production at $PROD_URL"
    TEST_URL="$PROD_URL"
fi

echo ""
echo "🔍 Testing SEO Elements..."
echo "=========================="

# Test meta tags
echo ""
echo "1. Meta Tags & Open Graph:"
echo "------------------------"
timeout 10 curl -s "$TEST_URL/en" | grep -E "(title>|meta name=\"description\"|meta property=\"og:)" | head -5 || echo "⚠️ Could not retrieve meta tags"

# Test structured data
echo ""
echo "2. Structured Data (JSON-LD):"
echo "----------------------------"
timeout 10 curl -s "$TEST_URL/en" | grep -A 10 "application/ld+json" | head -15 || echo "⚠️ Could not retrieve structured data"

# Test sitemap
echo ""
echo "3. Sitemap Availability:"
echo "----------------------"
if timeout 10 curl -s "$TEST_URL/sitemap.xml" | grep -q "<?xml"; then
    echo "✅ Sitemap is accessible and valid XML"
    timeout 10 curl -s "$TEST_URL/sitemap.xml" | grep -E "<url>|<loc>" | head -10 || echo "⚠️ Could not parse sitemap content"
else
    echo "❌ Sitemap not accessible or invalid"
fi

# Test robots.txt
echo ""
echo "4. Robots.txt:"
echo "-------------"
timeout 10 curl -s "$TEST_URL/robots.txt" || echo "⚠️ Could not retrieve robots.txt"

# Test language pages
echo ""
echo "5. Language Page Accessibility:"
echo "------------------------------"
PAGES=("" "/development" "/services" "/contact" "/portfolio" "/education")
LOCALES=("en" "sk")

for locale in "${LOCALES[@]}"; do
    echo "Testing $locale pages:"
    for page in "${PAGES[@]}"; do
        STATUS=$(timeout 10 curl -s -o /dev/null -w "%{http_code}" "$TEST_URL/$locale$page" 2>/dev/null || echo "000")
        if [ "$STATUS" = "200" ]; then
            echo "  ✅ /$locale$page - HTTP $STATUS"
        elif [ "$STATUS" = "000" ]; then
            echo "  ⚠️ /$locale$page - Connection timeout/failed"
        else
            echo "  ❌ /$locale$page - HTTP $STATUS"
        fi
    done
done

# Test Slovak localized routes
echo ""
echo "Slovak localized routes:"
SK_PAGES=("/vyvoj" "/sluzby" "/kontakt" "/vzdelavanie")
for page in "${SK_PAGES[@]}"; do
    STATUS=$(timeout 10 curl -s -o /dev/null -w "%{http_code}" "$TEST_URL/sk$page" 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
        echo "  ✅ /sk$page - HTTP $STATUS"
    elif [ "$STATUS" = "000" ]; then
        echo "  ⚠️ /sk$page - Connection timeout/failed"
    else
        echo "  ❌ /sk$page - HTTP $STATUS"
    fi
done

echo ""
echo "🎯 SEO Quick Tips:"
echo "=================="
echo "• Check Google Search Console for indexing status"
echo "• Monitor Core Web Vitals in PageSpeed Insights"
echo "• Validate structured data with Google's Rich Results Test"
echo "• Test mobile-friendliness with Google Mobile-Friendly Test"
echo "• Check hreflang implementation with hreflang testing tools"
echo ""
echo "📋 Next Steps:"
echo "============="
echo "• Add Google Search Console verification code"
echo "• Submit sitemap to Google Search Console"
echo "• Set up Google Analytics 4 tracking"
echo "• Monitor search performance and adjust meta descriptions"
echo ""
echo "✨ SEO validation complete!"
