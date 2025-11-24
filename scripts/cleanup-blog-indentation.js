
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src/content/blog');

const targetSlugs = [
  'responzivny-web-2025',
  '10-prvkov-kvalitneho-webu',
  'rychlost-webu-a-dopyty',
  'automatizovane-leady-z-webu',
  'webovy-portal-vs-excel',
  'softver-na-mieru-a-dovera',
  'vyber-it-partnera',
  'outsourcing-vyvoja-webu',
  'kedy-mobilnu-aplikaciu',
  'prepojenie-aplikacie-webu-seo',
  'ai-chat-zvysenie-dopytov',
  'mobilny-eshop-buducnost',
  'rychlost-doveryhodnost-ux-eshopu',
  'seo-pre-eshop-organika'
];

function cleanupIndentation(str) {
  if (!str) return str;
  const lines = str.split('\n');

  const newLines = lines.map((line, index) => {
    // The first line was already trimmed in the previous script, so it has 0 indent.
    // Subsequent lines have 2 spaces indent.
    // We want to remove those 2 spaces.
    if (index === 0) return line;
    if (line.startsWith('  ')) {
      return line.substring(2);
    }
    return line;
  });

  return newLines.join('\n');
}

targetSlugs.forEach(slug => {
  const filePath = path.join(blogDir, slug, 'index.mdx');
  if (!fs.existsSync(filePath)) return;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(fileContent);

  if (parsed.data.content_sk) {
    const original = parsed.data.content_sk;
    const cleaned = cleanupIndentation(original);

    if (original !== cleaned) {
      parsed.data.content_sk = cleaned;
      const newContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, newContent);
      console.log(`Cleaned indentation for ${slug}`);
    } else {
        console.log(`No cleanup needed for ${slug}`);
    }
  }
});
