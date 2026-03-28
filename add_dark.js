const fs = require('fs');
const path = require('path');

const mappings = {
  'bg-white': 'dark:bg-gray-900',
  'bg-gray-50': 'dark:bg-gray-800',
  'bg-gray-100': 'dark:bg-gray-800',
  'text-gray-900': 'dark:text-white',
  'text-gray-800': 'dark:text-gray-100',
  'text-gray-700': 'dark:text-gray-200',
  'text-gray-600': 'dark:text-gray-300',
  'text-gray-500': 'dark:text-gray-400',
  'text-gray-400': 'dark:text-gray-500',
  'border-gray-100': 'dark:border-gray-800',
  'border-gray-200': 'dark:border-gray-700',
  'border-gray-300': 'dark:border-gray-600',
  'hover:bg-gray-50': 'dark:hover:bg-gray-800',
  'hover:bg-gray-100': 'dark:hover:bg-gray-700',
  'bg-primary-50': 'dark:bg-primary-950/20',
  'from-primary-50': 'dark:from-gray-900',
  'via-white': 'dark:via-gray-900',
  'to-purple-50': 'dark:to-gray-900',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // For each mapping, replace the class with the original + dark class
  for (const [light, dark] of Object.entries(mappings)) {
    // Regex matches the light class surrounded by word boundaries or inside quotes
    // Ensure we don't duplicate the dark class if it's already there
    const regex = new RegExp(`(?<!dark:)\\b${light}\\b(?!\\s+${dark})`, 'g');
    content = content.replace(regex, `${light} ${dark}`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  if (dir.includes('node_modules') || dir.includes('.next')) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

traverseDir(path.join(process.cwd(), 'app'));
traverseDir(path.join(process.cwd(), 'components'));
