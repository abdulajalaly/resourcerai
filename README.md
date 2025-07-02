# ResourcerAI

A directory of AI tools and a blog, built with Next.js 15, Sanity v4, TailwindCSS, and shadcn/ui.

## Features

- AI Tools directory with search, filters, likes, and categories
- Blog with author info, categories, and tags
- Responsive, modern UI with dark/light mode
- Sanity Studio for content management
- API routes for likes/views

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
```

### 3. Run Sanity Studio (first time)

```bash
cd sanity
npx sanity init --env production
npx sanity start
```

### 4. Run Next.js app

```bash
npm run dev
```

Visit:

- [http://localhost:3000](http://localhost:3000) — Next.js app
- [http://localhost:3333](http://localhost:3333) — Sanity Studio

## Folder Structure

- `/sanity` — Sanity Studio & schemas
- `/app` — Next.js app router pages & layouts
- `/components/ui` — shadcn/ui wrappers
- `/lib/sanity.ts` — Sanity client & queries
- `/pages/api` — API routes for views/likes

## Deployment

- Deploy Next.js to Vercel
- Use Sanity's hosted dataset

---

For more, see inline comments in code.
