import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'node:path'

loadEnv({path: path.resolve(process.cwd(), '../.env.local'), override: true})
loadEnv({path: path.resolve(process.cwd(), '../.env'), override: true})

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9g7x9be2'
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN?.trim().replace(/^['"]|['"]$/g, '')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-07-01',
  token: token || undefined,
  useCdn: false,
})

type Tool = {_id: string; name?: string; slug?: string}

async function checkDuplicates() {
  console.log('Fetching all tools...\n')
  const tools = await client.fetch<Tool[]>(`*[_type == "tool"]{ _id, name, "slug": slug.current }`)
  console.log(`Total tools: ${tools.length}\n`)

  const byId = new Map<string, Tool[]>()
  const bySlug = new Map<string, Tool[]>()
  const byName = new Map<string, Tool[]>()

  for (const t of tools) {
    const id = t._id ?? ''
    const slug = (t.slug ?? '').toString()
    const name = (t.name ?? '').trim()

    if (!byId.has(id)) byId.set(id, [])
    byId.get(id)!.push(t)

    if (slug) {
      if (!bySlug.has(slug)) bySlug.set(slug, [])
      bySlug.get(slug)!.push(t)
    }

    if (name) {
      if (!byName.has(name)) byName.set(name, [])
      byName.get(name)!.push(t)
    }
  }

  let hasDupes = false

  const dupes = byId.get('') ?? []
  if (dupes.length) {
    console.log(`⚠️  ${dupes.length} tool(s) with missing _id`)
    hasDupes = true
  }

  for (const [id, list] of byId) {
    if (!id || list.length <= 1) continue
    hasDupes = true
    console.log(`\n🔴 Duplicate _id: "${id}" (${list.length} docs)`)
    list.forEach((t) => console.log(`   - ${t._id} | ${t.name}`))
  }

  for (const [slug, list] of bySlug) {
    if (list.length <= 1) continue
    hasDupes = true
    console.log(`\n🔴 Duplicate slug: "${slug}" (${list.length} docs)`)
    list.forEach((t) => console.log(`   - ${t._id} | ${t.name}`))
  }

  for (const [name, list] of byName) {
    if (list.length <= 1) continue
    hasDupes = true
    console.log(`\n🟡 Duplicate name: "${name}" (${list.length} docs)`)
    list.forEach((t) => console.log(`   - ${t._id} | slug: ${t.slug}`))
  }

  if (!hasDupes) {
    console.log('✅ No duplicates found (by _id, slug, or name).')
    return
  }

  console.log('\n---')
  console.log('Summary: fix duplicate slugs first (they break /tools/[slug] URLs).')
  console.log('Duplicate names are OK if you use unique slugs (e.g. name-2).')
}

checkDuplicates().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
