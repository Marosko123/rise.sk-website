# SEO Testing Commands

## Test sitemap
curl -s http://localhost:3000/sitemap.xml | head -20

## Test robots.txt  
curl -s http://localhost:3000/robots.txt

## Test structured data
curl -s http://localhost:3000/en | grep -A 10 -B 10 'application/ld+json'

## Test hreflang
curl -s http://localhost:3000/en | grep 'hreflang'

## Test meta tags
curl -s http://localhost:3000/en | grep -E '<title>|<meta.*description|<meta.*keywords'

