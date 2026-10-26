// Standalone Phase 4 Component Library Verification Script
// Run via: node Frontend/src/components/__tests__/verify-library.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commonDir = path.resolve(__dirname, '../common');

const expectedFiles = [
  'Button.tsx',
  'IconButton.tsx',
  'Input.tsx',
  'Textarea.tsx',
  'Select.tsx',
  'Checkbox.tsx',
  'Radio.tsx',
  'Toggle.tsx',
  'SearchInput.tsx',
  'Card.tsx',
  'StatCard.tsx',
  'Badge.tsx',
  'ScoreRing.tsx',
  'FileDropzone.tsx',
  'Modal.tsx',
  'ConfirmDialog.tsx',
  'LoadingSkeleton.tsx',
  'Spinner.tsx',
  'ProgressBar.tsx',
  'Toast.tsx',
  'AlertBanner.tsx',
  'EmptyState.tsx',
  'Table.tsx',
  'Tabs.tsx',
  'Breadcrumbs.tsx',
  'Tooltip.tsx',
  'Avatar.tsx',
  'Pagination.tsx',
  'index.ts',
];

console.log('🔍 [Phase 4] Verifying Reusable Component Library Files...');

let missingCount = 0;
for (const file of expectedFiles) {
  const filePath = path.join(commonDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing component file: ${file}`);
    missingCount++;
  } else {
    console.log(`✅ Verified file exists: components/common/${file}`);
  }
}

// Check root index.ts
const rootIndex = path.resolve(__dirname, '../index.ts');
if (!fs.existsSync(rootIndex)) {
  console.error('❌ Missing root components/index.ts');
  missingCount++;
} else {
  console.log('✅ Verified root barrel export: components/index.ts');
}

// Check showcase
const showcase = path.resolve(__dirname, '../ComponentShowcase.tsx');
if (!fs.existsSync(showcase)) {
  console.error('❌ Missing ComponentShowcase.tsx');
  missingCount++;
} else {
  console.log('✅ Verified ComponentShowcase.tsx');
}

if (missingCount === 0) {
  console.log('\n🎉 ALL 30 Phase 4 COMPONENT MODULES VERIFIED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error(`\n❌ Failed with ${missingCount} missing files.`);
  process.exit(1);
}
