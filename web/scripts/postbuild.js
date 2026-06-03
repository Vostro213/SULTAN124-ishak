import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '../dist')
const root = join(__dirname, '../..')

// SPA routing على GitHub Pages
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log('✓ Created dist/404.html')

// مجلد docs/ — GitHub Pages: Branch → /docs
const docsDir = join(root, 'docs')
if (existsSync(docsDir)) rmSync(docsDir, { recursive: true })
cpSync(dist, docsDir, { recursive: true })
console.log('✓ Copied build → docs/')

// جذر المستودع — GitHub Pages: Branch → / (root)
copyFileSync(join(dist, 'index.html'), join(root, 'index.html'))
copyFileSync(join(dist, '404.html'), join(root, '404.html'))

const assetsSrc = join(dist, 'assets')
const assetsDest = join(root, 'assets')
if (existsSync(assetsSrc)) {
  if (existsSync(assetsDest)) rmSync(assetsDest, { recursive: true })
  cpSync(assetsSrc, assetsDest, { recursive: true })
  console.log('✓ Copied index.html + assets/ → repo root')
}

console.log('')
console.log('GitHub Pages جاهز — ارفع index.html و docs/ و assets/')
