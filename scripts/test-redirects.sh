#!/bin/bash

echo "🧪 Testing URL redirects..."
echo "=========================="

# Test function
test_redirect() {
    local url=$1
    local expected_code=$2
    local description=$3
    
    echo "Testing: $description"
    echo "URL: $url"
    
    result=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "$url")
    echo "Result: $result"
    echo "---"
}

# Base URL - change this for production testing
BASE_URL="https://rise.sk"

echo "🌐 Testing production redirects on $BASE_URL"
echo ""

# Test www to non-www redirect
test_redirect "https://www.rise.sk/" "301" "WWW to non-WWW redirect"
test_redirect "https://www.rise.sk/vyvoj" "301" "WWW to non-WWW with path"

# Test Slovak prefix removal
test_redirect "$BASE_URL/sk/vyvoj" "308" "Remove /sk/ prefix"
test_redirect "$BASE_URL/sk/sluzby" "308" "Remove /sk/ prefix with services"

# Test English to Slovak redirects
test_redirect "$BASE_URL/development" "308" "English to Slovak - development"
test_redirect "$BASE_URL/services" "308" "English to Slovak - services" 
test_redirect "$BASE_URL/contact" "308" "English to Slovak - contact"

# Test final URLs work (should return 200)
echo "🏠 Testing final destination URLs (should return 200):"
test_redirect "$BASE_URL/" "200" "Homepage"
test_redirect "$BASE_URL/vyvoj" "200" "Development page"
test_redirect "$BASE_URL/sluzby" "200" "Services page"
test_redirect "$BASE_URL/kontakt" "200" "Contact page"

echo "✅ Testing complete!"
