#!/usr/bin/env node

/**
 * Placeholder Detection Script
 * 
 * Scans source files for placeholder content and unverified claims.
 * Exits with non-zero status if any are found.
 * 
 * Run as part of pre-build checks and CI workflow.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Patterns to search for (case-insensitive)
// Owner can remove a word from this list once the claim is verified with documentation
const PLACEHOLDER_PATTERNS = [
  /placeholder\s*=\s*["'][^"']*\bplaceholder\b/i, // Only match placeholder="...placeholder..." not input placeholder attribute
  /this section contains/i,
  /the business owner will/i,
  /to be specified/i,
  /to be provided/i,
  /\bTBD\b/i,
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\blorem\s+ipsum/i,
  /\[service area/i,
  /\[phone/i,
  /\[email/i,
  /\[.*to be.*\]/i,
  /your text here/i,
  /coming soon/i,
  /example\.com/i,
  /\+?1?234567890/i,
  // Unverified claims - remove from list once owner verifies
  /\blicensed\b/i,
  /\binsured\b/i,
  /\bcertified\b/i,
  /\bguarantee\b/i,
  /\bwarrant(y|ies)\b/i,
  /\b24\/7\b/i,
  /\bsame-day\b/i,
  /\bfree estimate/i,
  /\byears of (experience|business)\b/i,
];

// Directories/files to ignore
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/docs/**',
  '**/README.md',
  '**/CHANGELOG.md',
  '**/*.md', // Ignore all markdown files in docs/guides
  '**/PHASE-*.md',
  '**/LAUNCH-*.md',
  '**/PROJECT-*.md',
  '**/DEPLOYMENT*.md',
  '**/CONTENT-UPDATE-GUIDE.md',
  '**/DELIVERABLES.md',
  '**/MARKETING-STRATEGY.md',
  '**/START-HERE.md',
  '**/QUICK-START.md',
  '**/POST-DEPLOYMENT-VERIFICATION.md',
  '**/WHITE-SCREEN-FIX-REPORT.md',
  '**/BUTTON-*.md',
  '**/GITHUB-PAGES-*.md',
  '**/*.log',
  '**/package-lock.json',
  '**/knowledge-base.txt', // Template file for owner
  '**/📖-READ-ME-FIRST.txt',
  '**/scripts/check-placeholders.js', // This script itself
  '**/test-scroll.cjs',
]

// Files to scan
const SCAN_PATTERNS = [
  'src/**/*.{js,jsx,ts,tsx}',
  'index.html',
  'public/**/*.{html,xml,txt,json}',
  'api/**/*.{js,ts}',
]

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const findings = []

  lines.forEach((line, index) => {
    PLACEHOLDER_PATTERNS.forEach((pattern) => {
      if (pattern.test(line)) {
        findings.push({
          file: path.relative(projectRoot, filePath),
          line: index + 1,
          content: line.trim().substring(0, 100),
          pattern: pattern.toString(),
        })
      }
    })
  })

  return findings
}

async function main() {
  console.log('🔍 Scanning for placeholder content...\n')

  const allFindings = []

  for (const pattern of SCAN_PATTERNS) {
    const files = await glob(pattern, {
      cwd: projectRoot,
      ignore: IGNORE_PATTERNS,
      absolute: true,
    })

    for (const file of files) {
      const findings = scanFile(file)
      if (findings.length > 0) {
        allFindings.push(...findings)
      }
    }
  }

  if (allFindings.length === 0) {
    console.log('✅ No placeholders found!\n')
    process.exit(0)
  }

  console.error(`❌ Found ${allFindings.length} placeholder(s):\n`)

  allFindings.forEach(({ file, line, content, pattern }) => {
    console.error(`${file}:${line}`)
    console.error(`  Pattern: ${pattern}`)
    console.error(`  Content: ${content}`)
    console.error('')
  })

  console.error('Please remove all placeholders before building.\n')
  process.exit(1)
}

main().catch((error) => {
  console.error('Error running placeholder check:', error)
  process.exit(1)
})
