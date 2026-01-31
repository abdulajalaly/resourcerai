import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'node:path'

// Load env from repo root if present (so running inside /sanity works)
loadEnv({path: path.resolve(process.cwd(), '../.env.local'), override: true})
loadEnv({path: path.resolve(process.cwd(), '../.env'), override: true})

// NOTE:
// We intentionally do NOT use `getCliClient()` here because it sometimes fails to
// resolve CLI config in certain environments (e.g. Node 20+ / tsx / CI).
// Instead, we create a client explicitly from env/config values.
const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9g7x9be2'
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const rawToken =
  process.env.SANITY_API_TOKEN || process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN
const token = rawToken?.trim().replace(/^['"]|['"]$/g, '')

// Safe debug output (no secrets)
// eslint-disable-next-line no-console
console.log(`Using projectId=${projectId} dataset=${dataset}`)
// eslint-disable-next-line no-console
console.log(
  `Token loaded=${Boolean(token)} ${token ? `(len=${token.length}, prefix=${token.slice(0, 4)})` : ''}`,
)

if (!token) {
  // eslint-disable-next-line no-console
  console.error('Missing SANITY_API_TOKEN. Set it in your shell env before running this script.')
  // eslint-disable-next-line no-console
  console.error('PowerShell example:')
  // eslint-disable-next-line no-console
  console.error('$env:SANITY_API_TOKEN=\"<your token>\"; npx tsx scripts/migrate-tools.ts')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-07-01',
  token,
  useCdn: false,
})

async function migrateTools() {
  // eslint-disable-next-line no-console
  console.log('🚀 Starting migration from aitool to tool...')

  const aitools = await client.fetch(`*[_type == "aitool"] {
    _id,
    _rev,
    name,
    slug,
    description,
    logo,
    category->{_id, _ref, title, slug},
    tags,
    websiteUrl,
    views,
    likes,
    price
  }`)

  // eslint-disable-next-line no-console
  console.log(`Found ${aitools.length} tools to migrate`)

  for (const [index, aitool] of (aitools as any[]).entries()) {
    // eslint-disable-next-line no-console
    console.log(`\n[${index + 1}/${aitools.length}] Migrating: ${aitool.name}`)

    try {
      const newTool: any = {
        _type: 'tool',
        name: aitool.name,
        slug: aitool.slug,
        websiteUrl: aitool.websiteUrl,
        logo: aitool.logo,
        status: 'active',

        shortDescription: extractShortDescription(aitool.description),

        properties: [
          {
            _type: 'property',
            _key: generateKey(),
            key: 'pricing',
            displayName: 'Pricing',
            type: 'select',
            value: (aitool.price || 'unknown').toLowerCase(),
            filterPriority: 1,
            showInCard: true,
            icon: '💰',
          },
          ...(aitool.category?.slug?.current
            ? [
                {
                  _type: 'property',
                  _key: generateKey(),
                  key: 'category',
                  displayName: 'Category',
                  type: 'select',
                  value: aitool.category.slug.current,
                  filterPriority: 1,
                  showInCard: true,
                  icon: '📁',
                },
              ]
            : []),
          ...(Array.isArray(aitool.tags) && aitool.tags.length > 0
            ? [
                {
                  _type: 'property',
                  _key: generateKey(),
                  key: 'tags',
                  displayName: 'Tags',
                  type: 'multiselect',
                  value: aitool.tags.join(','),
                  filterPriority: 2,
                  showInCard: false,
                  icon: '🏷️',
                },
              ]
            : []),
        ],

        content: Array.isArray(aitool.description)
          ? [
              {
                _type: 'richTextBlock',
                _key: generateKey(),
                heading: 'About',
                content: aitool.description,
              },
            ]
          : [],

        legacyCategory: aitool.category?._id
          ? {_type: 'reference', _ref: aitool.category._id}
          : undefined,
        legacyTags: aitool.tags,
        legacyDescription: aitool.description,

        metadata: {
          verification: 'listed',
          views: aitool.views || 0,
          clicks: 0,
          likes: aitool.likes || 0,
          featured: false,
        },
      }

      await client.create(newTool)
      // eslint-disable-next-line no-console
      console.log(`✓ Created new tool: ${aitool.name}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`✗ Error migrating ${aitool.name}:`, error)
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ Migration complete!')
  // eslint-disable-next-line no-console
  console.log(
    '⚠️  Note: Old aitool documents still exist. Review new tools before deleting old ones.',
  )
}

function extractShortDescription(descriptionBlocks: any[]): string {
  if (!descriptionBlocks || descriptionBlocks.length === 0) return ''

  for (const block of descriptionBlocks) {
    if (block._type === 'block' && block.children) {
      const text = block.children
        .map((child: any) => child.text)
        .join(' ')
        .trim()

      if (text.length > 120) return text.substring(0, 117) + '...'
      return text
    }
  }

  return ''
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}

migrateTools().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})
