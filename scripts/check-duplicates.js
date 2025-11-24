
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src/content/blog');
const slugs = fs.readdirSync(blogDir);

const skSlugs = {};
const enSlugs = {};

slugs.forEach(dir => {
  const filePath = path.join(blogDir, dir, 'index.mdx');
  if (!fs.existsSync(filePath)) return;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = matter(fileContent).data;

  const skSlug = data.slug_sk || dir;
  const enSlug = dir; // Assuming directory name is en slug

  if (skSlugs[skSlug]) {
    console.log(`DUPLICATE SK SLUG: ${skSlug} in ${dir} and ${skSlugs[skSlug]}`);
  } else {
    skSlugs[skSlug] = dir;
  }

  if (enSlugs[enSlug]) {
    console.log(`DUPLICATE EN SLUG: ${enSlug} in ${dir} and ${enSlugs[enSlug]}`);
  } else {
    enSlugs[enSlug] = dir;
  }
});

console.log('Check complete.');
