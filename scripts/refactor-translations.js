const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../messages/sk.json'),
  path.join(__dirname, '../messages/en.json')
];

files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (content.testYourBusiness && content.testYourBusiness.modules) {
    // Move modules to top-level Audit key
    content.Audit = content.testYourBusiness.modules;
    delete content.testYourBusiness.modules;

    fs.writeFileSync(file, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Skipping ${file} (structure not found)`);
  }
});
