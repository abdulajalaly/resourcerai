import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'node:path'

// Load env from repo root
loadEnv({path: path.resolve(process.cwd(), '../.env.local'), override: true})
loadEnv({path: path.resolve(process.cwd(), '../.env'), override: true})

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9g7x9be2'
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('Missing SANITY_API_TOKEN. Set it in .env.local or shell env.')
  process.exit(1)
}

// Simple nanoid replacement
function nanoid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Simple slugify replacement
function slugify(str: string, _options?: any) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 1. CONFIGURATION
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// 2. YOUR DATA (Edit this part!)
// This is the "Human Readable" format. The script handles the hard part.
const toolsToImport = [
  {
    name: 'Gemini 3 Flash',
    website: 'https://gemini.google.com',
    tagline: "Google's fastest frontier model built for speed and multimodal efficiency.",
    filters: {
      pricing: 'freemium',
      category: 'chatbot',
      platforms: ['web', 'ios', 'android', 'api'],
    },
    content: {
      intro:
        'The latest lightweight frontier model from Google, optimized for high-volume tasks and massive context windows.',
      features: ['2M+ token context', 'Native multimodal (video/audio)', 'Real-time reasoning'],
      limitations: ['Safety filters can be strict', 'Rate limits on free tier'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard access']},
        {name: 'Advanced', price: '$20/mo', features: ['1M context', 'Priority'], highlight: true},
      ],
    },
    stats: {views: '1B+', likes: 'Top Tier', verified: 'tested'},
  },
  {
    name: 'ChatGPT-5 (o3)',
    website: 'https://chat.openai.com',
    tagline: "OpenAI's reasoning model that thinks before it speaks.",
    filters: {
      pricing: 'freemium',
      category: 'chatbot',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        "The flagship 'system 2' thinker from OpenAI, capable of complex autonomous workflows and deep problem solving.",
      features: ['Deep reasoning chain', 'Agentic capabilities', 'Integrated coding environment'],
      limitations: ['Slower inference time', 'High subscription cost for full speed'],
      pricing: [
        {name: 'Free', price: '$0', features: ['o3-mini access']},
        {name: 'Plus', price: '$20/mo', features: ['Full o3 access'], highlight: true},
      ],
    },
    stats: {views: '2B+', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Claude 3.5 Sonnet',
    website: 'https://claude.ai',
    tagline: 'The most human-like AI for writing and coding.',
    filters: {
      pricing: 'freemium',
      category: 'chatbot',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        "Anthropic's balanced model, widely regarded as the best for coding assistance and nuanced, natural writing.",
      features: ['Artifacts UI', 'Visual analysis', 'Large context'],
      limitations: ['Strict daily message limits', 'No web search integration'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Low limits']},
        {name: 'Pro', price: '$20/mo', features: ['5x usage', 'Projects'], highlight: true},
      ],
    },
    stats: {views: '500M+', likes: 'Dev Favorite', verified: 'tested'},
  },
  {
    name: 'Sora',
    website: 'https://openai.com/sora',
    tagline: 'Create realistic video from text instructions.',
    filters: {
      pricing: 'paid',
      category: 'video generation',
      platforms: ['web'],
    },
    content: {
      intro:
        "OpenAI's text-to-video model capable of generating complex camera motions and realistic physics.",
      features: ['1080p generation', '60-second clips', 'Physics simulation'],
      limitations: ['Currently lacks audio sync', 'High compute cost'],
      pricing: [
        {name: 'Pro', price: 'Included in Plus', features: ['Limited credits'], highlight: true},
      ],
    },
    stats: {views: 'Viral', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Veo 3',
    website: 'https://deepmind.google/technologies/veo',
    tagline: "Google's most capable video generation model.",
    filters: {
      pricing: 'freemium',
      category: 'video generation',
      platforms: ['web', 'youtube shorts'],
    },
    content: {
      intro:
        'A generative video model integrated into YouTube Shorts and creative tools, capable of 1080p+ resolution.',
      features: ['Filmmaker controls', 'Extended consistency', 'Masked editing'],
      limitations: ['Watermarked outputs', 'Geographical restrictions'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Watermarked']},
        {name: 'Premium', price: '$Sub', features: ['High res'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Trending', verified: 'tested'},
  },
  {
    name: 'Kling AI',
    website: 'https://kling.kuaishou.com',
    tagline: 'High-motion video generation with realistic human movement.',
    filters: {
      pricing: 'freemium',
      category: 'video generation',
      platforms: ['web'],
    },
    content: {
      intro:
        'A powerful video model from Kuaishou that rivals Sora in realistic motion and clip duration.',
      features: ['5s-10s clips', 'High framerate', 'Image-to-video'],
      limitations: ['Credit heavy', 'Server queues'],
      pricing: [
        {name: 'Free', price: 'Daily credits', features: ['Standard speed']},
        {name: 'Pro', price: '$10/mo', features: ['Fast lane'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Solid', verified: 'tested'},
  },
  {
    name: 'Runway Gen-3 Alpha',
    website: 'https://runwayml.com',
    tagline: 'Professional video generation and control tools.',
    filters: {
      pricing: 'paid',
      category: 'video generation',
      platforms: ['web', 'ios'],
    },
    content: {
      intro:
        'The preferred tool for professional editors, offering granular control over camera movement and style.',
      features: ['Motion brush', 'Director mode', 'Lip sync'],
      limitations: ['Expensive per second', 'Learning curve'],
      pricing: [
        {name: 'Standard', price: '$12/mo', features: ['625 credits']},
        {name: 'Unlimited', price: '$76/mo', features: ['Unlimited gen'], highlight: true},
      ],
    },
    stats: {views: 'Pro', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Pika 2.0',
    website: 'https://pika.art',
    tagline: 'Idea-to-video platform with sound effects.',
    filters: {
      pricing: 'freemium',
      category: 'video generation',
      platforms: ['web', 'discord'],
    },
    content: {
      intro:
        "Known for its 'Pikaffects' allowing you to squash, inflate, or melt objects in videos.",
      features: ['Sound effects', 'Lip sync', 'Modify region'],
      limitations: ['Cartoonish bias', 'Short duration'],
      pricing: [
        {name: 'Free', price: '$0', features: ['30 credits']},
        {name: 'Standard', price: '$10/mo', features: ['No watermark'], highlight: true},
      ],
    },
    stats: {views: 'Viral', likes: 'Fun', verified: 'tested'},
  },
  {
    name: 'Luma Dream Machine',
    website: 'https://lumalabs.ai',
    tagline: 'Fast, high-quality video generation.',
    filters: {
      pricing: 'freemium',
      category: 'video generation',
      platforms: ['web'],
    },
    content: {
      intro:
        'A transformer-based video model that is exceptionally fast at generating 5-second clips.',
      features: ['Keyframe control', 'Loop creation', 'Fast inference'],
      limitations: ['Morphing artifacts', 'Limited resolution'],
      pricing: [
        {name: 'Free', price: '$0', features: ['30 generations/mo']},
        {name: 'Standard', price: '$29/mo', features: ['120 generations'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'HeyGen',
    website: 'https://www.heygen.com',
    tagline: 'AI video generation with talking avatars.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro:
        'The leader in AI avatars for business, allowing users to clone their own face and voice for translation.',
      features: ['Video translation', 'Instant avatar', 'API access'],
      limitations: ['Expensive for high volume', 'Strict moderation'],
      pricing: [
        {name: 'Free', price: '$0', features: ['1 credit']},
        {name: 'Creator', price: '$24/mo', features: ['15 credits'], highlight: true},
      ],
    },
    stats: {views: 'Business', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Synthesia',
    website: 'https://www.synthesia.io',
    tagline: 'The #1 AI video creation platform for enterprise.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro: 'Focuses on corporate training and L&D videos with diverse stock avatars.',
      features: ['140+ Avatars', '120+ Languages', 'Screen recorder'],
      limitations: ['Less realistic than HeyGen', 'Personal plan limited'],
      pricing: [{name: 'Starter', price: '$22/mo', features: ['10 mins/mo'], highlight: true}],
    },
    stats: {views: 'Corporate', likes: 'Reliable', verified: 'tested'},
  },
  {
    name: 'Higgsfield',
    website: 'https://higgsfield.ai',
    tagline: 'Mobile-first video AI for social creators.',
    filters: {
      pricing: 'freemium',
      category: 'video generation',
      platforms: ['ios', 'android'],
    },
    content: {
      intro: 'Designed for TikTok/Reels creators to insert themselves into AI generated scenes.',
      features: ['Face lock', 'Motion copying', 'Vertical video'],
      limitations: ['Mobile only', 'Beta features'],
      pricing: [{name: 'Free', price: '$0', features: ['Watermarked']}],
    },
    stats: {views: 'Niche', likes: 'Rising', verified: 'tested'},
  },
  {
    name: 'Captions',
    website: 'https://www.captions.ai',
    tagline: 'The all-in-one AI camera and editor.',
    filters: {
      pricing: 'paid',
      category: 'video editing',
      platforms: ['ios', 'web'],
    },
    content: {
      intro: 'Automatically adds engaging captions, fixes eye contact, and removes filler words.',
      features: ['Eye Contact', 'AI Trim', 'Voiceover'],
      limitations: ['Desktop version is new', 'Subscription only'],
      pricing: [{name: 'Pro', price: '$10/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'Creator Fav', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Cursor',
    website: 'https://cursor.sh',
    tagline: 'The AI-first code editor.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['mac', 'windows', 'linux'],
    },
    content: {
      intro:
        "A fork of VS Code with native AI integration, allowing for 'Cmd+K' to generate code and chat with your codebase.",
      features: ['Codebase indexing', 'Copilot++', 'Privacy mode'],
      limitations: ['Requires own API key for heavy use', 'Bugs from rapid updates'],
      pricing: [
        {name: 'Hobby', price: '$0', features: ['Basic chat']},
        {name: 'Pro', price: '$20/mo', features: ['Unlimited GPT-4/Claude'], highlight: true},
      ],
    },
    stats: {views: 'Dev Cult', likes: 'Very High', verified: 'tested'},
  },
  {
    name: 'GitHub Copilot',
    website: 'https://github.com/features/copilot',
    tagline: 'Your AI pair programmer.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['vscode', 'visual studio', 'jetbrains'],
    },
    content: {
      intro:
        "The industry standard for code completion, now with 'Workspace' context to understand your whole project.",
      features: ['Ghost text', 'Chat in IDE', 'CLI assistance'],
      limitations: ['Can hallucinate libraries', 'Paid only'],
      pricing: [{name: 'Individual', price: '$10/mo', features: ['All features'], highlight: true}],
    },
    stats: {views: 'Standard', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Windsurf',
    website: 'https://codeium.com/windsurf',
    tagline: 'The first agentic IDE.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['mac', 'windows'],
    },
    content: {
      intro:
        "An editor that uses 'Flows' to not just write code, but run terminals and fix errors autonomously.",
      features: ['Deep context', 'Cascade flow', 'Agentic actions'],
      limitations: ['Newer ecosystem', 'Resource heavy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard model']},
        {name: 'Pro', price: '$15/mo', features: ['Premium models'], highlight: true},
      ],
    },
    stats: {views: 'Rising', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Bolt.new',
    website: 'https://bolt.new',
    tagline: 'Prompt to full-stack web app in the browser.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['web'],
    },
    content: {
      intro:
        'Allows you to build, run, and deploy full-stack applications (Next.js, etc.) entirely via chat.',
      features: ['Browser container', 'One-click deploy', 'Package installation'],
      limitations: ['Complex backends hard to debug', 'Token limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily limit']},
        {name: 'Pro', price: '$20/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Innovative', verified: 'tested'},
  },
  {
    name: 'Lovable',
    website: 'https://lovable.dev',
    tagline: 'Software development for the post-AI era.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['web'],
    },
    content: {
      intro:
        "Focuses on 'vibe coding'—building beautiful UIs and functional apps from high-level descriptions.",
      features: ['UI generation', 'Database integration', 'Figma import'],
      limitations: ['Paid only', 'Beta access'],
      pricing: [{name: 'Pro', price: '$20/mo', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Niche', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Replit Agent',
    website: 'https://replit.com',
    tagline: 'An AI developer that builds software from scratch.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro:
        "Replit's autonomous agent that can plan, write, and deploy applications with minimal human oversight.",
      features: ['Cloud hosting', 'Mobile coding', 'Agent planning'],
      limitations: ['Requires Replit Core', 'Can get stuck in loops'],
      pricing: [{name: 'Core', price: '$20/mo', features: ['Agent access'], highlight: true}],
    },
    stats: {views: 'Popular', likes: 'High', verified: 'tested'},
  },
  {
    name: 'v0.dev',
    website: 'https://v0.dev',
    tagline: 'Generate UI with simple text prompts.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['web'],
    },
    content: {
      intro: "Vercel's tool for generating copy-paste friendly React/Tailwind code.",
      features: ['Shadcn/UI support', 'Interactive preview', 'Version history'],
      limitations: ['Frontend only', 'No backend logic'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Public generations']},
        {name: 'Premium', price: '$20/mo', features: ['Private generations'], highlight: true},
      ],
    },
    stats: {views: 'Frontend', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Codeium',
    website: 'https://codeium.com',
    tagline: 'Free AI code completion for everyone.',
    filters: {
      pricing: 'free',
      category: 'coding',
      platforms: ['vscode', 'vim', 'jetbrains'],
    },
    content: {
      intro: 'A high-performance alternative to Copilot that is free for individual developers.',
      features: ['Fast autocomplete', 'Chat', '40+ languages'],
      limitations: ['Enterprise features paid', 'Slightly less context than Cursor'],
      pricing: [{name: 'Individual', price: '$0', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'Popular', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Notion AI',
    website: 'https://notion.so',
    tagline: 'Access the limitless power of AI, right inside Notion.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        'Integrated writing and Q&A assistant that can search and summarize your entire Notion workspace.',
      features: ['Q&A', 'Auto-fill tables', 'Writer'],
      limitations: ['Add-on cost', 'Context limited to Notion'],
      pricing: [{name: 'Add-on', price: '$10/mo', features: ['Unlimited AI'], highlight: true}],
    },
    stats: {views: 'Massive', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Perplexity',
    website: 'https://perplexity.ai',
    tagline: 'Where knowledge begins.',
    filters: {
      pricing: 'freemium',
      category: 'search',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro: 'A conversational search engine that provides cited answers using real-time web data.',
      features: ['Pro Search', 'File analysis', 'Model switching'],
      limitations: ['Can hallucinate citations (rare)', 'Pro limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic search']},
        {
          name: 'Pro',
          price: '$20/mo',
          features: ['Claude 3/GPT-4', 'Unlimited file upload'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'Top Tier', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'NotebookLM',
    website: 'https://notebooklm.google',
    tagline: 'An AI-first notebook, grounded in your sources.',
    filters: {
      pricing: 'free',
      category: 'productivity',
      platforms: ['web'],
    },
    content: {
      intro:
        "Google's RAG tool that instantly becomes an expert in your uploaded PDFs, creating audio overviews and summaries.",
      features: ['Audio Overview (Podcast)', 'Inline citations', 'Source grounding'],
      limitations: ['No web search (yet)', 'Google account required'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Viral', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Gamma',
    website: 'https://gamma.app',
    tagline: 'A new medium for presenting ideas.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web'],
    },
    content: {
      intro: 'Generates beautiful slide decks, documents, and websites from a simple prompt.',
      features: ['One-click styling', 'Embed interactive content', 'Export to PPT'],
      limitations: ['Slide layouts can be repetitive', 'Credit system'],
      pricing: [
        {name: 'Free', price: '$0', features: ['400 credits']},
        {name: 'Plus', price: '$10/mo', features: ['Remove branding'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Mem.ai',
    website: 'https://mem.ai',
    tagline: 'The self-organizing workspace.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web', 'ios'],
    },
    content: {
      intro: 'A note-taking app that uses AI to tag and connect your notes automatically.',
      features: ['Smart search', 'Related notes', 'Chat with notes'],
      limitations: ['Learning curve', 'Chat accuracy varies'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'X', price: '$10/mo', features: ['Smart features'], highlight: true},
      ],
    },
    stats: {views: 'Niche', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'Shortwave',
    website: 'https://shortwave.com',
    tagline: 'Intelligent email for high-performance teams.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        'Built on Gmail, it organizes emails into bundles and uses AI to summarize threads and draft replies.',
      features: ['AI Summaries', 'Drafting', 'Schedule send'],
      limitations: ['Gmail only', 'History limited on free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['90-day history']},
        {name: 'Pro', price: '$7/mo', features: ['Unlimited history'], highlight: true},
      ],
    },
    stats: {views: 'Growing', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Motion',
    website: 'https://usemotion.com',
    tagline: 'Stop managing your calendar.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web', 'ios'],
    },
    content: {
      intro: 'An AI project manager that automatically schedules tasks into your calendar gaps.',
      features: ['Auto-scheduling', 'Meeting booking', 'Project tracking'],
      limitations: ['Expensive', 'Can be overwhelming'],
      pricing: [{name: 'Individual', price: '$19/mo', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Love/Hate', verified: 'tested'},
  },
  {
    name: 'Reclaim.ai',
    website: 'https://reclaim.ai',
    tagline: 'Smart calendar for your work and life.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web'],
    },
    content: {
      intro:
        'Defends your time by blocking out slots for habits, tasks, and breaks on Google Calendar.',
      features: ['Habits', 'Smart 1:1s', 'Task syncing'],
      limitations: ['Google Calendar only', 'Team features paid'],
      pricing: [
        {name: 'Lite', price: '$0', features: ['3 habits']},
        {name: 'Starter', price: '$8/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Midjourney v7',
    website: 'https://midjourney.com',
    tagline: 'The gold standard for AI art.',
    filters: {
      pricing: 'paid',
      category: 'image generation',
      platforms: ['discord', 'web'],
    },
    content: {
      intro:
        'Known for the highest artistic quality and texture, accessible via Discord or their new web alpha.',
      features: ['Style reference', 'Character reference', 'Zoom/Pan'],
      limitations: ['Paid only', 'Discord interface (optional)'],
      pricing: [
        {name: 'Basic', price: '$10/mo', features: ['Fast hours']},
        {name: 'Standard', price: '$30/mo', features: ['Relax mode'], highlight: true},
      ],
    },
    stats: {views: 'Top', likes: 'Best Quality', verified: 'tested'},
  },
  {
    name: 'DALL-E 3',
    website: 'https://openai.com',
    tagline: 'Easy image generation integrated into ChatGPT.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web'],
    },
    content: {
      intro: 'Excellent at following complex prompt instructions and rendering text.',
      features: ['Native ChatGPT integration', 'Text rendering', 'Simple prompting'],
      limitations: ['"Photo-realism" often looks smooth/plastic', 'Strict filters'],
      pricing: [{name: 'Plus', price: '$20/mo', features: ['Included'], highlight: true}],
    },
    stats: {views: 'Massive', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Adobe Firefly 3',
    website: 'https://firefly.adobe.com',
    tagline: 'Safe commercial image generation.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web', 'photoshop'],
    },
    content: {
      intro:
        'Trained on Adobe Stock, making it safe for commercial work and integrated into Photoshop.',
      features: ['Generative Fill', 'Text effects', 'Structure reference'],
      limitations: ['Less artistic freedom than MJ', 'Credit system'],
      pricing: [
        {name: 'Free', price: '$0', features: ['25 credits']},
        {name: 'Premium', price: '$5/mo', features: ['100 credits'], highlight: true},
      ],
    },
    stats: {views: 'Pro', likes: 'Safe', verified: 'tested'},
  },
  {
    name: 'Leonardo.ai',
    website: 'https://leonardo.ai',
    tagline: 'Production-quality assets for creative projects.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web', 'ios'],
    },
    content: {
      intro:
        'A comprehensive suite offering fine-tuned models for gaming, anime, and realistic photography.',
      features: ['Real-time canvas', 'Texture generation', 'Motion'],
      limitations: ['Complex UI', 'Token consumption'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily tokens']},
        {name: 'Apprentice', price: '$10/mo', features: ['Faster'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Versatile', verified: 'tested'},
  },
  {
    name: 'Ideogram 2.0',
    website: 'https://ideogram.ai',
    tagline: 'Advanced text rendering in images.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web'],
    },
    content: {
      intro: 'Specializes in generating images with perfect typography, logos, and posters.',
      features: ['Perfect text', 'Magic Prompt', 'Design focus'],
      limitations: ['Lower resolution than MJ', 'Public gallery on free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10 prompts/day']},
        {name: 'Basic', price: '$7/mo', features: ['Private'], highlight: true},
      ],
    },
    stats: {views: 'Designers', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Magnific AI',
    website: 'https://magnific.ai',
    tagline: 'Imagine clearer.',
    filters: {
      pricing: 'paid',
      category: 'image tools',
      platforms: ['web'],
    },
    content: {
      intro:
        'An upscaler that hallucinates detail, turning low-res images into high-res masterpieces.',
      features: ['Creativity slider', 'HDR', 'Fractality'],
      limitations: ['Very expensive', 'Can alter faces'],
      pricing: [{name: 'Pro', price: '$39/mo', features: ['Standard tokens'], highlight: true}],
    },
    stats: {views: 'Pro', likes: 'Magic', verified: 'tested'},
  },
  {
    name: 'Canva Magic Studio',
    website: 'https://canva.com',
    tagline: 'A suite of AI tools for everyone.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro: 'Integrated AI tools within Canva for resizing, writing, and image generation.',
      features: ['Magic Switch', 'Magic Write', 'Background Remover'],
      limitations: ['Generic outputs', 'Pro required for best tools'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Pro', price: '$12/mo', features: ['Full suite'], highlight: true},
      ],
    },
    stats: {views: 'Massive', likes: 'Convenient', verified: 'tested'},
  },
  {
    name: 'Photoroom',
    website: 'https://photoroom.com',
    tagline: 'Create professional product photos.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro: 'Removes backgrounds and generates studio settings for product photography.',
      features: ['Instant backgrounds', 'Batch edit', 'Shadow AI'],
      limitations: ['Watermark on free', 'Best for products only'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard']},
        {name: 'Pro', price: '$9/mo', features: ['High res'], highlight: true},
      ],
    },
    stats: {views: 'Sellers', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Napkin.ai',
    website: 'https://napkin.ai',
    tagline: 'Visual storytelling for your docs.',
    filters: {
      pricing: 'free',
      category: 'design',
      platforms: ['web'],
    },
    content: {
      intro: 'Converts Google Docs text into clear, hand-drawn style diagrams and flowcharts.',
      features: ['Text-to-diagram', 'Style customization', 'Google Docs add-on'],
      limitations: ['Limited styles', 'Text heavy focus'],
      pricing: [{name: 'Beta', price: 'Free', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Viral', likes: 'Useful', verified: 'tested'},
  },
  {
    name: 'ElevenLabs',
    website: 'https://elevenlabs.io',
    tagline: 'The most realistic AI audio platform.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro: 'Industry-leading text-to-speech and voice cloning with emotional intonation.',
      features: ['Voice cloning', 'Dubbing studio', 'Sound effects'],
      limitations: ['Character limits on free', 'Cloning requires samples'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10k chars/mo']},
        {name: 'Starter', price: '$5/mo', features: ['30k chars', 'Cloning'], highlight: true},
      ],
    },
    stats: {views: 'Top', likes: 'Best Voice', verified: 'tested'},
  },
  {
    name: 'Suno v4',
    website: 'https://suno.com',
    tagline: 'Make a song about anything.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'ios'],
    },
    content: {
      intro: 'Generates radio-quality songs with vocals and lyrics from simple prompts.',
      features: ['Full song generation', 'Instrumental mode', 'Extend track'],
      limitations: ['Copyright ownership on paid only', 'Lyrics can be cheesy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['50 credits/day']},
        {name: 'Pro', price: '$10/mo', features: ['Commercial rights'], highlight: true},
      ],
    },
    stats: {views: 'Viral', likes: 'Fun', verified: 'tested'},
  },
  {
    name: 'Udio',
    website: 'https://udio.com',
    tagline: 'Music generation for pros.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web'],
    },
    content: {
      intro:
        'Competitor to Suno with a focus on high-fidelity audio and complex musical structures.',
      features: ['Inpainting', 'Track extension', 'Remix'],
      limitations: ['Interface is dense', 'Generation time'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily limit']},
        {name: 'Standard', price: '$10/mo', features: ['Prioritized'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Quality', verified: 'tested'},
  },
  {
    name: 'Speechify',
    website: 'https://speechify.com',
    tagline: 'Turn any text into audio.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'ios', 'chrome'],
    },
    content: {
      intro:
        'Reads books, articles, and PDFs aloud using high-quality AI voices (including celebrities like Snoop Dogg).',
      features: ['Speed listening', 'Scan to read', 'Celebrity voices'],
      limitations: ['Premium voices locked', 'Expensive annual plan'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard voices']},
        {name: 'Premium', price: '$139/yr', features: ['HD voices'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Hume AI',
    website: 'https://hume.ai',
    tagline: 'The empathic voice interface.',
    filters: {
      pricing: 'free (beta)',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'An AI voice specifically trained to understand and respond to human emotion and tone.',
      features: ['EVI (Empathic Voice Interface)', 'Emotion detection', 'Low latency'],
      limitations: ['Developer focus', 'Beta availability'],
      pricing: [{name: 'Beta', price: 'Free', features: ['Test access'], highlight: true}],
    },
    stats: {views: 'Tech', likes: 'Future', verified: 'tested'},
  },
  {
    name: 'LALAL.AI',
    website: 'https://lalal.ai',
    tagline: 'Extract vocal and instrumental tracks.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web'],
    },
    content: {
      intro:
        'Next-generation stem splitter that removes vocals or instruments with high precision.',
      features: ['Stem separation', 'Voice cleaner', 'Batch upload'],
      limitations: ['Pay per minute', 'No subscription (packs)'],
      pricing: [{name: 'Pack', price: '$15', features: ['90 mins'], highlight: true}],
    },
    stats: {views: 'Musicians', likes: 'Clean', verified: 'tested'},
  },
  {
    name: 'Soundraw',
    website: 'https://soundraw.io',
    tagline: 'Royalty-free AI music generator.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web'],
    },
    content: {
      intro: 'Generates background music that you can customize (tempo, length, mood) for videos.',
      features: ['Custom length', 'Mood selection', 'Permanent license'],
      limitations: ['Not for listening (BGM only)', 'Subscription for download'],
      pricing: [{name: 'Creator', price: '$16/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'YouTubers', likes: 'Safe', verified: 'tested'},
  },
  {
    name: 'Zapier Central',
    website: 'https://zapier.com/central',
    tagline: 'Teach AI bots to work across 6,000+ apps.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['web'],
    },
    content: {
      intro:
        'An experimental workspace where you create persistent AI assistants that can trigger Zaps and analyze data.',
      features: ['Live data access', 'Action triggering', 'Persistent memory'],
      limitations: ['Beta bugs', 'Complex setup'],
      pricing: [{name: 'Free', price: '$0', features: ['Limited bots']}],
    },
    stats: {views: 'High', likes: 'Powerful', verified: 'tested'},
  },
  {
    name: 'Make.com',
    website: 'https://make.com',
    tagline: 'Visual platform for complex automation.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['web'],
    },
    content: {
      intro:
        'A visual canvas to build workflows. Highly popular for chaining OpenAI API calls with other apps.',
      features: ['Visual builder', 'Thousands of apps', 'AI assistant'],
      limitations: ['Steep learning curve', 'Operation limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['1000 ops/mo']},
        {name: 'Core', price: '$9/mo', features: ['10k ops'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Flexible', verified: 'tested'},
  },
  {
    name: 'n8n',
    website: 'https://n8n.io',
    tagline: 'Workflow automation for technical people.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['web', 'self-hosted'],
    },
    content: {
      intro:
        'A node-based automation tool that is open-source and self-hostable, ideal for privacy-focused AI workflows.',
      features: ['Self-hostable', 'LangChain nodes', 'Webhooks'],
      limitations: ['Technical setup', 'Cloud version is paid'],
      pricing: [
        {name: 'Self-hosted', price: 'Free', features: ['Full control']},
        {name: 'Cloud', price: '$20/mo', features: ['Managed'], highlight: true},
      ],
    },
    stats: {views: 'Tech', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Gumloop',
    website: 'https://gumloop.com',
    tagline: 'Drag and drop AI workflow builder.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['web'],
    },
    content: {
      intro:
        'Designed specifically for AI operations (AI Ops), allowing you to chain models, scrapers, and PDFs.',
      features: ['PDF extraction', 'Web scraping', 'AI chaining'],
      limitations: ['Newer platform', 'Community smaller'],
      pricing: [{name: 'Free', price: '$0', features: ['Basic flows']}],
    },
    stats: {views: 'Growing', likes: 'Easy', verified: 'tested'},
  },
  {
    name: 'MindStudio',
    website: 'https://mindstudio.ai',
    tagline: 'Build and deploy AI apps without code.',
    filters: {
      pricing: 'paid',
      category: 'automation',
      platforms: ['web'],
    },
    content: {
      intro:
        "A platform for creating AI 'workers' or apps that can be deployed to employees or sold.",
      features: ['Model agnostic', 'Monetization', 'Embeddable'],
      limitations: ['Usage costs', 'Business focus'],
      pricing: [
        {name: 'Starter', price: '$0', features: ['Build only']},
        {name: 'Pro', price: '$40/mo', features: ['Publishing'], highlight: true},
      ],
    },
    stats: {views: 'Business', likes: 'Robust', verified: 'tested'},
  },
  {
    name: 'Harvey',
    website: 'https://harvey.ai',
    tagline: 'Unprecedented legal AI.',
    filters: {
      pricing: 'enterprise',
      category: 'legal',
      platforms: ['web'],
    },
    content: {
      intro:
        "Built on OpenAI's models, Harvey is fine-tuned for legal work, contract analysis, and due diligence.",
      features: ['Contract review', 'Case law research', 'Secure'],
      limitations: ['Waitlist/Invite only', 'Expensive enterprise'],
      pricing: [
        {name: 'Enterprise', price: 'Contact Sales', features: ['Full suite'], highlight: true},
      ],
    },
    stats: {views: 'Law', likes: 'Elite', verified: 'tested'},
  },
  {
    name: 'Abridge',
    website: 'https://abridge.com',
    tagline: 'Generative AI for clinical documentation.',
    filters: {
      pricing: 'paid',
      category: 'medical',
      platforms: ['ios', 'web'],
    },
    content: {
      intro:
        'Records doctor-patient conversations and automatically generates structured clinical notes.',
      features: ['EMR integration', 'Ambient listening', 'Medical accuracy'],
      limitations: ['Healthcare professionals only', 'US focus'],
      pricing: [
        {
          name: 'Enterprise',
          price: 'Contact Sales',
          features: ['Epic integration'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'Doctors', likes: 'Time saver', verified: 'tested'},
  },
  {
    name: 'Heidi Health',
    website: 'https://heidihealth.com',
    tagline: 'The free AI medical scribe.',
    filters: {
      pricing: 'freemium',
      category: 'medical',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro:
        'A highly accessible AI scribe that turns consults into notes, letters, and documents.',
      features: ['Custom templates', 'Multi-language', 'Secure'],
      limitations: ['Free tier has limits', 'Liability remains with doctor'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic notes']},
        {name: 'Pro', price: '$40/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Value', verified: 'tested'},
  },
  {
    name: 'Clay',
    website: 'https://clay.com',
    tagline: 'Scale your personalized outreach.',
    filters: {
      pricing: 'paid',
      category: 'sales',
      platforms: ['web'],
    },
    content: {
      intro:
        'Combines 50+ data providers with AI to enrich lead lists and write hyper-personalized emails.',
      features: ['Waterfall enrichment', 'AI email writer', 'CRM sync'],
      limitations: ['Expensive credits', 'Complexity'],
      pricing: [{name: 'Starter', price: '$149/mo', features: ['2k credits'], highlight: true}],
    },
    stats: {views: 'Sales', likes: 'Magic', verified: 'tested'},
  },
  {
    name: 'Tome',
    website: 'https://tome.app',
    tagline: 'The AI-powered storytelling format.',
    filters: {
      pricing: 'freemium',
      category: 'sales/presentation',
      platforms: ['web'],
    },
    content: {
      intro: 'Focuses on generating polished decks for sales and founders with clean aesthetics.',
      features: ['Page generation', 'Interactive embeds', 'Figma import'],
      limitations: ['Export options', 'Watermark on free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Pro', price: '$16/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Founders', likes: 'Sleek', verified: 'tested'},
  },
  {
    name: 'Surfer SEO',
    website: 'https://surferseo.com',
    tagline: 'Skyrocket your organic traffic.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Analyzes top-ranking content and uses AI to write or optimize articles to rank higher.',
      features: ['Content Editor', 'Keyword research', 'AI Writer'],
      limitations: ['Pricey', 'Can be repetitive'],
      pricing: [{name: 'Essential', price: '$89/mo', features: ['15 articles'], highlight: true}],
    },
    stats: {views: 'SEO', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Originality.ai',
    website: 'https://originality.ai',
    tagline: 'The most accurate AI content detector.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro: 'Designed for web publishers to detect if content was written by AI or humans.',
      features: ['AI Detection', 'Plagiarism check', 'Fact check'],
      limitations: ['False positives possible', 'Paid credits only'],
      pricing: [{name: 'Pay-as-you-go', price: '$30', features: ['3000 credits'], highlight: true}],
    },
    stats: {views: 'Publishers', likes: 'Controversial', verified: 'tested'},
  },
  {
    name: 'Grok-3',
    website: 'https://x.ai',
    tagline: 'Maximum truth-seeking intelligence.',
    filters: {
      pricing: 'paid',
      category: 'chatbot',
      platforms: ['web', 'ios'],
    },
    content: {
      intro:
        "Elon Musk's AI integrated into X (Twitter), with real-time access to the platform's data.",
      features: ['Real-time X access', 'Fun mode', 'Image generation'],
      limitations: ['Requires X Premium', 'Personality is specific'],
      pricing: [{name: 'Premium', price: '$16/mo', features: ['Access'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Polarizing', verified: 'tested'},
  },
  {
    name: 'Mistral Large 2',
    website: 'https://mistral.ai',
    tagline: 'Top-tier reasoning, open weights.',
    filters: {
      pricing: 'freemium',
      category: 'model',
      platforms: ['api', 'web'],
    },
    content: {
      intro:
        "Europe's leading model, offering GPT-4 level performance with strong coding and multilingual skills.",
      features: ['128k context', 'Function calling', 'JSON mode'],
      limitations: ['Le Chat is basic', 'API focus'],
      pricing: [{name: 'Le Chat', price: 'Free', features: ['Chat']}],
    },
    stats: {views: 'Devs', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Qwen 2.5',
    website: 'https://qwenlm.github.io',
    tagline: "Alibaba's powerful open model series.",
    filters: {
      pricing: 'free',
      category: 'model',
      platforms: ['huggingface'],
    },
    content: {
      intro:
        'A suite of open-source models ranging from 0.5B to 72B parameters, known for incredible coding and math performance.',
      features: ['Code expert', 'Math expert', 'Open weights'],
      limitations: ['Requires hosting', 'Chinese/English focus'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Downloadable'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'DeepSeek V3',
    website: 'https://deepseek.com',
    tagline: 'Unravelling the mystery of AGI.',
    filters: {
      pricing: 'freemium',
      category: 'chatbot',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'A highly efficient Mixture-of-Experts model that disrupted the market with low API costs.',
      features: ['Coding expert', 'Cheap API', 'Deep reasoning'],
      limitations: ['Privacy concerns (China)', 'Server load'],
      pricing: [{name: 'Chat', price: 'Free', features: ['Web']}],
    },
    stats: {views: 'Viral', likes: 'Disruptor', verified: 'tested'},
  },
  {
    name: 'Pi',
    website: 'https://pi.ai',
    tagline: 'Your personal AI.',
    filters: {
      pricing: 'free',
      category: 'chatbot',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro: 'Designed to be a supportive and empathetic companion rather than a tool.',
      features: ['Great voice mode', 'Emotional intelligence', 'Advice'],
      limitations: ['Not for coding', 'No image gen'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Friendly', verified: 'tested'},
  },
  {
    name: 'Jasper',
    website: 'https://jasper.ai',
    tagline: 'AI marketing copilot.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'The original AI writing tool for marketers, offering brand voice and campaign management.',
      features: ['Brand Voice', 'Campaigns', 'Art'],
      limitations: ['Expensive', 'Competition from generic chatbots'],
      pricing: [{name: 'Creator', price: '$39/mo', features: ['1 seat'], highlight: true}],
    },
    stats: {views: 'Marketers', likes: 'Solid', verified: 'tested'},
  },
  {
    name: 'Copy.ai',
    website: 'https://copy.ai',
    tagline: 'Whatever you want to make, make it with Copy.ai.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro: "Marketing focused AI that uses 'Workflows' to automate content creation at scale.",
      features: ['Workflows', 'Chat', 'Brand voice'],
      limitations: ['Workflow complexity', 'Generic outputs sometimes'],
      pricing: [
        {name: 'Free', price: '$0', features: ['2000 words']},
        {name: 'Pro', price: '$36/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'Writesonic',
    website: 'https://writesonic.com',
    tagline: 'Best AI writer for SEO.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Combines GPT-4 with real-time Google search to create factual, SEO-optimized articles.',
      features: ['Article Writer 6.0', 'SEO checker', 'Chat'],
      limitations: ['Credit heavy', 'UI clutter'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Small Team', price: '$19/mo', features: ['More words'], highlight: true},
      ],
    },
    stats: {views: 'SEO', likes: 'Efficient', verified: 'tested'},
  },
  {
    name: 'QuillBot',
    website: 'https://quillbot.com',
    tagline: 'Paraphrase any text.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web', 'chrome'],
    },
    content: {
      intro: 'The go-to tool for students and writers to rephrase, shorten, or expand text.',
      features: ['Paraphraser', 'Grammar check', 'Plagiarism checker'],
      limitations: ['Word limits on free', 'Simpler AI than GPT'],
      pricing: [
        {name: 'Free', price: '$0', features: ['125 words']},
        {name: 'Premium', price: '$9.95/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Grammarly',
    website: 'https://grammarly.com',
    tagline: 'Great writing, simplified.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web', 'desktop', 'mobile'],
    },
    content: {
      intro: 'The ubiquitous grammar checker now includes generative AI to rewrite and draft text.',
      features: ['Tone detector', 'Grammar fix', 'Generative AI'],
      limitations: ['Can be intrusive', 'Expensive pro'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic errors']},
        {name: 'Premium', price: '$12/mo', features: ['Style & Tone'], highlight: true},
      ],
    },
    stats: {views: 'Ubiquitous', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Descript',
    website: 'https://descript.com',
    tagline: 'Video editing as easy as a doc.',
    filters: {
      pricing: 'freemium',
      category: 'video editing',
      platforms: ['mac', 'windows'],
    },
    content: {
      intro: 'Transcribes video so you can edit it by deleting text. Includes AI voice cloning.',
      features: ['Text-based editing', 'Overdub', 'Studio Sound'],
      limitations: ['Transcription errors', 'Export limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['1 hr/mo']},
        {name: 'Creator', price: '$12/mo', features: ['10 hrs/mo'], highlight: true},
      ],
    },
    stats: {views: 'Podcasters', likes: 'Love', verified: 'tested'},
  },
  {
    name: 'Otter.ai',
    website: 'https://otter.ai',
    tagline: 'AI meeting notes & transcription.',
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro: 'Joins your Zoom/Teams/Meet calls and automatically transcribes and summarizes them.',
      features: ['OtterPilot', 'Live transcript', 'Summary emails'],
      limitations: ['English only focus', 'Hard to identify speakers sometimes'],
      pricing: [
        {name: 'Free', price: '$0', features: ['300 mins/mo']},
        {name: 'Pro', price: '$10/mo', features: ['1200 mins/mo'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Useful', verified: 'tested'},
  },
  {
    name: 'Fireflies.ai',
    website: 'https://fireflies.ai',
    tagline: 'Automate your meeting notes.',
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['web'],
    },
    content: {
      intro: 'Similar to Otter but with deeper integrations into CRMs like Salesforce and HubSpot.',
      features: ['AskFred (Chat)', 'Sentiment analysis', 'CRM logging'],
      limitations: ['Video recording is paid', 'Bot can be kicked'],
      pricing: [
        {name: 'Free', price: '$0', features: ['800 mins/storage']},
        {name: 'Pro', price: '$10/mo', features: ['8000 mins'], highlight: true},
      ],
    },
    stats: {views: 'Business', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'Read.ai',
    website: 'https://read.ai',
    tagline: 'Measurement & analytics for meetings.',
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['web'],
    },
    content: {
      intro: "Focuses on meeting 'health'—engagement, sentiment, and summaries.",
      features: ['Meeting highlights', 'Video playback', 'Coaching'],
      limitations: ['Bot is visible', 'Analytics can be noisy'],
      pricing: [{name: 'Free', price: '$0', features: ['5 meetings/mo']}],
    },
    stats: {views: 'Growing', likes: 'Insightful', verified: 'tested'},
  },
  {
    name: 'Beautiful.ai',
    website: 'https://beautiful.ai',
    tagline: 'Presentation software that designs for you.',
    filters: {
      pricing: 'paid',
      category: 'presentation',
      platforms: ['web'],
    },
    content: {
      intro: 'Ensures your slides always look professional by constraining layout choices with AI.',
      features: ['Smart templates', 'Auto-formatting', 'Designer bot'],
      limitations: ['Restrictive layouts', 'Paid only'],
      pricing: [{name: 'Pro', price: '$12/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'Corporate', likes: 'Clean', verified: 'tested'},
  },
  {
    name: 'Tavus',
    website: 'https://tavus.io',
    tagline: 'Programmatic personalized video.',
    filters: {
      pricing: 'paid',
      category: 'video marketing',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'Record one video and use AI to change the name/company you say for thousands of recipients.',
      features: ['Voice cloning', 'Lip sync', 'Variable replacement'],
      limitations: ['High cost', 'Setup time'],
      pricing: [{name: 'Starter', price: 'Custom', features: ['Templates'], highlight: true}],
    },
    stats: {views: 'Sales', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Krea.ai',
    website: 'https://krea.ai',
    tagline: 'Real-time generation and upscaling.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web'],
    },
    content: {
      intro:
        "Famous for its 'Real-time' canvas where images update instantly as you draw or move shapes.",
      features: ['Real-time gen', 'Upscaler', 'Logo illusions'],
      limitations: ['Queue times', 'Beta stability'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily limit']},
        {name: 'Pro', price: '$30/mo', features: ['Fast'], highlight: true},
      ],
    },
    stats: {views: 'Artists', likes: 'Fast', verified: 'tested'},
  },
  {
    name: 'Playground',
    website: 'https://playground.com',
    tagline: 'Design graphics like a pro.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['web'],
    },
    content: {
      intro:
        'A user-friendly interface for Stable Diffusion and their own models, with great editing tools.',
      features: ['Mixed Image Editing', 'Canvas', 'Filters'],
      limitations: ['Learning curve', 'Credit limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['50 images/day']},
        {name: 'Pro', price: '$12/mo', features: ['1000/day'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'Recraft',
    website: 'https://recraft.ai',
    tagline: 'Generative AI for vector art.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web'],
    },
    content: {
      intro:
        'Unique in its ability to generate actual SVG vectors (icons, illustrations) rather than just pixels.',
      features: ['Vector generation', 'Style consistency', 'Icon sets'],
      limitations: ['Vector complexity limited', 'Credits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Public']},
        {name: 'Pro', price: '$20/mo', features: ['Private'], highlight: true},
      ],
    },
    stats: {views: 'Designers', likes: 'Unique', verified: 'tested'},
  },
  {
    name: 'Looka',
    website: 'https://looka.com',
    tagline: 'Design your own beautiful brand.',
    filters: {
      pricing: 'paid',
      category: 'design',
      platforms: ['web'],
    },
    content: {
      intro: 'Logo maker that uses AI to generate brand identities based on your preferences.',
      features: ['Logo gen', 'Brand kit', 'Social assets'],
      limitations: ['Generic icons sometimes', 'Pay to download'],
      pricing: [{name: 'Basic', price: '$20', features: ['One logo file'], highlight: true}],
    },
    stats: {views: 'Startups', likes: 'Easy', verified: 'tested'},
  },
  {
    name: 'Veed.io',
    website: 'https://veed.io',
    tagline: 'Anyone can make a great video.',
    filters: {
      pricing: 'freemium',
      category: 'video editing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Cloud-based video editor heavily utilizing AI for subtitles, noise removal, and eye correction.',
      features: ['Auto subtitles', 'Magic Cut', 'Avatars'],
      limitations: ['Watermark on free', 'Render times'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Watermarked']},
        {name: 'Basic', price: '$12/mo', features: ['No watermark'], highlight: true},
      ],
    },
    stats: {views: 'Massive', likes: 'Solid', verified: 'tested'},
  },
  {
    name: 'CapCut AI',
    website: 'https://capcut.com',
    tagline: 'All-in-one video editor.',
    filters: {
      pricing: 'freemium',
      category: 'video editing',
      platforms: ['mobile', 'desktop', 'web'],
    },
    content: {
      intro: "ByteDance's editor, packed with AI trends, templates, and smart cutout features.",
      features: ['Auto captions', 'AI body effects', 'Script-to-video'],
      limitations: ['Privacy concerns', 'Pro features locked'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Most features']},
        {name: 'Pro', price: '$7.99/mo', features: ['Cloud space'], highlight: true},
      ],
    },
    stats: {views: 'Ubiquitous', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Mubert',
    website: 'https://mubert.com',
    tagline: 'Human x AI Generative Music.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro: 'Generates continuous music streams for apps, games, and videos.',
      features: ['Stream generation', 'API', 'Royalty-free'],
      limitations: ['Abstract music mostly', 'Credit attribution required'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Watermarked']},
        {name: 'Creator', price: '$14/mo', features: ['Socials'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'AIVA',
    website: 'https://aiva.ai',
    tagline: 'The AI music composer.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'desktop'],
    },
    content: {
      intro:
        'One of the oldest AI music tools, allowing detailed MIDI-level editing of generated tracks.',
      features: ['MIDI export', 'Style selection', 'Advanced edit'],
      limitations: ['Copyright owned by AIVA on free', 'Complex'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Non-commercial']},
        {name: 'Pro', price: '$33/mo', features: ['Copyright ownership'], highlight: true},
      ],
    },
    stats: {views: 'Composers', likes: 'Deep', verified: 'tested'},
  },
  {
    name: 'Chatbase',
    website: 'https://chatbase.co',
    tagline: 'Custom ChatGPT for your data.',
    filters: {
      pricing: 'paid',
      category: 'chatbot builder',
      platforms: ['web'],
    },
    content: {
      intro:
        'Easiest way to build a chatbot trained on your PDFs and website to embed on your site.',
      features: ['Embed widget', 'Lead capture', 'Source citing'],
      limitations: ['Monthly message limits', 'Simpler RAG'],
      pricing: [{name: 'Hobby', price: '$19/mo', features: ['2k messages'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Easy', verified: 'tested'},
  },
  {
    name: 'Dante AI',
    website: 'https://dante-ai.com',
    tagline: 'Custom AI chatbots trained on your data.',
    filters: {
      pricing: 'paid',
      category: 'chatbot builder',
      platforms: ['web'],
    },
    content: {
      intro: 'Competitor to Chatbase with a focus on GPT-4 integration and multi-language support.',
      features: ['Voice chat', 'White-label', 'Analytics'],
      limitations: ['Expensive', 'No free plan'],
      pricing: [{name: 'Entry', price: '$30/mo', features: ['GPT-4'], highlight: true}],
    },
    stats: {views: 'Business', likes: 'Robust', verified: 'tested'},
  },
  {
    name: 'SiteGPT',
    website: 'https://sitegpt.ai',
    tagline: 'Make AI your customer support agent.',
    filters: {
      pricing: 'paid',
      category: 'chatbot builder',
      platforms: ['web'],
    },
    content: {
      intro: 'Focuses purely on website scraping to create an instant support bot.',
      features: ['Auto-sync', 'Escalation to human', 'Customization'],
      limitations: ['Niche focus', 'Pricing'],
      pricing: [
        {name: 'Essential', price: '$49/mo', features: ['Unlimited pages'], highlight: true},
      ],
    },
    stats: {views: 'Indie', likes: 'Focused', verified: 'tested'},
  },
  {
    name: 'Intercom Fin',
    website: 'https://intercom.com/fin',
    tagline: 'The AI customer service bot.',
    filters: {
      pricing: 'paid',
      category: 'support',
      platforms: ['web'],
    },
    content: {
      intro: "Intercom's native AI bot that resolves support tickets using your help center.",
      features: ['Seamless handoff', 'Resolution tracking', 'Secure'],
      limitations: ['Requires Intercom', 'Per-resolution pricing'],
      pricing: [
        {name: 'Usage', price: '$0.99/resolution', features: ['Pay per success'], highlight: true},
      ],
    },
    stats: {views: 'Enterprise', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Zendesk AI',
    website: 'https://zendesk.com',
    tagline: 'Service-first AI.',
    filters: {
      pricing: 'paid',
      category: 'support',
      platforms: ['web'],
    },
    content: {
      intro:
        'Adds intent detection, sentiment analysis, and macro suggestions to the Zendesk suite.',
      features: ['Intent triage', 'Macro suggestions', 'Bot builder'],
      limitations: ['Enterprise heavy', 'Add-on cost'],
      pricing: [{name: 'Advanced', price: '$50/mo', features: ['AI add-on'], highlight: true}],
    },
    stats: {views: 'Enterprise', likes: 'Standard', verified: 'tested'},
  },
  {
    name: 'Ada',
    website: 'https://ada.cx',
    tagline: 'Automate more resolutions.',
    filters: {
      pricing: 'enterprise',
      category: 'support',
      platforms: ['web'],
    },
    content: {
      intro: 'A high-end automated customer experience platform for large brands.',
      features: ['Reasoning engine', 'Voice AI', 'Cross-channel'],
      limitations: ['Very expensive', 'Contract only'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 'Big Biz', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Typeface',
    website: 'https://typeface.ai',
    tagline: 'The AI app for brand content.',
    filters: {
      pricing: 'enterprise',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro:
        "Enterprise platform that trains personalized models on a brand's assets for consistent content.",
      features: ['Brand consistency', 'Multimodal', 'Governance'],
      limitations: ['Not for individuals', 'Sales demo needed'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Custom model'], highlight: true}],
    },
    stats: {views: 'Brands', likes: 'Safe', verified: 'tested'},
  },
  {
    name: 'Writer.com',
    website: 'https://writer.com',
    tagline: 'Full-stack generative AI platform for enterprises.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        "An enterprise alternative to ChatGPT that doesn't train on your data and enforces style guides.",
      features: ['Palmyra LLM', 'Knowledge graph', 'Style enforcement'],
      limitations: ['Not for casual use', 'Team focus'],
      pricing: [{name: 'Team', price: '$18/user/mo', features: ['Security'], highlight: true}],
    },
    stats: {views: 'Corporate', likes: 'Secure', verified: 'tested'},
  },
  {
    name: 'Cohere Coral',
    website: 'https://cohere.com',
    tagline: 'The AI for enterprise.',
    filters: {
      pricing: 'paid',
      category: 'search/chat',
      platforms: ['web', 'api'],
    },
    content: {
      intro: 'Knowledge assistant that cites sources from internal company documents.',
      features: ['RAG optimized', 'Command R+', 'Private'],
      limitations: ['Developer focus', 'Setup required'],
      pricing: [{name: 'Production', price: 'Usage', features: ['API'], highlight: true}],
    },
    stats: {views: 'Tech', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Glean',
    website: 'https://glean.com',
    tagline: 'Work AI for all your data.',
    filters: {
      pricing: 'enterprise',
      category: 'search',
      platforms: ['web'],
    },
    content: {
      intro:
        'Enterprise search engine that indexes Slack, Jira, Drive, etc., to answer work questions.',
      features: ['Universal search', 'Permission aware', 'AI answers'],
      limitations: ['Expensive', 'Min seat count'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full index'], highlight: true}],
    },
    stats: {views: 'Enterprise', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Perplexity Pages',
    website: 'https://perplexity.ai',
    tagline: 'Turn research into articles.',
    filters: {
      pricing: 'freemium',
      category: 'content',
      platforms: ['web'],
    },
    content: {
      intro:
        'Feature within Perplexity that converts search threads into shareable, formatted articles.',
      features: ['Auto-formatting', 'Image insertion', 'Citations'],
      limitations: ['Editing is basic', 'Pro for best models'],
      pricing: [{name: 'Free', price: '$0', features: ['Basic']}],
    },
    stats: {views: 'High', likes: 'Cool', verified: 'tested'},
  },
  {
    name: 'Andi Search',
    website: 'https://andisearch.com',
    tagline: 'Search for the next generation.',
    filters: {
      pricing: 'free',
      category: 'search',
      platforms: ['web'],
    },
    content: {
      intro: 'A friendly, privacy-focused AI search assistant.',
      features: ['Reader view', 'Direct answers', 'Ad-free'],
      limitations: ['Smaller index', 'Slower than Google'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Niche', likes: 'Friendly', verified: 'tested'},
  },
  {
    name: 'You.com',
    website: 'https://you.com',
    tagline: 'The AI that helps you get things done.',
    filters: {
      pricing: 'freemium',
      category: 'search',
      platforms: ['web'],
    },
    content: {
      intro: "Customizable AI search engine with 'Agents' for coding, writing, and research.",
      features: ['Custom agents', 'Genius mode', 'Privacy focus'],
      limitations: ['UI busy', 'Pro needed for GPT-4'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard']},
        {name: 'Pro', price: '$15/mo', features: ['All models'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Flexible', verified: 'tested'},
  },
  {
    name: 'Khanmigo',
    website: 'https://khanacademy.org',
    tagline: 'World-class AI tutor.',
    filters: {
      pricing: 'paid',
      category: 'education',
      platforms: ['web'],
    },
    content: {
      intro: 'Socratic tutor for students that guides them without giving answers.',
      features: ['Tutor mode', 'Teacher tools', 'Code help'],
      limitations: ['Paid only', 'Subject limited'],
      pricing: [{name: 'Monthly', price: '$4/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'Students', likes: 'Educational', verified: 'tested'},
  },
  {
    name: 'Elicit',
    website: 'https://elicit.com',
    tagline: 'Analyze research papers at scale.',
    filters: {
      pricing: 'freemium',
      category: 'research',
      platforms: ['web'],
    },
    content: {
      intro: 'Finds papers and extracts data into a table for literature reviews.',
      features: ['Data extraction', 'Summaries', 'Citation check'],
      limitations: ['Credit limits', 'PDF parsing errors'],
      pricing: [{name: 'Plus', price: '$10/mo', features: ['Export'], highlight: true}],
    },
    stats: {views: 'PhDs', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Consensus',
    website: 'https://consensus.app',
    tagline: 'Evidence-based answers.',
    filters: {
      pricing: 'freemium',
      category: 'research',
      platforms: ['web'],
    },
    content: {
      intro: 'Search engine for scientific consensus on questions.',
      features: ['Consensus meter', 'Study snapshots', 'Copilot'],
      limitations: ['Academic sources only', 'Pro for GPT-4'],
      pricing: [{name: 'Premium', price: '$9/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 'Growing', likes: 'Reliable', verified: 'tested'},
  },
  {
    name: 'Meshy',
    website: 'https://meshy.ai',
    tagline: '3D AI generator.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
    },
    content: {
      intro: 'Fast text-to-3D and image-to-3D for game assets.',
      features: ['PBR textures', 'Fast generation', 'Download'],
      limitations: ['Topology messy', 'Credits'],
      pricing: [{name: 'Pro', price: '$20/mo', features: ['Commercial'], highlight: true}],
    },
    stats: {views: 'GameDevs', likes: 'Fast', verified: 'tested'},
  },
  {
    name: 'Spline AI',
    website: 'https://spline.design',
    tagline: 'Design 3D with AI.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
    },
    content: {
      intro: 'Generates 3D scenes and textures within the Spline editor.',
      features: ['Prompt-to-scene', 'Style transfer', 'Physics'],
      limitations: ['Browser heavy', 'Learning curve'],
      pricing: [{name: 'Super', price: '$24/mo', features: ['AI credits'], highlight: true}],
    },
    stats: {views: 'Designers', likes: 'Cool', verified: 'tested'},
  },
  {
    name: 'Tabnine',
    website: 'https://tabnine.com',
    tagline: 'AI assistant for software teams.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['vscode', 'jetbrains'],
    },
    content: {
      intro: 'Privacy-first code completion that can run locally.',
      features: ['Local mode', 'Private codebase', 'Chat'],
      limitations: ['Less powerful than Copilot', 'Setup'],
      pricing: [{name: 'Pro', price: '$12/mo', features: ['Full context'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Secure', verified: 'tested'},
  },
  {
    name: 'Amazon Q',
    website: 'https://aws.amazon.com/q',
    tagline: 'Generative AI for AWS.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['aws'],
    },
    content: {
      intro: 'Expert on AWS architecture, coding, and troubleshooting.',
      features: ['Code upgrade', 'Console help', 'Business chat'],
      limitations: ['AWS lock-in', 'Enterprise pricing'],
      pricing: [{name: 'Dev', price: '$25/mo', features: ['Code transform'], highlight: true}],
    },
    stats: {views: 'Cloud', likes: 'Niche', verified: 'tested'},
  },
  // --- ADD NEXT TOOL HERE ---
  {
    name: 'Khanmigo',
    website: 'https://www.khanacademy.org/khanmigo',
    tagline: "Khan Academy's AI tutor and teaching assistant.",
    filters: {
      pricing: 'paid',
      category: 'education',
      platforms: ['web'],
    },
    content: {
      intro:
        "A GPT-4 powered tutor that doesn't just give answers but guides students through the thinking process using Socratic dialogue.",
      features: ['Socratic tutoring', 'Lesson plan generation', 'Coding feedback'],
      limitations: ['Requires paid subscription', 'No mobile app specific to Khanmigo yet'],
      pricing: [
        {name: 'Free', price: 'Free for teachers', features: ['Classroom tools']},
        {name: 'Learner', price: '$4/mo', features: ['Unlimited tutoring'], highlight: true},
      ],
    },
    stats: {views: '20M+', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Elicit',
    website: 'https://elicit.com',
    tagline: 'The AI research assistant that analyzes research papers at scale.',
    filters: {
      pricing: 'freemium',
      category: 'research',
      platforms: ['web'],
    },
    content: {
      intro:
        'Automates the literature review process by finding relevant papers, summarizing key takeaways, and extracting data into tables.',
      features: ['Literature review', 'Data extraction tables', 'Citation verification'],
      limitations: ['Limited free credits', 'Can miss niche non-digitized papers'],
      pricing: [
        {name: 'Basic', price: 'Free', features: ['Limited searches']},
        {
          name: 'Plus',
          price: '$10/mo',
          features: ['Export to RIS/CSV', 'High-accuracy mode'],
          highlight: true,
        },
      ],
    },
    stats: {views: '5M+', likes: 'Essential for PhDs', verified: 'tested'},
  },
  {
    name: 'Consensus',
    website: 'https://consensus.app',
    tagline: 'Search engine that uses AI to find answers in scientific research.',
    filters: {
      pricing: 'freemium',
      category: 'research',
      platforms: ['web'],
    },
    content: {
      intro:
        'A search engine designed to answer questions with consensus summaries derived directly from peer-reviewed studies.',
      features: ['Yes/No consensus meter', 'Study snapshots', 'GPT-4 summaries'],
      limitations: ['Dependent on open access papers', 'Academic focus only'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Unlimited searches', 'Limited AI summaries']},
        {
          name: 'Premium',
          price: '$8.99/mo',
          features: ['Unlimited GPT-4 summaries', 'Study Snapshots'],
          highlight: true,
        },
      ],
    },
    stats: {views: '3M+', likes: 'Growing', verified: 'tested'},
  },
  {
    name: 'Meshy',
    website: 'https://www.meshy.ai',
    tagline: 'Create 3D models from text or images in under a minute.',
    filters: {
      pricing: 'freemium',
      category: '3d design',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'A fast generative 3D tool specifically designed for game developers and artists to prototype assets quickly.',
      features: ['Text-to-3D', 'Image-to-3D', 'PBR Texture generation'],
      limitations: ['Mesh topology can be messy', 'Not rigging-ready out of box'],
      pricing: [
        {name: 'Free', price: '$0', features: ['20 credits/mo']},
        {
          name: 'Pro',
          price: '$20/mo',
          features: ['Download .fbx/.obj', 'Commercial license'],
          highlight: true,
        },
      ],
    },
    stats: {views: '1M+', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Spline AI',
    website: 'https://spline.design/ai',
    tagline: 'Design 3D objects, animations, and textures using text prompts.',
    filters: {
      pricing: 'freemium',
      category: '3d design',
      platforms: ['web', 'macos'],
    },
    content: {
      intro:
        'Integrated into the Spline 3D design tool, this allows users to generate scenes and modify objects using natural language.',
      features: ['Prompt-to-shape', 'AI texture generation', 'Style transfer'],
      limitations: ['Browser-heavy performance', 'Learning curve for editor'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Public files']},
        {
          name: 'Super',
          price: '$24/mo',
          features: ['AI texture/generation credits', 'Remove logo'],
          highlight: true,
        },
      ],
    },
    stats: {views: '8M+', likes: 'Very High', verified: 'tested'},
  },
  {
    name: 'Tabnine',
    website: 'https://www.tabnine.com',
    tagline: 'The AI code assistant that you can run locally and securely.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['vscode', 'intellij', 'jetbrains'],
    },
    content: {
      intro:
        'A privacy-focused alternative to Copilot that offers code completion and can run entirely on your local machine.',
      features: ['Private code models', 'Local execution', 'Enterprise compliance'],
      limitations: ['Slightly less capable than Copilot Cloud', 'Setup required for local'],
      pricing: [
        {name: 'Basic', price: '$0', features: ['Short code completions']},
        {
          name: 'Pro',
          price: '$12/mo',
          features: ['Whole-line completion', 'Natural language chat'],
          highlight: true,
        },
      ],
    },
    stats: {views: '1M+ Devs', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Amazon Q',
    website: 'https://aws.amazon.com/q',
    tagline: 'Generative AI-powered assistant designed for business and AWS.',
    filters: {
      pricing: 'paid',
      category: 'enterprise',
      platforms: ['web', 'aws console'],
    },
    content: {
      intro:
        "An enterprise-grade assistant that can generate code, debug AWS issues, and answer questions from your company's data repositories.",
      features: [
        'Code transformation',
        'AWS console troubleshooting',
        'Connectors to 40+ data sources',
      ],
      limitations: ['Deeply tied to AWS ecosystem', 'Enterprise pricing complexity'],
      pricing: [
        {name: 'Business', price: '$20/mo', features: ['General business chat']},
        {
          name: 'Developer',
          price: '$25/mo',
          features: ['Code generation', 'AWS optimization'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'Enterprise', likes: 'N/A', verified: 'tested'},
  },
  {
    name: 'Grok-3',
    website: 'https://x.ai',
    tagline: "xAI's newest reasoning model with real-time X platform integration.",
    filters: {
      pricing: 'paid',
      category: 'chatbot',
      platforms: ['web', 'ios'],
    },
    content: {
      intro:
        "The latest model from Elon Musk's xAI, featuring 'Think' mode for reasoning and access to real-time tweets/news.",
      features: ['Real-time X data', 'Reasoning (Think) mode', 'Uncensored mode options'],
      limitations: ['Requires X Premium subscription', 'Personality can be abrasive'],
      pricing: [
        {name: 'Premium', price: '$16/mo', features: ['Grok-2 access']},
        {
          name: 'Premium+',
          price: '$22/mo',
          features: ['Grok-3 access', 'Early features'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'High', likes: 'Polarizing', verified: 'tested'},
  },
  {
    name: 'Mistral Large 2',
    website: 'https://mistral.ai',
    tagline: "Europe's flagship open-weights model challenging GPT-4.",
    filters: {
      pricing: 'usage-based',
      category: 'model',
      platforms: ['api', 'web'],
    },
    content: {
      intro:
        'A powerful 123B parameter model known for high reasoning capabilities and multilingual proficiency (code, math, European languages).',
      features: ['128k context window', 'Function calling', 'Open-weights availability'],
      limitations: ['Requires GPU for local run', 'Le Chat UI is basic'],
      pricing: [
        {name: 'Le Chat', price: 'Free', features: ['Chat interface']},
        {name: 'API', price: '$3/1M tokens', features: ['Developer access'], highlight: true},
      ],
    },
    stats: {views: 'Dev Favorite', likes: 'High', verified: 'tested'},
  },
  {
    name: 'DeepSeek V3',
    website: 'https://deepseek.com',
    tagline: 'The ultra-efficient open model that disrupted the industry.',
    filters: {
      pricing: 'freemium',
      category: 'model',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'A Mixture-of-Experts (MoE) model that offers GPT-4 class performance at a fraction of the inference cost.',
      features: ['671B parameters (MoE)', 'Strong coding', 'Extremely low API cost'],
      limitations: ['China-based servers (privacy)', 'English/Chinese focus'],
      pricing: [
        {name: 'Chat', price: 'Free', features: ['Web access']},
        {name: 'API', price: '$0.14/1M tokens', features: ['Cache hit pricing'], highlight: true},
      ],
    },
    stats: {views: 'Viral', likes: 'Top Tier', verified: 'tested'},
  },
  {
    name: 'Character.ai',
    website: 'https://character.ai',
    tagline: 'Chat with millions of user-created AI personalities.',
    filters: {
      pricing: 'freemium',
      category: 'chatbot',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        'A platform for creating and chatting with persona-based AIs, from fictional characters to language tutors.',
      features: ['Persona creation', 'Group chats', 'Voice calls'],
      limitations: ['Strict NSFW filters', 'Memory can be short'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Unlimited messaging']},
        {
          name: 'Plus',
          price: '$9.99/mo',
          features: ['Skip waiting room', 'Faster response'],
          highlight: true,
        },
      ],
    },
    stats: {views: '200M+', likes: 'Very High', verified: 'tested'},
  },
  {
    name: 'Poe',
    website: 'https://poe.com',
    tagline: "Quora's fast AI aggregator for accessing all top models.",
    filters: {
      pricing: 'freemium',
      category: 'aggregator',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro: 'One interface to use GPT-4, Claude 3, Gemini, and thousands of user-created bots.',
      features: ['Multi-bot chat', 'User-created bots', 'Compute point system'],
      limitations: ['Compute points run out', 'Subscription needed for top models'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited daily points']},
        {
          name: 'Subscription',
          price: '$19.99/mo',
          features: ['1M compute points/mo', 'Access to all models'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'High', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Civitai',
    website: 'https://civitai.com',
    tagline: 'The hub for open-source AI art models and LoRAs.',
    filters: {
      pricing: 'free',
      category: 'image generation',
      platforms: ['web'],
    },
    content: {
      intro:
        'The largest community platform for sharing Stable Diffusion models, embeddings, and LoRAs.',
      features: ['Model hosting', 'Image generation on-site', 'Bounties'],
      limitations: ['Content moderation varies', 'Requires technical knowledge for local use'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Download models', 'Basic generation']},
        {
          name: 'Member',
          price: '$5/mo',
          features: ['Early access', 'Supporter badge'],
          highlight: false,
        },
      ],
    },
    stats: {views: 'Massive', likes: 'Cult Following', verified: 'tested'},
  },
  {
    name: 'Scite',
    website: 'https://scite.ai',
    tagline: 'See how research papers have been cited by others.',
    filters: {
      pricing: 'paid',
      category: 'research',
      platforms: ['web'],
    },
    content: {
      intro:
        "An AI platform that helps researchers evaluate scientific articles by showing 'Smart Citations'—context on how a paper was cited (supporting or contrasting).",
      features: ['Smart Citations', 'Assistant chatbot', 'Reference checks'],
      limitations: ['Smaller database than Google Scholar', 'Paid only for full features'],
      pricing: [
        {
          name: 'Individual',
          price: '$20/mo',
          features: ['Unlimited searches', 'Assistant access'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'Academic', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Magic.dev',
    website: 'https://magic.dev',
    tagline: 'AI software engineer with a massive context window.',
    filters: {
      pricing: 'waitlist',
      category: 'coding',
      platforms: ['web'],
    },
    content: {
      intro:
        'An AI coding assistant aiming to complete complex tasks by holding millions of lines of code in context.',
      features: ['100M+ token context', 'Complete refactoring', 'Deep reasoning'],
      limitations: ['Still in limited preview/waitlist', 'High compute cost'],
      pricing: [{name: 'Waitlist', price: 'TBA', features: ['Early access'], highlight: false}],
    },
    stats: {views: 'High Hype', likes: 'Promising', verified: 'preview'},
  },
  {
    name: 'Rosebud AI',
    website: 'https://www.rosebud.ai',
    tagline: 'Build games just by chatting.',
    filters: {
      pricing: 'freemium',
      category: 'game dev',
      platforms: ['web'],
    },
    content: {
      intro:
        'A gamified creation platform where you describe game mechanics and assets, and the AI builds the code and visuals for you.',
      features: ['Text-to-Game', 'Asset generation', 'Browser deployment'],
      limitations: ['Limited to 2D/simple games', 'Beta features'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic creation']},
        {name: 'Creator', price: '$Paid', features: ['Advanced assets', 'Export'], highlight: true},
      ],
    },
    stats: {views: 'Growing', likes: 'Fun', verified: 'tested'},
  },
  {
    name: 'NovelAI',
    website: 'https://novelai.net',
    tagline: 'AI-assisted authorship and storytelling.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'A subscription service for AI-assisted writing and image generation, known for high privacy and no censorship.',
      features: ['Storyteller mode', 'Lorebook (memory)', 'Anime image gen'],
      limitations: ['UI is complex for beginners', 'Models are smaller than GPT-4'],
      pricing: [
        {name: 'Paper', price: 'Free Trial', features: ['100 actions']},
        {
          name: 'Scroll',
          price: '$15/mo',
          features: ['Unlimited text', 'Memory increase'],
          highlight: true,
        },
      ],
    },
    stats: {views: 'Niche', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Sudowrite',
    website: 'https://sudowrite.com',
    tagline: 'The non-judgmental, always-there AI writing partner.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Specifically designed for fiction writers, offering tools to describe senses, rewrite scenes, and brainstorm plot twists.',
      features: ['Story Engine', 'Sensory description', 'Rewrite'],
      limitations: ['Credit-based system', 'Can be pricey for long novels'],
      pricing: [
        {name: 'Hobby', price: '$19/mo', features: ['225k credits']},
        {name: 'Pro', price: '$29/mo', features: ['1M credits', 'Rollover'], highlight: true},
      ],
    },
    stats: {views: "Writers' Fav", likes: 'High', verified: 'tested'},
  },
  {
    name: 'Descript',
    website: 'https://descript.com',
    tagline: 'Edit video and audio by editing text.',
    filters: {
      pricing: 'freemium',
      category: 'video editing',
      platforms: ['mac', 'windows', 'web'],
    },
    content: {
      intro:
        'Revolutionary editor that transcribes your media; you edit the transcript to cut the video. Includes AI voice cloning.',
      features: ['Overdub (Voice Clone)', 'Studio Sound (Noise removal)', 'Eye Contact AI'],
      limitations: ['Transcription accuracy varies', 'Export limits on free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['1 hour/mo']},
        {name: 'Creator', price: '$12/mo', features: ['10 hours/mo', '4k export'], highlight: true},
      ],
    },
    stats: {views: 'Industry Standard', likes: 'Very High', verified: 'tested'},
  },
  {
    name: 'AlphaFold 3',
    website: 'https://alphafold.ebi.ac.uk',
    tagline: "Predicting the structure of life's molecules.",
    filters: {
      pricing: 'free (research)',
      category: 'science',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        "Google DeepMind's breakthrough model that predicts the 3D structure of proteins, DNA, RNA, and ligands.",
      features: ['Protein structure prediction', 'Drug interaction modeling', 'High accuracy'],
      limitations: ['Non-commercial use mostly', 'Computationally heavy'],
      pricing: [
        {name: 'Research', price: 'Free', features: ['Non-commercial access'], highlight: true},
      ],
    },
    stats: {views: 'Nobel Winning', likes: 'Historic', verified: 'tested'},
  },
  // second round 120-200

  {
    name: 'Julius AI',
    website: 'https://julius.ai',
    tagline: 'Your AI data analyst.',
    filters: {
      pricing: 'freemium',
      category: 'data analysis',
      platforms: ['web', 'ios', 'android'],
    },
    content: {
      intro:
        'Connects to Excel sheets, Google Sheets, or CSVs to create visualizations and analyze trends using chat.',
      features: ['Chat with data', 'Generate charts', 'Python execution'],
      limitations: ['Free tier limits rows', 'Complex statistical models require oversight'],
      pricing: [
        {name: 'Free', price: '$0', features: ['15 messages/mo']},
        {name: 'Basic', price: '$18/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Analysts', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Rows',
    website: 'https://rows.com',
    tagline: 'The spreadsheet with AI powers.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web'],
    },
    content: {
      intro:
        'A modern spreadsheet that integrates AI to fill cells, summarize data, and find leads without formulas.',
      features: ['AI Analyst', 'Data enrichment', 'Native integrations'],
      limitations: ['Learning curve vs Excel', 'Large datasets slow'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Unlimited members']},
        {name: 'Pro', price: '$15/mo', features: ['Increased data'], highlight: true},
      ],
    },
    stats: {views: 'Biz Ops', likes: 'Innovative', verified: 'tested'},
  },
  {
    name: 'Arc Max',
    website: 'https://arc.net',
    tagline: 'The browser that browses for you.',
    filters: {
      pricing: 'free',
      category: 'browser',
      platforms: ['mac', 'windows', 'ios'],
    },
    content: {
      intro:
        'Features built into the Arc Browser that summarize pages, rename downloads, and preview links instantly.',
      features: ['5-second previews', 'Ask on Page', 'Tidy Downloads'],
      limitations: ['Mac focused (Windows is new)', 'Requires Arc browser'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Tech', likes: 'Cult', verified: 'tested'},
  },
  {
    name: 'Harpa.ai',
    website: 'https://harpa.ai',
    tagline: 'AI automation agent for Chrome.',
    filters: {
      pricing: 'freemium',
      category: 'extension',
      platforms: ['chrome'],
    },
    content: {
      intro:
        'A hybrid AI agent and web automation tool. It can monitor prices, summarize pages, and write emails.',
      features: ['Web automation', 'Price tracking', 'GPT-4 integration'],
      limitations: ['Chrome only', 'Complex setup for automation'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Lifetime', price: '$One-time', features: ['Power features'], highlight: false},
      ],
    },
    stats: {views: 'Power Users', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Monica',
    website: 'https://monica.im',
    tagline: 'Your ChatGPT copilot in Chrome.',
    filters: {
      pricing: 'freemium',
      category: 'extension',
      platforms: ['chrome', 'edge'],
    },
    content: {
      intro:
        'An all-in-one sidebar that lets you chat, compose, and translate anywhere on the web.',
      features: ['Sidebar chat', 'YouTube summary', 'PDF chat'],
      limitations: ['Daily limits', 'UI can be intrusive'],
      pricing: [
        {name: 'Free', price: '$0', features: ['40 queries/day']},
        {name: 'Pro', price: '$9.90/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Convenient', verified: 'tested'},
  },
  {
    name: 'Duolingo Max',
    website: 'https://duolingo.com',
    tagline: 'Language learning with GPT-4.',
    filters: {
      pricing: 'paid',
      category: 'education',
      platforms: ['ios', 'android'],
    },
    content: {
      intro:
        "Adds 'Roleplay' and 'Explain my Answer' features to the standard Duolingo experience.",
      features: ['Roleplay mode', 'Grammar explanation', 'GPT-4'],
      limitations: ['Expensive add-on', 'Limited languages'],
      pricing: [{name: 'Max', price: '$30/mo', features: ['AI features'], highlight: true}],
    },
    stats: {views: 'Global', likes: 'Fun', verified: 'tested'},
  },
  {
    name: 'Quizlet Q-Chat',
    website: 'https://quizlet.com',
    tagline: 'Your personal AI tutor.',
    filters: {
      pricing: 'freemium',
      category: 'education',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro:
        'Uses the Socratic method to quiz you on your flashcards rather than just showing answers.',
      features: ['Study coach', 'Language tutor', 'Deepening understanding'],
      limitations: ['Ads on free', 'Requires Plus for full access'],
      pricing: [{name: 'Plus', price: '$36/yr', features: ['Q-Chat access'], highlight: true}],
    },
    stats: {views: 'Students', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Brainly',
    website: 'https://brainly.com',
    tagline: 'Homework help with AI.',
    filters: {
      pricing: 'freemium',
      category: 'education',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro:
        'Scan homework questions to get AI-generated step-by-step solutions and verify community answers.',
      features: ['Scan to solve', 'Textbook solutions', 'Live expert'],
      limitations: ['Answer quality varies', 'Subscription heavy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Plus', price: '$29/yr', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Wolfram Alpha',
    website: 'https://wolframalpha.com',
    tagline: 'Computational intelligence.',
    filters: {
      pricing: 'freemium',
      category: 'math/science',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        "The original 'answer engine' now integrated with LLMs to solve complex math and scientific queries.",
      features: ['Step-by-step math', 'Scientific data', 'Symbolic logic'],
      limitations: ['Not a creative writer', 'Pro needed for steps'],
      pricing: [{name: 'Pro', price: '$5/mo', features: ['Step-by-step'], highlight: true}],
    },
    stats: {views: 'Academic', likes: 'Gold Standard', verified: 'tested'},
  },
  {
    name: 'MathGPTPro',
    website: 'https://mathgptpro.com',
    tagline: 'Advanced AI math solver.',
    filters: {
      pricing: 'freemium',
      category: 'math',
      platforms: ['web', 'mobile'],
    },
    content: {
      intro:
        'Claims to outperform GPT-4 on math benchmarks, handling complex calculus and algebra problems.',
      features: ['Image input', 'Pro model', 'Detailed steps'],
      limitations: ['Niche focus', 'Subscription for speed'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Pro', price: '$9.99/mo', features: ['Max accuracy'], highlight: true},
      ],
    },
    stats: {views: 'Growing', likes: 'Strong', verified: 'tested'},
  },
  {
    name: 'Ironclad',
    website: 'https://ironcladapp.com',
    tagline: 'Digital contracting with AI.',
    filters: {
      pricing: 'enterprise',
      category: 'legal',
      platforms: ['web'],
    },
    content: {
      intro:
        'Uses AI to analyze contracts, redline automatically, and ensure compliance for legal teams.',
      features: ['AI Assist', 'Contract lifecycle', 'Analytics'],
      limitations: ['Enterprise only', 'Complex setup'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 'Legal', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Casetext (CoCounsel)',
    website: 'https://casetext.com',
    tagline: 'The AI legal assistant.',
    filters: {
      pricing: 'paid',
      category: 'legal',
      platforms: ['web'],
    },
    content: {
      intro:
        'Powered by GPT-4, it performs document review, legal research, and deposition preparation.',
      features: ['Parallel search', 'Deposition prep', 'Privilege log'],
      limitations: ['Expensive', 'US Law focus'],
      pricing: [{name: 'Basic', price: '$110/mo', features: ['Research'], highlight: true}],
    },
    stats: {views: 'Lawyers', likes: 'Elite', verified: 'tested'},
  },
  {
    name: 'Paradox',
    website: 'https://paradox.ai',
    tagline: 'Conversational recruiting software.',
    filters: {
      pricing: 'enterprise',
      category: 'hr',
      platforms: ['web', 'sms'],
    },
    content: {
      intro:
        'An AI assistant (Olivia) that screens candidates, answers questions, and schedules interviews automatically.',
      features: ['24/7 Screening', 'Auto-schedule', 'Onboarding'],
      limitations: ['Candidate frustration if loop fails', 'Cost'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 'Recruiters', likes: 'Time saver', verified: 'tested'},
  },
  {
    name: 'Metaview',
    website: 'https://metaview.ai',
    tagline: 'AI notes for interviews.',
    filters: {
      pricing: 'paid',
      category: 'hr',
      platforms: ['web'],
    },
    content: {
      intro:
        'Listens to interviews and provides summarized notes, candidate insights, and interviewer coaching.',
      features: ['Auto-notes', 'ATS sync', 'Bias alerts'],
      limitations: ['Recording consent needed', 'Paid'],
      pricing: [{name: 'Starter', price: '$Custom', features: ['Core'], highlight: true}],
    },
    stats: {views: 'Recruiters', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Textio',
    website: 'https://textio.com',
    tagline: 'Interrupt bias in performance reviews.',
    filters: {
      pricing: 'paid',
      category: 'hr',
      platforms: ['web'],
    },
    content: {
      intro:
        'Guides managers to write inclusive job descriptions and performance reviews by flagging biased language.',
      features: ['Bias detection', 'Writing guidance', 'Analytics'],
      limitations: ['Niche use case', 'Enterprise pricing'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Full platform'], highlight: true},
      ],
    },
    stats: {views: 'HR', likes: 'Ethical', verified: 'tested'},
  },
  {
    name: 'Polycam',
    website: 'https://poly.cam',
    tagline: 'LiDAR & 3D scanner for everyone.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['ios', 'android', 'web'],
    },
    content: {
      intro:
        'Uses phone cameras/LiDAR to create 3D captures of real-world objects, now with AI texture in-filling.',
      features: ['3D Capture', 'Room plan', 'AI textures'],
      limitations: ['Requires good lighting', 'Pro for export formats'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Capture']},
        {name: 'Pro', price: '$14.99/mo', features: ['All exports'], highlight: true},
      ],
    },
    stats: {views: 'Creators', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Luma AI (Interactive Scenes)',
    website: 'https://lumalabs.ai',
    tagline: 'Capture the world in lifelike 3D.',
    filters: {
      pricing: 'free',
      category: '3d',
      platforms: ['ios', 'web'],
    },
    content: {
      intro:
        'Specializes in NeRF (Neural Radiance Fields) technology to create photorealistic interactive scenes from video.',
      features: ['Gaussian Splats', 'Interactive scenes', 'Video-to-3D'],
      limitations: ['High compute for viewing', 'Beta features'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Tech', likes: 'Visuals', verified: 'tested'},
  },
  {
    name: 'Tripo AI',
    website: 'https://tripo3d.ai',
    tagline: 'Generate 3D models in seconds.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
    },
    content: {
      intro: 'Fast text-to-3D generator capable of creating rigged models ready for animation.',
      features: ['Text-to-3D', 'Image-to-3D', 'Auto-rigging'],
      limitations: ['Geometry can be low-poly', 'Credits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['600 credits/mo']},
        {name: 'Pro', price: '$19/mo', features: ['Commercial'], highlight: true},
      ],
    },
    stats: {views: 'GameDev', likes: 'Fast', verified: 'tested'},
  },
  {
    name: 'Scenario',
    website: 'https://scenario.com',
    tagline: 'AI-generated game assets.',
    filters: {
      pricing: 'paid',
      category: 'game dev',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'Allows game studios to train custom LoRA models on their own art style for consistent asset generation.',
      features: ['Style consistency', 'Custom models', 'Isometric gen'],
      limitations: ['Requires art to train', 'Paid only'],
      pricing: [{name: 'Starter', price: '$29/mo', features: ['Training'], highlight: true}],
    },
    stats: {views: 'IndieDevs', likes: 'Specific', verified: 'tested'},
  },
  {
    name: 'Inworld AI',
    website: 'https://inworld.ai',
    tagline: 'Bring game characters to life.',
    filters: {
      pricing: 'freemium',
      category: 'game dev',
      platforms: ['unity', 'unreal', 'web'],
    },
    content: {
      intro:
        'A logic engine for NPCs that gives them personalities, memories, and goals within games.',
      features: ['Character brain', 'Unity/Unreal SDK', 'Voice'],
      limitations: ['Latency in real-time', 'Integration effort'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Development']},
        {name: 'Pro', price: '$20/mo', features: ['More playtime'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Future', verified: 'tested'},
  },
  {
    name: 'Replika',
    website: 'https://replika.ai',
    tagline: 'The AI companion who cares.',
    filters: {
      pricing: 'freemium',
      category: 'companion',
      platforms: ['ios', 'android', 'web'],
    },
    content: {
      intro:
        'The most well-known AI companion app, designed to offer friendship and emotional support.',
      features: ['Avatar customization', 'Voice chat', 'AR mode'],
      limitations: ['Relationship status locked', 'Scripted moments'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Friendship']},
        {name: 'Pro', price: '$19.99/mo', features: ['Romance/Calls'], highlight: true},
      ],
    },
    stats: {views: 'Millions', likes: 'Mixed', verified: 'tested'},
  },
  {
    name: 'Voicemod',
    website: 'https://voicemod.net',
    tagline: 'Free real-time voice changer.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['windows', 'mac'],
    },
    content: {
      intro:
        'Real-time voice changing software for gamers and streamers, now with AI voice personas.',
      features: ['AI Voices', 'Soundboard', 'Discord integration'],
      limitations: ['AI voices require Pro', 'Resource heavy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily rotating voices']},
        {name: 'Pro', price: '$45/life', features: ['All voices'], highlight: true},
      ],
    },
    stats: {views: 'Gamers', likes: 'Fun', verified: 'tested'},
  },
  {
    name: 'Murf.ai',
    website: 'https://murf.ai',
    tagline: 'Go from text to speech with a versatile AI voice generator.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web'],
    },
    content: {
      intro:
        'Studio-quality TTS designed for e-learning and corporate videos with precise timing controls.',
      features: ['Video sync', 'Voice changer', 'Google Slides add-on'],
      limitations: ['Downloads locked on free', 'Expensive for commercial'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10 mins generation']},
        {name: 'Creator', price: '$29/mo', features: ['Downloads'], highlight: true},
      ],
    },
    stats: {views: 'Corporate', likes: 'High', verified: 'tested'},
  },
  {
    name: 'DeepBrain',
    website: 'https://deepbrain.io',
    tagline: 'AI Studios for realistic avatars.',
    filters: {
      pricing: 'paid',
      category: 'video generation',
      platforms: ['web'],
    },
    content: {
      intro:
        'Competitor to HeyGen/Synthesia, offering kiosk-ready AI avatars for conversational experiences.',
      features: ['Conversational AI', 'PPT to Video', 'Custom Avatar'],
      limitations: ['Pricing', 'Rendering time'],
      pricing: [{name: 'Starter', price: '$30/mo', features: ['10 mins'], highlight: true}],
    },
    stats: {views: 'Business', likes: 'Solid', verified: 'tested'},
  },
  {
    name: 'Warp',
    website: 'https://warp.dev',
    tagline: 'The terminal for the 21st century.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['mac', 'linux'],
    },
    content: {
      intro:
        'A terminal emulator that works like a doc, with AI command search and error explanation built in.',
      features: ['Warp AI', 'Block selection', 'Team sharing'],
      limitations: ['Login required', 'Windows in beta'],
      pricing: [
        {name: 'Free', price: '$0', features: ['20 AI/day']},
        {name: 'Pro', price: '$12/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Mintlify',
    website: 'https://mintlify.com',
    tagline: 'Beautiful documentation that writes itself.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['web', 'vscode'],
    },
    content: {
      intro:
        'Scans your code and automatically generates documentation and guides, hosted on a beautiful site.',
      features: ['Auto-docs', 'VS Code extension', 'Analytics'],
      limitations: ['Customization limits', 'Pro for private repos'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Public repos']},
        {name: 'Startup', price: '$150/mo', features: ['Private repos'], highlight: true},
      ],
    },
    stats: {views: 'Startups', likes: 'Sleek', verified: 'tested'},
  },
  {
    name: 'LangChain',
    website: 'https://langchain.com',
    tagline: 'Build context-aware applications.',
    filters: {
      pricing: 'open source',
      category: 'coding/framework',
      platforms: ['python', 'js'],
    },
    content: {
      intro:
        'The standard framework for connecting LLMs to other data sources and creating chains of thought.',
      features: ['Chains', 'Agents', 'Retrieval'],
      limitations: ['Steep learning curve', 'Documentation moves fast'],
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Code base']},
        {name: 'LangSmith', price: 'Usage', features: ['Monitoring'], highlight: true},
      ],
    },
    stats: {views: 'Ubiquitous', likes: 'Standard', verified: 'tested'},
  },
  {
    name: 'Hugging Face',
    website: 'https://huggingface.co',
    tagline: 'The AI community building the future.',
    filters: {
      pricing: 'free',
      category: 'platform',
      platforms: ['web'],
    },
    content: {
      intro:
        "The 'GitHub of AI'—hosting hundreds of thousands of open-source models, datasets, and demos.",
      features: ['Model Hub', 'Spaces (Demos)', 'Inference API'],
      limitations: ['Compute costs for training', 'Technical'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Hosting']},
        {name: 'Pro', price: '$9/mo', features: ['Higher rate limits'], highlight: true},
      ],
    },
    stats: {views: 'Massive', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Ollama',
    website: 'https://ollama.com',
    tagline: 'Get up and running with large language models.',
    filters: {
      pricing: 'free',
      category: 'coding',
      platforms: ['mac', 'linux', 'windows'],
    },
    content: {
      intro:
        'The easiest way to run models like Llama 3, Mistral, and Gemma locally on your machine via CLI.',
      features: ['One-click run', 'Modelfile customization', 'API'],
      limitations: ['CLI focus', 'Requires good hardware'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'LM Studio',
    website: 'https://lmstudio.ai',
    tagline: 'Discover, download, and run local LLMs.',
    filters: {
      pricing: 'free',
      category: 'coding',
      platforms: ['mac', 'windows', 'linux'],
    },
    content: {
      intro:
        'A GUI for finding and running quantized models locally. Great for testing models without code.',
      features: ['Search huggingface', 'Chat UI', 'Local server'],
      limitations: ['Hardware dependent', 'No training'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Easy', verified: 'tested'},
  },
  {
    name: 'Groq',
    website: 'https://groq.com',
    tagline: 'Inference at the speed of light.',
    filters: {
      pricing: 'freemium',
      category: 'infrastructure',
      platforms: ['api', 'web'],
    },
    content: {
      intro:
        'Provides the fastest AI inference in the world using custom LPU chips, making Llama 3 feel instant.',
      features: ['500+ tokens/sec', 'Llama/Mistral support', 'API'],
      limitations: ['Context window limits', 'Rate limits on free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Beta access']},
        {name: 'Paid', price: 'Usage', features: ['Higher limits'], highlight: true},
      ],
    },
    stats: {views: 'Viral', likes: 'Fastest', verified: 'tested'},
  },
  {
    name: 'AssemblyAI',
    website: 'https://assemblyai.com',
    tagline: 'API for speech recognition and understanding.',
    filters: {
      pricing: 'usage-based',
      category: 'audio/api',
      platforms: ['api'],
    },
    content: {
      intro:
        'Top-tier speech-to-text API for developers building transcription and audio intelligence apps.',
      features: ['Speaker diarization', 'LeMUR (LLM over audio)', 'High accuracy'],
      limitations: ['Developer focus', 'API cost'],
      pricing: [
        {name: 'Pay-as-you-go', price: '$0.37/hr', features: ['Standard'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Reliable', verified: 'tested'},
  },
  {
    name: 'GPTZero',
    website: 'https://gptzero.me',
    tagline: 'The gold standard in AI detection.',
    filters: {
      pricing: 'freemium',
      category: 'detection',
      platforms: ['web', 'chrome'],
    },
    content: {
      intro: 'Detects if text was written by AI, widely used by educators to check essays.',
      features: ['File upload', 'Highlight AI sentences', 'Chrome extension'],
      limitations: ['False positives exist', 'Can be bypassed'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic scans']},
        {name: 'Essential', price: '$10/mo', features: ['More words'], highlight: true},
      ],
    },
    stats: {views: 'Education', likes: 'Mixed', verified: 'tested'},
  },
  {
    name: 'Undetectable.ai',
    website: 'https://undetectable.ai',
    tagline: 'Bypass AI detectors.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Rewrites AI-generated text to humanize it and bypass detectors like Turnitin and GPTZero.',
      features: ['Humanizer', 'Readability matching', 'Detection check'],
      limitations: ['Ethical gray area', 'Quality can drop'],
      pricing: [{name: 'Monthly', price: '$9.99/mo', features: ['10k words'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Useful', verified: 'tested'},
  },
  {
    name: 'Rytr',
    website: 'https://rytr.me',
    tagline: 'A better, faster way to write profile.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web', 'chrome'],
    },
    content: {
      intro: 'A budget-friendly AI writer for emails, blogs, and ads.',
      features: ['40+ use cases', '20+ tones', 'Plagiarism check'],
      limitations: ['Simpler output than Jasper', 'Character limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10k chars/mo']},
        {name: 'Saver', price: '$9/mo', features: ['100k chars'], highlight: true},
      ],
    },
    stats: {views: 'Budget', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'FeedHive',
    website: 'https://feedhive.com',
    tagline: 'AI-powered social media management.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro:
        'Social scheduler that uses AI to predict the best time to post and helps repurpose content.',
      features: ['Recycle content', 'AI prediction', 'Analytics'],
      limitations: ['Learning curve', 'Connection limits'],
      pricing: [{name: 'Creator', price: '$19/mo', features: ['4 socials'], highlight: true}],
    },
    stats: {views: 'Creators', likes: 'High', verified: 'tested'},
  },
  {
    name: 'ChatPDF',
    website: 'https://chatpdf.com',
    tagline: 'Chat with any PDF.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web'],
    },
    content: {
      intro: 'Simple, fast tool to upload PDFs and ask questions about them.',
      features: ['Citation backing', 'Multi-file', 'Fast'],
      limitations: ['Page limits on free', 'Simpler than NotebookLM'],
      pricing: [
        {name: 'Free', price: '$0', features: ['120 pages']},
        {name: 'Plus', price: '$5/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Jenni AI',
    website: 'https://jenni.ai',
    tagline: 'Supercharge your research and writing.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro:
        'AI writing assistant specifically for academic papers, with built-in citation finding.',
      features: ['Autocomplete', 'Citation engine', 'Plagiarism check'],
      limitations: ['Daily limits', 'Academic focus'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Unlimited', price: '$20/mo', features: ['Full access'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'DeepL',
    website: 'https://deepl.com',
    tagline: "The world's most accurate translator.",
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web', 'app'],
    },
    content: {
      intro:
        'Known for providing much more natural and nuanced translations than Google Translate.',
      features: ['Document translation', 'Glossary', 'Tone selection'],
      limitations: ['Fewer languages than Google', 'File limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Text translation']},
        {name: 'Pro', price: '$8.75/mo', features: ['Unlimited text'], highlight: true},
      ],
    },
    stats: {views: 'Global', likes: 'Best', verified: 'tested'},
  },
  {
    name: 'Sider',
    website: 'https://sider.ai',
    tagline: 'ChatGPT sidebar + Vision.',
    filters: {
      pricing: 'freemium',
      category: 'extension',
      platforms: ['chrome', 'edge'],
    },
    content: {
      intro:
        'A browser sidebar that integrates Gemini, Claude, and GPT-4 for analyzing web pages and images.',
      features: ['Multi-model', 'OCR', 'Email assist'],
      limitations: ['Credits per model', 'UI busy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['30 queries/day']},
        {name: 'Basic', price: '$10/mo', features: ['Fast queries'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Good', verified: 'tested'},
  },
  {
    name: 'Pencil',
    website: 'https://trypencil.com',
    tagline: 'The AI ad generator for brands.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro: 'Generates Facebook and TikTok ads, then predicts which ones will perform best.',
      features: ['Ad generation', 'Prediction scores', 'Stock library'],
      limitations: ['Expensive', 'Requires brand assets'],
      pricing: [{name: 'Pro', price: '$119/mo', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 'Agencies', likes: 'ROI', verified: 'tested'},
  },
  {
    name: 'AdCreative.ai',
    website: 'https://adcreative.ai',
    tagline: 'Artificial Intelligence for advertising.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro: 'Focuses on generating high-conversion banners and creatives for social media ads.',
      features: ['Creative scoring', 'Batch generation', 'Social resize'],
      limitations: ['Design variety', 'Credit system'],
      pricing: [{name: 'Startup', price: '$29/mo', features: ['10 credits'], highlight: true}],
    },
    stats: {views: 'Marketers', likes: 'Fast', verified: 'tested'},
  },
  {
    name: 'Anyword',
    website: 'https://anyword.com',
    tagline: 'The AI writing platform for enterprise marketing.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
    },
    content: {
      intro:
        "Writes marketing copy and assigns a 'Performance Prediction Score' based on real data.",
      features: ['Predictive scoring', 'Brand voice', 'Website optimization'],
      limitations: ['Expensive', 'Enterprise focus'],
      pricing: [{name: 'Starter', price: '$39/mo', features: ['1 seat'], highlight: true}],
    },
    stats: {views: 'Pros', likes: 'Data', verified: 'tested'},
  },
  {
    name: 'Merlin',
    website: 'https://getmerlin.in',
    tagline: '1-click access to AI on any website.',
    filters: {
      pricing: 'freemium',
      category: 'extension',
      platforms: ['chrome'],
    },
    content: {
      intro:
        'A browser extension that summarizes YouTube videos, blogs, and helps write LinkedIn posts.',
      features: ['YouTube Summaries', 'LinkedIn helper', 'GPT-4 access'],
      limitations: ['Query limits', 'UI overlays'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Pro', price: '$19/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Useful', verified: 'tested'},
  },
  {
    name: 'Foxit AI',
    website: 'https://foxit.com',
    tagline: 'Smart PDF editor.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['desktop', 'web'],
    },
    content: {
      intro:
        'Integrated AI assistant within the Foxit PDF editor to summarize, rewrite, and explain document content.',
      features: ['Document chat', 'Smart redact', 'Summarize'],
      limitations: ['Requires software license', 'Add-on cost'],
      pricing: [{name: 'Editor Suite', price: '$100/yr', features: ['Full edit'], highlight: true}],
    },
    stats: {views: 'Business', likes: 'Reliable', verified: 'tested'},
  },
  {
    name: 'Resemble AI',
    website: 'https://resemble.ai',
    tagline: 'Generative voice AI for enterprise.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'Focuses on high-security voice cloning and detection, often used for localization and games.',
      features: ['Deepfake detection', 'Localize (Dubbing)', 'Real-time API'],
      limitations: ['Enterprise pricing', 'Strict verification'],
      pricing: [{name: 'Basic', price: '$0.006/sec', features: ['Pay as you go'], highlight: true}],
    },
    stats: {views: 'Enterprise', likes: 'Secure', verified: 'tested'},
  },
  {
    name: 'Copyleaks',
    website: 'https://copyleaks.com',
    tagline: 'AI content detection and plagiarism checker.',
    filters: {
      pricing: 'freemium',
      category: 'detection',
      platforms: ['web', 'api'],
    },
    content: {
      intro: 'Enterprise-grade detection for AI text and code, used by schools and businesses.',
      features: ['Code detection', 'Multi-language', 'LMS integration'],
      limitations: ['False positives', 'Daily limit'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Scan only']},
        {name: 'Pro', price: '$10/mo', features: ['Full reports'], highlight: true},
      ],
    },
    stats: {views: 'Education', likes: 'Strict', verified: 'tested'},
  },
  {
    name: 'Candy.ai',
    website: 'https://candy.ai',
    tagline: 'Chat with your dream companion.',
    filters: {
      pricing: 'freemium',
      category: 'companion',
      platforms: ['web'],
    },
    content: {
      intro:
        'A platform for chatting with lifelike AI characters, focusing on immersion and roleplay.',
      features: ['Visuals', 'Roleplay', 'Character creation'],
      limitations: ['NSFW focus', 'Message limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Premium', price: '$12.99/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Niche', verified: 'tested'},
  },
  {
    name: 'Play.ht',
    website: 'https://play.ht',
    tagline: 'Generative voice AI.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        "Known for their 'Parrot' model which offers ultra-realistic, conversational speech generation.",
      features: ['Voice cloning', 'Parrot model', 'Podcast hosting'],
      limitations: ['Interface UI', 'Cloning quality varies'],
      pricing: [
        {name: 'Free', price: '$0', features: ['12.5k chars']},
        {name: 'Creator', price: '$31/mo', features: ['3M chars/yr'], highlight: true},
      ],
    },
    stats: {views: 'High', likes: 'Realism', verified: 'tested'},
  },
  {
    name: 'StealthWriter',
    website: 'https://stealthwriter.ai',
    tagline: 'Undetectable AI writing.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web'],
    },
    content: {
      intro: "Rewrites content with 'Ninja' modes to vary sentence structure and bypass detectors.",
      features: ['Ninja levels', 'Bypass Turnitin', 'Blog generator'],
      limitations: ['Readability can suffer', 'Free limit'],
      pricing: [
        {name: 'Free', price: '$0', features: ['300 words']},
        {name: 'Basic', price: '$20/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 'Students', likes: 'Mixed', verified: 'tested'},
  },
  {
    name: 'OpenRouter',
    website: 'https://openrouter.ai',
    tagline: 'A unified interface for LLMs.',
    filters: {
      pricing: 'usage-based',
      category: 'infrastructure',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'An aggregator that lets you access almost any model (Claude, GPT, Llama, Mistral) through a single API.',
      features: ['Compare prices', 'No sub needed', 'Crypto payment'],
      limitations: ['Middleman latency', 'API focus'],
      pricing: [{name: 'Usage', price: 'Varies', features: ['Pay per token'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Top', verified: 'tested'},
  },
  {
    name: 'Hix AI',
    website: 'https://hix.ai',
    tagline: 'The most powerful all-in-one AI writing copilot.',
    filters: {
      pricing: 'paid',
      category: 'writing',
      platforms: ['web', 'chrome'],
    },
    content: {
      intro:
        'A massive suite of tools including an essay writer, email generator, and browser extension.',
      features: ['120+ tools', 'HIX Bypass', 'BrowserBar'],
      limitations: ['Overwhelming UI', 'Subscription structure'],
      pricing: [{name: 'Basic', price: '$9.99/mo', features: ['GPT-3.5'], highlight: true}],
    },
    stats: {views: 'High', likes: 'Volume', verified: 'tested'},
  },
  {
    name: 'Fireworks AI',
    website: 'https://fireworks.ai',
    tagline: 'The fastest production platform for gen AI.',
    filters: {
      pricing: 'usage-based',
      category: 'infrastructure',
      platforms: ['api'],
    },
    content: {
      intro:
        ' Hosting provider for open-source models optimized for low latency and high throughput.',
      features: ['FireFunction', 'Mixtral 8x22b', 'Fine-tuning'],
      limitations: ['Developer tool', 'No chat UI'],
      pricing: [{name: 'Usage', price: 'Low', features: ['Per token'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Fast', verified: 'tested'},
  },
  {
    name: 'WellSaid Labs',
    website: 'https://wellsaidlabs.com',
    tagline: 'Text-to-speech for creative teams.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web', 'api'],
    },
    content: {
      intro:
        'Focuses on achieving the absolute highest human parity in voice generation for corporate use.',
      features: ['Voice avatars', 'Pronunciation library', 'Collaboration'],
      limitations: ['Expensive', 'No free plan (trial only)'],
      pricing: [{name: 'Maker', price: '$49/mo', features: ['5 projects'], highlight: true}],
    },
    stats: {views: 'Pro', likes: 'Quality', verified: 'tested'},
  },
  {
    name: 'Supabase (AI)',
    website: 'https://supabase.com',
    tagline: 'The open source Firebase alternative.',
    filters: {
      pricing: 'freemium',
      category: 'coding/backend',
      platforms: ['web'],
    },
    content: {
      intro:
        'Now includes native vector search and AI embeddings to help developers build AI apps.',
      features: ['Vector database', 'Edge functions', 'Postgres'],
      limitations: ['Dev knowledge required', 'Self-hosting complex'],
      pricing: [
        {name: 'Free', price: '$0', features: ['500MB db']},
        {name: 'Pro', price: '$25/mo', features: ['8GB db'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Essential', verified: 'tested'},
  },
  {
    name: 'Ashby',
    website: 'https://ashbyhq.com',
    tagline: 'All-in-one recruiting software.',
    filters: {
      pricing: 'paid',
      category: 'hr',
      platforms: ['web'],
    },
    content: {
      intro: 'Modern ATS with built-in AI for sourcing candidates and scheduling interviews.',
      features: ['AI sourcing', 'Automated scheduling', 'Analytics'],
      limitations: ['Targeted at startups', 'Price opaque'],
      pricing: [{name: 'Custom', price: 'Quote', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 'Startups', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Rodin',
    website: 'https://hyperhuman.deemos.com',
    tagline: '3D GenAI for digital avatars.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
    },
    content: {
      intro: 'Specializes in creating high-fidelity 3D heads and avatars from a single image.',
      features: ['Text-to-Avatar', 'Image-to-3D', 'PBR materials'],
      limitations: ['Head focus mainly', 'Credits'],
      pricing: [{name: 'Free', price: '$0', features: ['Trial']}],
    },
    stats: {views: 'Niche', likes: 'Quality', verified: 'tested'},
  },
  {
    name: 'Jan',
    website: 'https://jan.ai',
    tagline: 'Turn your computer into an AI machine.',
    filters: {
      pricing: 'free',
      category: 'coding',
      platforms: ['mac', 'windows', 'linux'],
    },
    content: {
      intro: 'An open-source ChatGPT alternative that runs entirely offline on your desktop.',
      features: ['Offline mode', 'Local API', 'Extension system'],
      limitations: ['Hardware heavy', 'UI is simple'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 'Privacy', likes: 'High', verified: 'tested'},
  },
  {
    name: 'Vercel AI SDK',
    website: 'https://sdk.vercel.ai',
    tagline: 'The AI SDK for the web.',
    filters: {
      pricing: 'open source',
      category: 'coding',
      platforms: ['js', 'react'],
    },
    content: {
      intro: 'A library that makes building AI chat interfaces in Next.js/React incredibly simple.',
      features: ['Stream UI', 'useChat hook', 'Provider agnostic'],
      limitations: ['JS/TS focused', 'Framework specific'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Free'], highlight: true}],
    },
    stats: {views: 'Devs', likes: 'Standard', verified: 'tested'},
  },
  {
    name: 'Gladia',
    website: 'https://gladia.io',
    tagline: 'Audio intelligence API.',
    filters: {
      pricing: 'usage-based',
      category: 'audio/api',
      platforms: ['api'],
    },
    content: {
      intro:
        'Real-time transcription and audio analysis API that handles code-switching (multiple languages) exceptionally well.',
      features: ['Code switching', 'Real-time', 'Sentiment'],
      limitations: ['API only', 'Pay per hour'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10 hrs/mo']},
        {name: 'Pro', price: 'Usage', features: ['Scale'], highlight: true},
      ],
    },
    stats: {views: 'Devs', likes: 'Fast', verified: 'tested'},
  },

  // third round of tools 200-300

  {
    name: 'LangChain',
    website: 'https://langchain.com',
    tagline: 'The framework for building context-aware applications.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python', 'javascript'],
      open_source: true,
      deployment: 'local/cloud',
    },
    content: {
      intro:
        'The industry-standard orchestration framework that connects LLMs to other data sources, APIs, and computation.',
      features: ['Chains', 'Agents', 'Retrieval (RAG)', 'LangSmith monitoring'],
      limitations: ['Documentation changes frequently due to speed of dev', 'Steep learning curve'],
      developer: 'LangChain Inc.',
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Core library']},
        {name: 'LangSmith', price: 'Usage', features: ['Tracing & Monitoring'], highlight: true},
      ],
    },
    stats: {views: 95, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Pinecone',
    website: 'https://pinecone.io',
    tagline: 'Long-term memory for AI.',
    filters: {
      pricing: 'freemium',
      category: 'database',
      platforms: ['web', 'api'],
      open_source: false,
      deployment: 'managed',
    },
    content: {
      intro:
        'A fully managed vector database that makes it easy to add semantic search and long-term memory to high-performance AI applications.',
      features: ['Serverless architecture', 'Real-time updates', 'Hybrid search'],
      limitations: ['Closed source', 'Can get expensive at scale'],
      pricing: [
        {name: 'Starter', price: '$0', features: ['1 index', '100k vectors']},
        {name: 'Serverless', price: 'Usage', features: ['Unlimited scale'], highlight: true},
      ],
    },
    stats: {views: 88, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Weaviate',
    website: 'https://weaviate.io',
    tagline: 'AI-native open-source vector database.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['docker', 'kubernetes', 'cloud'],
      open_source: true,
      deployment: 'hybrid',
    },
    content: {
      intro:
        'An open-source vector database that stores both objects and vectors, allowing for combined vector and scalar search.',
      features: ['Modular architecture', 'GraphQL API', 'Built-in vectorizers'],
      limitations: ['Self-hosting requires maintenance', 'Cloud version is paid'],
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Docker container']},
        {name: 'Cloud', price: '$0.025/hr', features: ['Managed'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'AutoGen',
    website: 'https://microsoft.github.io/autogen',
    tagline: 'Enable next-gen LLM applications.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "Microsoft's framework that enables the development of LLM applications using multiple agents that can converse with each other to solve tasks.",
      features: ['Multi-agent conversation', 'Code execution', 'Human-in-the-loop'],
      limitations: ['Complex to control agent loops', 'Research-focused'],
      developer: 'Microsoft Research',
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 85, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'CrewAI',
    website: 'https://crewai.com',
    tagline: 'Orchestrate role-playing AI agents.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "A framework built on top of LangChain that allows you to design 'crews' of agents with specific roles (e.g., 'Researcher', 'Writer') to complete goals.",
      features: ['Role-playing agents', 'Task delegation', 'Process management'],
      limitations: ['New ecosystem', 'Dependency on LangChain'],
      pricing: [{name: 'Free', price: '$0', features: ['Open source']}],
    },
    stats: {views: 82, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Chroma',
    website: 'https://trychroma.com',
    tagline: 'The AI-native open-source embedding database.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['python', 'javascript'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'Simple, lightweight, and focused on developer productivity. It runs in-memory or persists to disk easily.',
      features: ['Simple API', 'In-memory mode', 'Feature-rich queries'],
      limitations: ['Less scalable than Pinecone for massive data', 'Newer'],
      pricing: [{name: 'Free', price: '$0', features: ['Apache 2.0']}],
    },
    stats: {views: 78, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'LlamaIndex',
    website: 'https://llamaindex.ai',
    tagline: 'Data framework for LLM applications.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python', 'javascript'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'Specifically designed to connect custom data (PDFs, SQL, Notion) to LLMs via advanced indexing and retrieval strategies.',
      features: ['Data connectors (LlamaHub)', 'Query engines', 'Router agents'],
      limitations: ['Can be overwhelming', 'Overlaps with LangChain'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 90, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Qdrant',
    website: 'https://qdrant.tech',
    tagline: 'Vector similarity search engine.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['rust', 'docker'],
      open_source: true,
      deployment: 'hybrid',
    },
    content: {
      intro:
        'A high-performance vector search engine written in Rust, known for its speed and filterable payload support.',
      features: ['Written in Rust', 'Filterable HNSW', 'Distributed deployment'],
      limitations: ['Smaller community than Pinecone', 'Rust learning curve for contribs'],
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Docker']},
        {name: 'Cloud', price: '$25/mo', features: ['Managed'], highlight: true},
      ],
    },
    stats: {views: 70, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Topaz Video AI',
    website: 'https://topazlabs.com',
    tagline: 'Professional video upscaling and restoration.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['windows', 'mac'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro:
        'The industry standard for upscaling footage to 4K/8K, deinterlacing, and removing motion blur using AI models.',
      features: ['Iris/Proteus models', 'Frame interpolation', 'Motion deblur'],
      limitations: ['One-time high cost', 'Requires powerful GPU'],
      pricing: [{name: 'License', price: '$299', features: ['Lifetime use'], highlight: true}],
    },
    stats: {views: 88, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'DataSnipper',
    website: 'https://datasnipper.com',
    tagline: 'Intelligent automation for audit and finance.',
    filters: {
      pricing: 'enterprise',
      category: 'finance',
      platforms: ['excel'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'Embeds directly into Excel to automate the matching of invoices and receipts to audit data.',
      features: ['Document matching', 'Excel integration', 'Audit trail'],
      limitations: ['Expensive enterprise tool', 'Excel dependency'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 65, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'MindBridge',
    website: 'https://mindbridge.ai',
    tagline: "The world's leading AI financial risk discovery platform.",
    filters: {
      pricing: 'enterprise',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'Analyzes 100% of financial transactions (ledgers) to identify anomalies, fraud, and risk scores.',
      features: ['Risk scoring', 'Anomaly detection', '100% audit coverage'],
      limitations: ['High cost', 'Complex implementation'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Risk analytics'], highlight: true},
      ],
    },
    stats: {views: 60, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Synplant 2',
    website: 'https://soniccharge.com/synplant',
    tagline: 'Genetic approach to sound design.',
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['vst', 'mac', 'windows'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'A synthesizer that uses AI (Genopatch) to listen to an audio sample and recreate the synth patch settings to match it.',
      features: ['Genopatch (Audio-to-Synth)', 'DNA editor', 'Organic sound'],
      limitations: ['VST plugin format', 'Learning curve'],
      pricing: [{name: 'License', price: '$129', features: ['Full plugin'], highlight: true}],
    },
    stats: {views: 75, likes: 9.8, verified: 'tested'},
  },
  {
    name: 'Planner 5D',
    website: 'https://planner5d.com',
    tagline: 'Advanced home design tool.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web', 'ios', 'android'],
      open_source: false,
      industry: 'interior',
    },
    content: {
      intro:
        'Allows users to upload a floor plan and uses AI to convert it into a 3D model, or auto-arrange furniture.',
      features: ['Plan recognition', 'Auto-furnish', 'AR view'],
      limitations: ['High quality renders cost extra', 'Consumer focused'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic catalog']},
        {name: 'Premium', price: '$19.99/mo', features: ['Full catalog'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 8.2, verified: 'tested'},
  },
  {
    name: 'BioNeMo',
    website: 'https://nvidia.com',
    tagline: 'Generative AI for drug discovery.',
    filters: {
      pricing: 'enterprise',
      category: 'science',
      platforms: ['cloud', 'api'],
      open_source: false,
      industry: 'biotech',
    },
    content: {
      intro:
        "NVIDIA's cloud service for training and deploying supercomputing-scale generative AI models for biology.",
      features: ['Protein structure prediction', 'Small molecule generation', 'Cloud API'],
      limitations: ['Requires technical expertise', 'Enterprise/Research focus'],
      pricing: [{name: 'Enterprise', price: 'Usage', features: ['Cloud compute'], highlight: true}],
    },
    stats: {views: 55, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Kaedim',
    website: 'https://kaedim3d.com',
    tagline: '2D to 3D in minutes.',
    filters: {
      pricing: 'paid',
      category: '3d',
      platforms: ['web'],
      open_source: false,
      deployment: 'cloud',
    },
    content: {
      intro:
        'Uses machine learning (and human QA) to convert 2D images into production-ready 3D assets.',
      features: ['Image-to-Mesh', 'Automatic UVs', 'Human-in-loop QA'],
      limitations: ['Wait times for QA', 'Expensive for hobbyists'],
      pricing: [{name: 'Starter', price: '$150/mo', features: ['10 assets'], highlight: true}],
    },
    stats: {views: 68, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Rewind (Limitless)',
    website: 'https://limitless.ai',
    tagline: 'The AI for your meetings.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['mac', 'wearable'],
      open_source: false,
      hardware_req: 'medium',
    },
    content: {
      intro:
        'Records everything you see, say, and hear on your Mac (or via the Pendant) to create a searchable memory database.',
      features: ['Screen recording', 'Audio transcription', 'Privacy-first (local storage)'],
      limitations: ['Mac only (software)', 'Privacy concerns for some'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited rewinds']},
        {name: 'Pro', price: '$19/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 89, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'HitPaw VikPea',
    website: 'https://hitpaw.com',
    tagline: 'AI video enhancer.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['windows', 'mac'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro: 'A budget-friendly alternative to Topaz for upscaling and sharpening blurry videos.',
      features: ['Face model', 'Animation model', 'Colorize'],
      limitations: ['Slower than Topaz', 'UI is basic'],
      pricing: [{name: 'Monthly', price: '$39.99', features: ['Full access'], highlight: true}],
    },
    stats: {views: 60, likes: 7.5, verified: 'tested'},
  },
  {
    name: 'CodeWP',
    website: 'https://codewp.ai',
    tagline: 'AI coding assistant for WordPress.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['web'],
      open_source: false,
      industry: 'web dev',
    },
    content: {
      intro:
        'Specifically trained on WordPress, PHP, and WooCommerce to generate code snippets that actually work in WP.',
      features: ['WP specific training', 'Snippet library', 'Error fixing'],
      limitations: ['Niche (WordPress only)', 'Snippet focus'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10 snippets/mo']},
        {name: 'Pro', price: '$18/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 58, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Orb Producer Suite',
    website: 'https://orbplugins.com',
    tagline: 'AI MIDI generator plugins.',
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['vst', 'mac', 'windows'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'A suite of 4 plugins (Chords, Melody, Bass, Arpeggio) that generate infinite musical patterns based on your parameters.',
      features: ['Harmonic sync', 'MIDI export', 'Polyphony control'],
      limitations: ['Sounds can be generic', 'Paid suite'],
      pricing: [{name: 'Suite', price: '€99', features: ['All 4 plugins'], highlight: true}],
    },
    stats: {views: 62, likes: 8.0, verified: 'tested'},
  },
  {
    name: 'Homestyler',
    website: 'https://homestyler.com',
    tagline: '3D home design & floor plan tool.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web', 'mobile'],
      open_source: false,
      industry: 'interior',
    },
    content: {
      intro:
        'Professional-grade interior design platform that includes an AI designer to auto-generate room concepts from empty shells.',
      features: ['4K rendering', 'Real furniture catalog', 'AI decorator'],
      limitations: ['Render times', 'Learning curve for editor'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard SD renders']},
        {name: 'Pro', price: '$4.99/mo', features: ['4K renders'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Milvus',
    website: 'https://milvus.io',
    tagline: 'Cloud-native vector database.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['cloud', 'docker'],
      open_source: true,
      deployment: 'hybrid',
    },
    content: {
      intro:
        'Highly scalable open-source vector database built for managing massive embedding vectors.',
      features: ['Hybrid search', 'Cloud-native', 'Zilliz (managed version)'],
      limitations: ['Complex architecture', 'Resource intensive'],
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Self-hosted']},
        {name: 'Zilliz', price: 'Usage', features: ['Managed'], highlight: true},
      ],
    },
    stats: {views: 72, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Datarails',
    website: 'https://datarails.com',
    tagline: 'The financial planning and analysis platform for Excel users.',
    filters: {
      pricing: 'enterprise',
      category: 'finance',
      platforms: ['excel', 'web'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'Automates data consolidation and reporting for FP&A teams while letting them stay in their native Excel environment.',
      features: ['Excel add-in', 'Data visualization', 'Auto-consolidation'],
      limitations: ['Implementation time', 'Cost'],
      pricing: [{name: 'Quote', price: 'Custom', features: ['Full platform'], highlight: true}],
    },
    stats: {views: 55, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'RoseTTAFold',
    website: 'https://github.com/RosettaCommons/RoseTTAFold',
    tagline: 'Protein structure prediction.',
    filters: {
      pricing: 'open source',
      category: 'science',
      platforms: ['linux'],
      open_source: true,
      industry: 'biology',
    },
    content: {
      intro:
        'The open-source alternative to AlphaFold, capable of predicting protein structures and interactions with high accuracy.',
      features: ['Protein-protein interaction', 'Fast inference', '3-track network'],
      limitations: ['Academic focus', 'Requires Linux/GPU'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License'], highlight: true}],
    },
    stats: {views: 50, likes: 9.7, verified: 'tested'},
  },
  {
    name: 'ChatDev',
    website: 'https://github.com/OpenBMB/ChatDev',
    tagline: 'Create software with a virtual company.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A virtual chat-powered software development company where agents (CEO, CTO, Programmer) collaborate to build apps.',
      features: ['Virtual company simulation', 'End-to-end coding', 'Role assignment'],
      limitations: ['Can loop indefinitely', 'Experimental'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 78, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Haystack',
    website: 'https://haystack.deepset.ai',
    tagline: 'Build LLM apps that matter.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'An end-to-end framework for building NLP pipelines, specifically focused on RAG and semantic search.',
      features: ['Modular pipelines', 'Document stores', 'Agent support'],
      limitations: ['Less hype than LangChain', 'Enterprise focused'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 65, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'Workiva',
    website: 'https://workiva.com',
    tagline: 'Transparent reporting for a better world.',
    filters: {
      pricing: 'enterprise',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'A platform for ESG, audit, and financial reporting that uses AI to automate data linking and narrative generation.',
      features: ['Connected reporting', 'GenAI for ESG', 'Compliance'],
      limitations: ['Heavy enterprise software', 'Training required'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 58, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Pieces for Developers',
    website: 'https://pieces.app',
    tagline: 'Your AI-enabled snippet manager.',
    filters: {
      pricing: 'free',
      category: 'coding',
      platforms: ['desktop', 'web'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro:
        'Manages your code snippets and uses on-device AI to explain, transform, and generate context for them.',
      features: ['Local AI', 'Snippet auto-save', 'Context awareness'],
      limitations: ['Another tool to manage', 'Desktop app heavy'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access'], highlight: true}],
    },
    stats: {views: 60, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Glass Health',
    website: 'https://glass.health',
    tagline: 'AI for clinical decision support.',
    filters: {
      pricing: 'freemium',
      category: 'medical',
      platforms: ['web'],
      open_source: false,
      industry: 'healthcare',
    },
    content: {
      intro:
        'A platform for doctors to generate differential diagnoses and clinical plans based on patient case descriptions.',
      features: ['Differential diagnosis', 'Clinical plan drafting', 'Evidence based'],
      limitations: ['For medical professionals', 'Disclaimer heavy'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited cases']},
        {name: 'Pro', price: '$30/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 55, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Robin AI',
    website: 'https://robinai.com',
    tagline: 'The legal copilot.',
    filters: {
      pricing: 'paid',
      category: 'legal',
      platforms: ['web', 'word'],
      open_source: false,
      industry: 'legal',
    },
    content: {
      intro:
        'Specializes in reviewing contracts, offering a Word add-in that suggests edits and negotiates clauses automatically.',
      features: ['Contract review', 'Clause library', 'Word integration'],
      limitations: ['Legal liability', 'Subscription only'],
      pricing: [{name: 'Pro', price: 'Custom', features: ['Full review'], highlight: true}],
    },
    stats: {views: 45, likes: 8.4, verified: 'tested'},
  },
  {
    name: 'Deep Genomics',
    website: 'https://deepgenomics.com',
    tagline: 'The future of RNA therapeutics.',
    filters: {
      pricing: 'enterprise',
      category: 'science',
      platforms: ['proprietary'],
      open_source: false,
      industry: 'biotech',
    },
    content: {
      intro:
        "Uses AI ('The Big RNA') to identify targetable mechanisms in RNA and design sterile oligonucleotide therapies.",
      features: ['RNA targeting', 'Drug candidate generation', 'Steric blocking'],
      limitations: ['Not a public tool', 'Research partner'],
      pricing: [{name: 'Partnership', price: 'N/A', features: ['Research'], highlight: true}],
    },
    stats: {views: 40, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'DiffDock',
    website: 'https://github.com/gcorso/DiffDock',
    tagline: 'Diffusion generative models for molecular docking.',
    filters: {
      pricing: 'open source',
      category: 'science',
      platforms: ['linux', 'python'],
      open_source: true,
      industry: 'biotech',
    },
    content: {
      intro:
        'A state-of-the-art open-source model for molecular docking (predicting how a drug binds to a protein) using diffusion.',
      features: ['High accuracy', 'Diffusion model', 'Open code'],
      limitations: ['Requires technical setup', 'Research tool'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License'], highlight: true}],
    },
    stats: {views: 45, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'AppZen',
    website: 'https://appzen.com',
    tagline: 'AI for modern finance.',
    filters: {
      pricing: 'enterprise',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'Audits 100% of expense reports and invoices before payment, checking for policy violations and fraud.',
      features: ['Expense audit', 'Invoice automation', 'Compliance'],
      limitations: ['Enterprise pricing', 'Setup required'],
      pricing: [{name: 'Custom', price: 'Quote', features: ['Audit platform'], highlight: true}],
    },
    stats: {views: 50, likes: 8.3, verified: 'tested'},
  },
  {
    name: 'Emergent Drums',
    website: 'https://audialab.com',
    tagline: 'Generate infinite drum samples.',
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['vst'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'A VST plugin that uses AI to generate new drum samples from scratch, not just finding them in a library.',
      features: ['Sample generation', 'Similar sound search', 'VST/AU'],
      limitations: ['Subscription model', 'Specific to drums'],
      pricing: [{name: 'Monthly', price: '$14.99', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 52, likes: 8.1, verified: 'tested'},
  },
  {
    name: 'qbiq',
    website: 'https://qbiq.ai',
    tagline: 'Generative AI for real estate planning.',
    filters: {
      pricing: 'paid',
      category: 'architecture',
      platforms: ['web'],
      open_source: false,
      industry: 'real estate',
    },
    content: {
      intro:
        'Automatically generates optimal floor plan layouts for commercial real estate in seconds.',
      features: ['Layout generation', '3D walk-through', 'Utilization analysis'],
      limitations: ['Commercial focus', 'Pricing not public'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Full platform'], highlight: true},
      ],
    },
    stats: {views: 48, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'TestFit',
    website: 'https://testfit.io',
    tagline: 'Real estate feasibility software.',
    filters: {
      pricing: 'paid',
      category: 'architecture',
      platforms: ['desktop'],
      open_source: false,
      industry: 'real estate',
    },
    content: {
      intro:
        'A generative design tool that helps developers and architects solve site feasibility and massing in milliseconds.',
      features: ['Real-time massing', 'Parking generation', 'Deal analytics'],
      limitations: ['High cost', 'Steep learning curve'],
      pricing: [{name: 'Pro', price: 'Custom', features: ['Full license'], highlight: true}],
    },
    stats: {views: 50, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Swarm',
    website: 'https://github.com/openai/swarm',
    tagline: 'Orchestrate agents ergonomically.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "OpenAI's educational framework for exploring multi-agent systems, focusing on lightweight, stateless handoffs.",
      features: ['Handoffs', 'Routines', 'Pythonic'],
      limitations: ['Experimental (not for prod)', 'No memory built-in'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 80, likes: 8.0, verified: 'tested'},
  },
  {
    name: 'AgentLite',
    website: 'https://github.com/SalesforceAIResearch/AgentLite',
    tagline: 'Lightweight library for building agents.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "Salesforce Research's library designed to simplify the task of building and evaluating LLM agents.",
      features: ['Task solving', 'Agent orchestration', 'Research friendly'],
      limitations: ['Research focused', 'Less community than LangChain'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 40, likes: 7.8, verified: 'tested'},
  },
  {
    name: 'Faiss',
    website: 'https://github.com/facebookresearch/faiss',
    tagline: 'Library for efficient similarity search.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['python', 'c++'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "Meta's foundational library for dense vector clustering and similarity search. It powers many other vector DBs.",
      features: ['GPU support', 'Billion-scale search', 'Highly optimized'],
      limitations: ['Low-level library (not a full DB)', 'Complex API'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'pgvector',
    website: 'https://github.com/pgvector/pgvector',
    tagline: 'Open-source vector similarity search for Postgres.',
    filters: {
      pricing: 'open source',
      category: 'database',
      platforms: ['postgres'],
      open_source: true,
      deployment: 'local/cloud',
    },
    content: {
      intro:
        'An extension for PostgreSQL that adds vector similarity search, allowing you to keep vectors next to your relational data.',
      features: ['Postgres integration', 'IVFFlat indexing', 'HNSW indexing'],
      limitations: ['Scales less than specialized DBs', 'Requires Postgres knowledge'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 88, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Playbeat',
    website: 'https://audiomodern.com/shop/plugins/playbeat',
    tagline: "World's smartest groove machine.",
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['vst', 'ios'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'A Groove Randomizer plugin that generates beats and patterns using algorithmic and random procedures.',
      features: ['Pattern generation', 'Stem export', 'Smart randomization'],
      limitations: ['VST workflow', 'Paid'],
      pricing: [{name: 'License', price: '€69', features: ['Full plugin'], highlight: true}],
    },
    stats: {views: 55, likes: 8.3, verified: 'tested'},
  },
  {
    name: 'Atlas 2',
    website: 'https://algonaut.audio',
    tagline: 'Find the perfect sample in seconds.',
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['vst'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        "Uses AI to organize all your sample folders into a visual 'map' based on sound similarity, making kit building instant.",
      features: ['Sample map', 'Kit generation', 'Drag and drop'],
      limitations: ['Analysis takes time', 'Paid'],
      pricing: [{name: 'License', price: '$99', features: ['Full plugin'], highlight: true}],
    },
    stats: {views: 65, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Reimagine Home AI',
    website: 'https://reimaginehome.ai',
    tagline: 'Generative AI for interior design.',
    filters: {
      pricing: 'freemium',
      category: 'design',
      platforms: ['web'],
      open_source: false,
      industry: 'interior',
    },
    content: {
      intro:
        'Allows users to upload a photo of a room and redesign it in any style, change flooring, or virtual stage it.',
      features: ['Virtual staging', 'Style transfer', 'Exterior redesign'],
      limitations: ['Watermarks on free', 'Resolution limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Pro', price: '$99/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 70, likes: 8.0, verified: 'tested'},
  },
  {
    name: 'Veras',
    website: 'https://evolvelab.io/veras',
    tagline: 'AI rendering for architects.',
    filters: {
      pricing: 'paid',
      category: 'architecture',
      platforms: ['revit', 'sketchup', 'rhino'],
      open_source: false,
      industry: 'architecture',
    },
    content: {
      intro:
        'An AI rendering plugin that works directly inside Revit, SketchUp, and Rhino to visualize designs from geometry.',
      features: ['Geometry guidance', 'Revit integration', 'Prompt rendering'],
      limitations: ['Plugin cost', 'Requires host software'],
      pricing: [{name: 'Pro', price: '$49/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 55, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'AVCLabs Video Enhancer',
    website: 'https://avclabs.com',
    tagline: 'AI video upscaling software.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['windows', 'mac'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro:
        'Competes with Topaz, offering facial refinement and colorization alongside standard upscaling.',
      features: ['Face refinement', 'Colorization', 'Background removal'],
      limitations: ['Subscription or high lifetime cost', 'Resource heavy'],
      pricing: [{name: 'Monthly', price: '$39.95', features: ['1 PC'], highlight: true}],
    },
    stats: {views: 50, likes: 7.8, verified: 'tested'},
  },
  {
    name: 'Aiarty Video Enhancer',
    website: 'https://aiarty.com',
    tagline: 'Generate detail, deblur & upscale.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['windows', 'mac'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro:
        'A newer entrant known for stability and speed, particularly good at generating realistic details in low-res footage.',
      features: ['Detail generation', 'De-noise', 'Stable performance'],
      limitations: ['Fewer models than Topaz', 'Paid'],
      pricing: [{name: 'Yearly', price: '$85', features: ['Full access'], highlight: true}],
    },
    stats: {views: 45, likes: 8.2, verified: 'tested'},
  },
  {
    name: 'eesel AI',
    website: 'https://eesel.ai',
    tagline: 'Connect your company knowledge to ChatGPT.',
    filters: {
      pricing: 'paid',
      category: 'support',
      platforms: ['web'],
      open_source: false,
      industry: 'support',
    },
    content: {
      intro:
        'Auto-generates an AI support agent by scraping your Confluence, Notion, and help docs.',
      features: ['Instant scrape', 'Slack bot', 'Ticket deflection'],
      limitations: ['Paid per user/ticket', 'Best for internal use'],
      pricing: [{name: 'Standard', price: '$49/mo', features: ['Internal bot'], highlight: true}],
    },
    stats: {views: 50, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'Sapio Sciences',
    website: 'https://sapiosciences.com',
    tagline: 'Science-aware lab informatics.',
    filters: {
      pricing: 'enterprise',
      category: 'science',
      platforms: ['web'],
      open_source: false,
      industry: 'lab',
    },
    content: {
      intro:
        'An AI-powered Electronic Lab Notebook (ELN) and LIMS that helps scientists design experiments and manage data.',
      features: ['Chat interface', 'Experiment design', 'Data management'],
      limitations: ['Enterprise only', 'Niche'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 35, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Finnt',
    website: 'https://finnt.ai',
    tagline: 'AI-native finance platform.',
    filters: {
      pricing: 'paid',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'A modern finance platform built with AI at the core for revenue recognition and automated reconciliation.',
      features: ['Auto-reconcile', 'Revenue rec', 'Modern UI'],
      limitations: ['Newer player', 'Integration limits'],
      pricing: [{name: 'Growth', price: 'Custom', features: ['Core'], highlight: true}],
    },
    stats: {views: 30, likes: 8.1, verified: 'tested'},
  },
  {
    name: 'Lative',
    website: 'https://lative.io',
    tagline: 'Real-time sales capacity planning.',
    filters: {
      pricing: 'paid',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'sales ops',
    },
    content: {
      intro:
        'Connects financial strategy with sales execution data to give real-time capacity and quota planning insights.',
      features: ['Capacity planning', 'Quota management', 'Salesforce sync'],
      limitations: ['Sales ops focus', 'Pricing'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full access'], highlight: true}],
    },
    stats: {views: 35, likes: 8.4, verified: 'tested'},
  },
  {
    name: 'DrumNet',
    website: 'https://sessionloops.com/drumnet',
    tagline: 'AI drum machine.',
    filters: {
      pricing: 'freemium',
      category: 'music',
      platforms: ['vst'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'A sample-based drum machine that uses AI to generate infinite variations of your existing samples.',
      features: ['Deep resampling', 'Sequencer', 'Sample generation'],
      limitations: ['VST only', 'Samples only'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Demo']},
        {name: 'Full', price: '$69', features: ['Full license'], highlight: true},
      ],
    },
    stats: {views: 45, likes: 7.9, verified: 'tested'},
  },
  {
    name: 'Maket',
    website: 'https://maket.ai',
    tagline: 'Generative design for residential.',
    filters: {
      pricing: 'freemium',
      category: 'architecture',
      platforms: ['web'],
      open_source: false,
      industry: 'architecture',
    },
    content: {
      intro:
        'Generates residential floor plans and exterior styles instantly based on constraints and lot size.',
      features: ['Floor plan gen', 'Exterior style', 'Zoning check'],
      limitations: ['Residential focus', 'Beta features'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited projects']},
        {name: 'Pro', price: '$29/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 60, likes: 8.3, verified: 'tested'},
  },
  {
    name: 'Unifab',
    website: 'https://unifab.dvdfab.cn',
    tagline: 'All-in-one video converter & enhancer.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['windows'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro: 'Combines video conversion with AI upscaling, HDR up-conversion, and frame smoothing.',
      features: ['SDR to HDR', 'Upscaling', 'Converter'],
      limitations: ['Windows focused', 'UI is dated'],
      pricing: [{name: 'Lifetime', price: '$299', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 50, likes: 7.5, verified: 'tested'},
  },
  {
    name: 'Sourcegraph Cody',
    website: 'https://sourcegraph.com/cody',
    tagline: 'The AI that knows your entire codebase.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['vscode', 'intellij'],
      open_source: false,
      deployment: 'cloud/local',
    },
    content: {
      intro:
        "Leverages Sourcegraph's code graph to provide context-aware answers, searching across your entire repo history.",
      features: ['Code graph context', 'Chat', 'Commands'],
      limitations: ['Requires Sourcegraph setup', 'Context limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Personal']},
        {name: 'Pro', price: '$9/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 75, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'LocalAI',
    website: 'https://localai.io',
    tagline: 'Open source alternative to OpenAI API.',
    filters: {
      pricing: 'open source',
      category: 'infrastructure',
      platforms: ['linux', 'docker'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "A drop-in replacement REST API that's compatible with OpenAI specifications for local inferencing.",
      features: ['OpenAI compatible', 'Run on CPU', 'No GPU needed (optional)'],
      limitations: ['Slower on CPU', 'Setup required'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 70, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'AutoGPT',
    website: 'https://news.agpt.co',
    tagline: 'Accessible AI agents for everyone.',
    filters: {
      pricing: 'open source',
      category: 'agent',
      platforms: ['web', 'python'],
      open_source: true,
      deployment: 'cloud/local',
    },
    content: {
      intro:
        'One of the first autonomous agent projects, now evolved into a platform for building and running agents.',
      features: ['Autonomous loops', 'Internet access', 'Plugin system'],
      limitations: ['Can be expensive (API costs)', 'Looping issues'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 95, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'BabyAGI',
    website: 'https://babyagi.org',
    tagline: 'Task-driven autonomous agent.',
    filters: {
      pricing: 'open source',
      category: 'agent',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A pared-down AI agent script that generates, prioritizes, and executes tasks based on a predefined objective.',
      features: ['Task prioritization', 'Simple python script', 'Vector memory'],
      limitations: ['Simple logic', 'Not a full product'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 90, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Spellbook',
    website: 'https://spellbook.legal',
    tagline: 'AI contract drafting.',
    filters: {
      pricing: 'paid',
      category: 'legal',
      platforms: ['word'],
      open_source: false,
      industry: 'legal',
    },
    content: {
      intro:
        'Integrates with Microsoft Word to draft language, spot risks, and negotiate contracts using GPT-4.',
      features: ['Drafting', 'Risk spotting', 'Negotiation'],
      limitations: ['Lawyers only', 'Waitlist/Sales'],
      pricing: [{name: 'Custom', price: 'Quote', features: ['Full access'], highlight: true}],
    },
    stats: {views: 55, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'BioGPT',
    website: 'https://github.com/microsoft/BioGPT',
    tagline: 'Generative pre-trained transformer for biomedical text.',
    filters: {
      pricing: 'open source',
      category: 'science',
      platforms: ['python'],
      open_source: true,
      industry: 'biotech',
    },
    content: {
      intro:
        "Microsoft's domain-specific language model trained on massive biomedical literature for answering medical questions.",
      features: ['Biomedical QA', 'Relation extraction', 'Text mining'],
      limitations: ['Model weights focus', 'Requires coding'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 60, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'CodiumAI',
    website: 'https://codium.ai',
    tagline: 'Coding agent for test integrity.',
    filters: {
      pricing: 'freemium',
      category: 'coding',
      platforms: ['vscode', 'jetbrains'],
      open_source: false,
      industry: 'software testing',
    },
    content: {
      intro:
        'Analyzes your code and automatically generates comprehensive test suites (unit tests) to catch bugs early.',
      features: ['Auto-test generation', 'Code analysis', 'PR review'],
      limitations: ['Test focus mainly', 'IDE plugin'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Individual']},
        {name: 'Teams', price: '$19/mo', features: ['Collaboration'], highlight: true},
      ],
    },
    stats: {views: 65, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Refact',
    website: 'https://refact.ai',
    tagline: 'Fine-tunable AI coding assistant.',
    filters: {
      pricing: 'open source',
      category: 'coding',
      platforms: ['vscode', 'jetbrains'],
      open_source: true,
      deployment: 'local/cloud',
    },
    content: {
      intro:
        'An open-source coding assistant that allows you to fine-tune the model on your own codebase for maximum accuracy.',
      features: ['Fine-tuning', 'Self-hosting', 'Chat'],
      limitations: ['Fine-tuning needs resources', 'Setup'],
      pricing: [
        {name: 'Open Source', price: '$0', features: ['Self-hosted']},
        {name: 'Cloud', price: '$10/mo', features: ['Managed'], highlight: true},
      ],
    },
    stats: {views: 50, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Taskade AI',
    website: 'https://taskade.com',
    tagline: 'AI agents for your team.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web', 'mobile'],
      open_source: false,
      deployment: 'cloud',
    },
    content: {
      intro:
        'A project management tool that integrates AI agents to automate tasks, generate workflows, and chat with projects.',
      features: ['AI Agents', 'Mind maps', 'Workflow gen'],
      limitations: ['UI can be busy', 'Agent capabilities vary'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Pro', price: '$8/mo', features: ['Advanced AI'], highlight: true},
      ],
    },
    stats: {views: 75, likes: 8.6, verified: 'tested'},
  },

  // fourth round 300-400

  {
    name: 'Automatic1111',
    website: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    tagline: "The power user's Stable Diffusion interface.",
    filters: {
      pricing: 'open source',
      category: 'image generation',
      platforms: ['windows', 'linux', 'mac'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'The most popular community-built web interface for running Stable Diffusion locally. It supports thousands of extensions, LoRAs, and ControlNets.',
      features: ['Extensive plugins', 'ControlNet support', 'Img2Img'],
      limitations: ['Complex UI', 'Requires GPU'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 98, likes: 9.8, verified: 'tested'},
  },
  {
    name: 'ComfyUI',
    website: 'https://github.com/comfyanonymous/ComfyUI',
    tagline: 'Node-based Stable Diffusion.',
    filters: {
      pricing: 'open source',
      category: 'image generation',
      platforms: ['windows', 'linux'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A flowchart-based interface for Stable Diffusion that gives you granular control over the generation pipeline. Faster and more modular than A1111.',
      features: ['Node workflow', 'Low VRAM mode', 'SDXL support'],
      limitations: ['Steep learning curve', 'Visual programming'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 92, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Fooocus',
    website: 'https://github.com/lllyasviel/Fooocus',
    tagline: 'Midjourney quality, locally.',
    filters: {
      pricing: 'open source',
      category: 'image generation',
      platforms: ['windows', 'linux'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'An open-source interface designed to be as simple as Midjourney but running offline. It handles complex prompting settings automatically.',
      features: ['Simple UI', 'Auto-style', 'Inpainting'],
      limitations: ['Less control than A1111', 'SDXL focused'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Flowise',
    website: 'https://flowiseai.com',
    tagline: 'Drag & drop LLM builder.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['web', 'docker'],
      open_source: true,
      deployment: 'local/cloud',
    },
    content: {
      intro:
        'A no-code UI for LangChain. You can drag and drop components to build chatbots, scrapers, and agents without writing Python.',
      features: ['Visual builder', 'LangChain integration', 'API export'],
      limitations: ['Newer project', 'Dependency on LangChain updates'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Self-hosted']}],
    },
    stats: {views: 75, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Langflow',
    website: 'https://langflow.org',
    tagline: 'The visual IDE for LangChain.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'Another powerful UI for LangChain that allows you to prototype flows and export them as Python code.',
      features: ['Python export', 'Interactive chat', 'Component library'],
      limitations: ['Dev focused', 'Complex setup'],
      pricing: [{name: 'Free', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 70, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Streamlit',
    website: 'https://streamlit.io',
    tagline: 'Turn data scripts into shareable web apps.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'cloud/local',
    },
    content: {
      intro:
        'The fastest way to build frontend UIs for your AI/ML Python scripts. Owned by Snowflake.',
      features: ['Pure Python', 'Interactive widgets', 'Instant deploy'],
      limitations: ['Not for complex UIs', 'State management tricky'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Unlimited']}],
    },
    stats: {views: 95, likes: 9.7, verified: 'tested'},
  },
  {
    name: 'Gradio',
    website: 'https://gradio.app',
    tagline: 'Build & share machine learning apps.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'cloud/local',
    },
    content: {
      intro:
        'Owned by Hugging Face, Gradio is the standard for creating quick demos for ML models.',
      features: ['Hugging Face integration', 'Easy inputs/outputs', 'Shareable links'],
      limitations: ['Demo focused', 'UI customization limits'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Unlimited']}],
    },
    stats: {views: 90, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Chainlit',
    website: 'https://chainlit.io',
    tagline: 'Build Python Chat GPTs in minutes.',
    filters: {
      pricing: 'open source',
      category: 'framework',
      platforms: ['python'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A Python framework specifically for building chat interfaces that look like ChatGPT, with built-in "thought" processing displays.',
      features: ['ChatGPT-like UI', 'Step visualization', 'Data persistence'],
      limitations: ['Chat focus only', 'New ecosystem'],
      pricing: [{name: 'Free', price: '$0', features: ['Open Source']}],
    },
    stats: {views: 65, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'GPT4All',
    website: 'https://gpt4all.io',
    tagline: 'Run open-source LLMs anywhere.',
    filters: {
      pricing: 'open source',
      category: 'chatbot',
      platforms: ['windows', 'mac', 'linux'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A chat client that runs localized models on consumer CPUs without needing an internet connection.',
      features: ['CPU inference', 'Local docs chat', 'Installer'],
      limitations: ['Slower on CPU', 'Model size limits'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 88, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Opus Clip',
    website: 'https://opus.pro',
    tagline: '1 long video = 10 viral shorts.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Analyzes long YouTube videos/podcasts and automatically cuts the most viral moments into vertical shorts with captions.',
      features: ['AI curation', 'Auto-caption', 'Virality score'],
      limitations: ['Watermark on free', 'English focus'],
      pricing: [
        {name: 'Free', price: '$0', features: ['60 mins/mo']},
        {name: 'Pro', price: '$19/mo', features: ['300 mins'], highlight: true},
      ],
    },
    stats: {views: 92, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Munch',
    website: 'https://getmunch.com',
    tagline: 'Extract the best clips.',
    filters: {
      pricing: 'paid',
      category: 'video tools',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Competitor to Opus Clip, focused on extracting clips based on trending keywords and marketing insights.',
      features: ['Trend analysis', 'Clip generation', 'Social posting'],
      limitations: ['Expensive', 'Processing time'],
      pricing: [{name: 'Pro', price: '$49/mo', features: ['200 mins'], highlight: true}],
    },
    stats: {views: 75, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Krisp',
    website: 'https://krisp.ai',
    tagline: 'AI noise cancellation.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['mac', 'windows'],
      open_source: false,
      deployment: 'local',
    },
    content: {
      intro:
        'Background app that removes background noise (dogs, traffic, crying babies) from your microphone in real-time.',
      features: ['Noise cancellation', 'Echo removal', 'Meeting transcription'],
      limitations: ['Daily limits on free', 'Desktop only'],
      pricing: [
        {name: 'Free', price: '$0', features: ['60 mins/day']},
        {name: 'Pro', price: '$8/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 90, likes: 9.7, verified: 'tested'},
  },
  {
    name: 'Cleanvoice',
    website: 'https://cleanvoice.ai',
    tagline: 'Stop wasting hours editing podcasts.',
    filters: {
      pricing: 'paid',
      category: 'audio',
      platforms: ['web'],
      open_source: false,
      industry: 'podcasting',
    },
    content: {
      intro:
        'Detects and removes filler words (ums, ahs), mouth sounds, and long silences from audio files.',
      features: ['Filler removal', 'Stutter removal', 'Multitrack'],
      limitations: ['Pay per hour', 'No real-time'],
      pricing: [{name: 'Subscription', price: '€10/mo', features: ['10 hours'], highlight: true}],
    },
    stats: {views: 60, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Podcastle',
    website: 'https://podcastle.ai',
    tagline: 'The one-stop shop for broadcast storytelling.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web', 'ios'],
      open_source: false,
      industry: 'podcasting',
    },
    content: {
      intro:
        "A web-based DAW for recording and editing podcasts with AI-powered 'Magic Dust' for sound enhancement.",
      features: ['Remote recording', 'Magic Dust', 'Text-to-speech'],
      limitations: ['Audio quality capped on free', 'Web-based latency'],
      pricing: [
        {name: 'Basic', price: '$0', features: ['Unlimited recording']},
        {name: 'Storyteller', price: '$11.99/mo', features: ['High quality'], highlight: true},
      ],
    },
    stats: {views: 70, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Skybox AI',
    website: 'https://skybox.blockadelabs.com',
    tagline: '360° worlds from text.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
      open_source: false,
      industry: 'game dev',
    },
    content: {
      intro:
        'Generates stunning 360-degree panoramic skyboxes for games and VR environments from simple prompts.',
      features: ['360 generation', 'Sketch-to-Skybox', 'Download HD'],
      limitations: ['Specific use case', 'Watermarked free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['15 gens/mo']},
        {name: 'Pro', price: '$20/mo', features: ['Commercial'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Sloyd',
    website: 'https://sloyd.ai',
    tagline: 'Generate 3D models fast.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
      open_source: false,
      industry: 'game dev',
    },
    content: {
      intro:
        'Focuses on generating hard-surface 3D models (weapons, props, furniture) with clean geometry.',
      features: ['Parametric generation', 'UV unwrapping', 'Game ready'],
      limitations: ['Not for organic shapes', 'Library based'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic export']},
        {name: 'Pro', price: '$20/mo', features: ['Full library'], highlight: true},
      ],
    },
    stats: {views: 55, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'CSM.ai',
    website: 'https://csm.ai',
    tagline: 'Cube to 3D World.',
    filters: {
      pricing: 'freemium',
      category: '3d',
      platforms: ['web'],
      open_source: false,
      deployment: 'cloud',
    },
    content: {
      intro: "Turns any 2D image into a 3D asset using their 'Cube' foundation model.",
      features: ['Image-to-3D', 'Video-to-3D', 'Asset library'],
      limitations: ['Geometry can be soft', 'Wait times'],
      pricing: [{name: 'Free', price: '$0', features: ['Trial']}],
    },
    stats: {views: 65, likes: 8.2, verified: 'tested'},
  },
  {
    name: 'Darktrace',
    website: 'https://darktrace.com',
    tagline: 'Self-learning cyber security.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['cloud', 'network'],
      open_source: false,
      industry: 'cybersecurity',
    },
    content: {
      intro:
        "Uses unsupervised machine learning to learn the 'normal' pattern of life for a business and detect deviations.",
      features: ['Autonomous response', 'Email security', 'Network viz'],
      limitations: ['Very expensive', 'False positives initially'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 70, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'CrowdStrike Charlotte AI',
    website: 'https://crowdstrike.com',
    tagline: 'Generative AI security analyst.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['cloud'],
      open_source: false,
      industry: 'cybersecurity',
    },
    content: {
      intro:
        'An AI analyst built into the Falcon platform that allows security teams to ask questions about threats in plain English.',
      features: ['Threat hunting', 'Incident summary', 'Action recommendation'],
      limitations: ['Falcon customer only', 'Enterprise'],
      pricing: [{name: 'Add-on', price: 'Custom', features: ['AI Access'], highlight: true}],
    },
    stats: {views: 65, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Microsoft Security Copilot',
    website: 'https://microsoft.com/security',
    tagline: 'AI at the speed of machine.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['cloud'],
      open_source: false,
      industry: 'cybersecurity',
    },
    content: {
      intro:
        "Combines OpenAI's models with Microsoft's massive threat intelligence database to assist defenders.",
      features: ['Incident analysis', 'Script analysis', 'Reporting'],
      limitations: ['Microsoft ecosystem focus', 'Cost'],
      pricing: [{name: 'Usage', price: 'Consumption', features: ['SCUs'], highlight: true}],
    },
    stats: {views: 80, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Tessian',
    website: 'https://tessian.com',
    tagline: 'Intelligent cloud email security.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['cloud'],
      open_source: false,
      industry: 'cybersecurity',
    },
    content: {
      intro:
        'Uses behavioral intelligence to detect email anomalies, stopping data exfiltration and advanced phishing.',
      features: ['Misdirected email prevention', 'Phishing stop', 'Coaching'],
      limitations: ['Email focus only', 'Enterprise'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 50, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'Wiz',
    website: 'https://wiz.io',
    tagline: 'Secure everything you build in the cloud.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['cloud'],
      open_source: false,
      industry: 'cybersecurity',
    },
    content: {
      intro:
        "Scans cloud infrastructure for risks and uses an 'AI Security Graph' to prioritize the most critical attack paths.",
      features: ['Agentless scanning', 'Risk graph', 'Multi-cloud'],
      limitations: ['Cloud only', 'High cost'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Full platform'], highlight: true},
      ],
    },
    stats: {views: 75, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Snyk DeepCode',
    website: 'https://snyk.io',
    tagline: 'Real-time semantic code analysis.',
    filters: {
      pricing: 'freemium',
      category: 'security',
      platforms: ['web', 'ide'],
      open_source: false,
      industry: 'devsecops',
    },
    content: {
      intro:
        'AI engine that analyzes your code for vulnerabilities and offers one-click fix suggestions.',
      features: ['Vulnerability scan', 'Fix suggestions', 'IDE integration'],
      limitations: ['False positives', 'Free tier limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Individual']},
        {name: 'Team', price: '$25/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Socket',
    website: 'https://socket.dev',
    tagline: 'Secure your supply chain.',
    filters: {
      pricing: 'freemium',
      category: 'security',
      platforms: ['web', 'cli'],
      open_source: false,
      industry: 'devsecops',
    },
    content: {
      intro:
        'Analyzes npm/PyPI packages for malicious behavior (like install scripts) using AI, rather than just known vulnerabilities.',
      features: ['Supply chain protection', 'Behavior analysis', 'Free for open source'],
      limitations: ['Language support expanding', 'CLI focus'],
      pricing: [{name: 'Free', price: '$0', features: ['Open source']}],
    },
    stats: {views: 60, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Paperpal',
    website: 'https://paperpal.com',
    tagline: 'AI writing assistant for researchers.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web', 'word'],
      open_source: false,
      industry: 'academia',
    },
    content: {
      intro:
        'Trained on millions of academic manuscripts to check grammar, style, and vocabulary specifically for publication.',
      features: ['Academic translation', 'Language check', 'Word add-in'],
      limitations: ['Academic style only', 'Daily limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited']},
        {name: 'Prime', price: '$19/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 55, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Scholarcy',
    website: 'https://scholarcy.com',
    tagline: 'The AI-powered article summarizer.',
    filters: {
      pricing: 'freemium',
      category: 'research',
      platforms: ['web', 'chrome'],
      open_source: false,
      industry: 'academia',
    },
    content: {
      intro:
        'Converts long academic papers into interactive flashcards, highlighting key facts, methods, and findings.',
      features: ['Flashcard summary', 'Reference extraction', 'Table extraction'],
      limitations: ['UI is functional', 'Library limits'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Daily limit']},
        {name: 'Personal', price: '$9/mo', features: ['Library'], highlight: true},
      ],
    },
    stats: {views: 65, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Trinka AI',
    website: 'https://trinka.ai',
    tagline: 'Grammar checker for academic writing.',
    filters: {
      pricing: 'freemium',
      category: 'writing',
      platforms: ['web'],
      open_source: false,
      industry: 'academia',
    },
    content: {
      intro:
        'Corrects complex grammar errors and suggests enhancements tailored to technical and medical writing.',
      features: ['Publication readiness', 'Style guide check', 'Plagiarism check'],
      limitations: ['Niche focus', 'Credit system'],
      pricing: [
        {name: 'Basic', price: '$0', features: ['Limited']},
        {name: 'Premium', price: '$20/mo', features: ['Full access'], highlight: true},
      ],
    },
    stats: {views: 40, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Gradescope',
    website: 'https://gradescope.com',
    tagline: 'Grade faster with AI.',
    filters: {
      pricing: 'freemium',
      category: 'education',
      platforms: ['web'],
      open_source: false,
      industry: 'education',
    },
    content: {
      intro:
        'Uses AI to group similar student answers together, allowing teachers to grade a whole batch at once.',
      features: ['Answer grouping', 'Code grading', 'Rubric sharing'],
      limitations: ['Institutional adoption usually', 'Setup time'],
      pricing: [{name: 'Basic', price: '$0', features: ['First course']}],
    },
    stats: {views: 80, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Socratic',
    website: 'https://socratic.org',
    tagline: 'Get unstuck. Learn better.',
    filters: {
      pricing: 'free',
      category: 'education',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'education',
    },
    content: {
      intro:
        "Google's app that lets students take a photo of a homework problem to get explanations and video steps.",
      features: ['Photo input', 'Step-by-step', 'Subject variety'],
      limitations: ['Mobile only', 'Basic problems'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 95, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Photomath',
    website: 'https://photomath.com',
    tagline: 'The math app for everyone.',
    filters: {
      pricing: 'freemium',
      category: 'education',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'education',
    },
    content: {
      intro:
        'The most famous camera calculator. It scans math problems (handwritten or printed) and solves them with steps.',
      features: ['Handwriting recognition', 'Calculator', 'Graphs'],
      limitations: ['Deep explanations paid', 'Google acquired'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Solve']},
        {name: 'Plus', price: '$9.99/mo', features: ['Deep steps'], highlight: true},
      ],
    },
    stats: {views: 98, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'ZeroGPT',
    website: 'https://zerogpt.com',
    tagline: 'The advanced AI detector.',
    filters: {
      pricing: 'free',
      category: 'detection',
      platforms: ['web'],
      open_source: false,
      industry: 'general',
    },
    content: {
      intro:
        'A simple web tool to detect if text was generated by ChatGPT or other LLMs. Popular for quick checks.',
      features: ['Instant check', 'Highlighting', 'Free'],
      limitations: ['High false positive rate', 'Ads'],
      pricing: [{name: 'Free', price: '$0', features: ['Unlimited']}],
    },
    stats: {views: 90, likes: 6.5, verified: 'tested'},
  },
  {
    name: 'Brandwatch',
    website: 'https://brandwatch.com',
    tagline: 'Understand your consumer.',
    filters: {
      pricing: 'enterprise',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'AI-powered social listening that analyzes billions of conversations to track brand sentiment and trends.',
      features: ['Iris AI analyst', 'Image recognition', 'Sentiment'],
      limitations: ['Very expensive', 'Complex'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 60, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Albert',
    website: 'https://albert.ai',
    tagline: 'Your self-driving digital marketer.',
    filters: {
      pricing: 'enterprise',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Autonomous AI that connects to paid search and social accounts to optimize bids, budgets, and audiences 24/7.',
      features: ['Cross-channel', 'Auto-budget', 'Creative testing'],
      limitations: ['Black box optimization', 'High spend req'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full access'], highlight: true}],
    },
    stats: {views: 50, likes: 8.4, verified: 'tested'},
  },
  {
    name: 'Persado',
    website: 'https://persado.com',
    tagline: 'Motivation AI.',
    filters: {
      pricing: 'enterprise',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Uses a knowledge base of emotional language to generate marketing copy that statistically outperforms human writing.',
      features: ['Emotion mapping', 'Language generation', 'Enterprise scale'],
      limitations: ['Enterprise only', 'Niche'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 45, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'Lavender',
    website: 'https://lavender.ai',
    tagline: 'The #1 AI sales email coach.',
    filters: {
      pricing: 'freemium',
      category: 'sales',
      platforms: ['chrome', 'outlook'],
      open_source: false,
      industry: 'sales',
    },
    content: {
      intro:
        'A browser extension that scores your sales emails in real-time and suggests edits to increase reply rates.',
      features: ['Email scoring', 'Mobile preview', 'AI writing'],
      limitations: ['Email focus', 'Subscription per user'],
      pricing: [
        {name: 'Free', price: '$0', features: ['5 emails/mo']},
        {name: 'Pro', price: '$29/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 75, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Gong',
    website: 'https://gong.io',
    tagline: 'Revenue intelligence platform.',
    filters: {
      pricing: 'enterprise',
      category: 'sales',
      platforms: ['web'],
      open_source: false,
      industry: 'sales',
    },
    content: {
      intro:
        'Records, transcribes, and analyzes sales calls to give insights on deal health and rep performance.',
      features: ['Call analysis', 'Deal warning', 'Coaching metrics'],
      limitations: ['Expensive', 'Minimum seat count'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Full platform'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.7, verified: 'tested'},
  },
  {
    name: 'Avoma',
    website: 'https://avoma.com',
    tagline: 'The AI meeting assistant.',
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['web'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'An all-in-one meeting lifecycle tool: agenda preparation, recording, transcription, and note-taking.',
      features: ['Agenda templates', 'Auto-notes', 'CRM sync'],
      limitations: ['Feature bloat', 'Bot joins calls'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic scheduler']},
        {name: 'Plus', price: '$24/mo', features: ['Unlimited AI'], highlight: true},
      ],
    },
    stats: {views: 60, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'tl;dv',
    website: 'https://tldv.io',
    tagline: "The meeting recorder that doesn't suck.",
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['chrome', 'zoom'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'Popular for its free tier, it records Google Meet/Zoom and allows you to timestamp and clip moments instantly.',
      features: ['Free recording', 'Timestamping', 'Multi-language'],
      limitations: ['Bot joins call', 'Processing time'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Unlimited recordings']},
        {name: 'Pro', price: '$20/mo', features: ['Automations'], highlight: true},
      ],
    },
    stats: {views: 88, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Fathom',
    website: 'https://fathom.video',
    tagline: 'Free AI meeting assistant.',
    filters: {
      pricing: 'free',
      category: 'meeting',
      platforms: ['zoom', 'meet', 'teams'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'Completely free for individuals, it records and summarizes calls with excellent accuracy and CRM sync.',
      features: ['Free summary', 'CRM sync', 'No storage limit'],
      limitations: ['Team edition is paid', 'Bot required'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Individual']},
        {name: 'Team', price: '$19/mo', features: ['Centralized'], highlight: true},
      ],
    },
    stats: {views: 90, likes: 9.8, verified: 'tested'},
  },
  {
    name: 'Supernormal',
    website: 'https://supernormal.com',
    tagline: 'AI notes for every meeting.',
    filters: {
      pricing: 'freemium',
      category: 'meeting',
      platforms: ['chrome'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'Focuses purely on generating clean, formatted meeting notes rather than just a transcript.',
      features: ['Formatted notes', 'Action items', 'Private'],
      limitations: ['Credit system on free', 'Extension based'],
      pricing: [
        {name: 'Free', price: '$0', features: ['10 meetings/mo']},
        {name: 'Pro', price: '$10/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 65, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Reflect',
    website: 'https://reflect.app',
    tagline: 'Think better with AI.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web', 'ios'],
      open_source: false,
      industry: 'personal',
    },
    content: {
      intro:
        'A networked note-taking app (like Obsidian/Roam) with a built-in AI assistant to rewrite, summarize, and link thoughts.',
      features: ['Backlinks', 'End-to-end encryption', 'AI palette'],
      limitations: ['Paid only', 'Mac focused'],
      pricing: [{name: 'Pro', price: '$10/mo', features: ['Full access'], highlight: true}],
    },
    stats: {views: 50, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'AudioPen',
    website: 'https://audiopen.ai',
    tagline: 'Go from fuzzy thought to clear text.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web'],
      open_source: false,
      industry: 'personal',
    },
    content: {
      intro:
        'Records your rambling voice notes and converts them into summarized, clearly written text styles.',
      features: ['Summarization', 'Style selection', 'Shareable images'],
      limitations: ['Web app (PWA)', 'Recording length limit'],
      pricing: [
        {name: 'Free', price: '$0', features: ['3 mins/note']},
        {name: 'Prime', price: '$99/yr', features: ['15 mins', 'Custom styles'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Teal',
    website: 'https://tealhq.com',
    tagline: 'Your career growth platform.',
    filters: {
      pricing: 'freemium',
      category: 'career',
      platforms: ['web', 'chrome'],
      open_source: false,
      industry: 'hr',
    },
    content: {
      intro:
        'A job search tracker that uses AI to generate resumes and cover letters tailored to specific job descriptions.',
      features: ['Resume builder', 'Job tracker', 'Keyword matching'],
      limitations: ['Freemium limits scans', 'US focus'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Plus', price: '$9/mo', features: ['Unlimited AI'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'HiredScore',
    website: 'https://hiredscore.com',
    tagline: 'Orchestration for HR.',
    filters: {
      pricing: 'enterprise',
      category: 'hr',
      platforms: ['web'],
      open_source: false,
      industry: 'hr',
    },
    content: {
      intro:
        'Ensures fair hiring by using ethical AI to screen candidates and rank them against job requisitions.',
      features: ['Bias mitigation', 'Screening', 'Internal mobility'],
      limitations: ['Enterprise only', 'Compliance focus'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 45, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Eightfold AI',
    website: 'https://eightfold.ai',
    tagline: 'Talent intelligence platform.',
    filters: {
      pricing: 'enterprise',
      category: 'hr',
      platforms: ['web'],
      open_source: false,
      industry: 'hr',
    },
    content: {
      intro:
        'Uses deep learning to match candidates to jobs based on skills and potential, not just keywords.',
      features: ['Skills inference', 'Talent rediscovery', 'DEI analytics'],
      limitations: ['High cost', 'Complex implementation'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 55, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Domo',
    website: 'https://domo.com',
    tagline: 'Data experience platform.',
    filters: {
      pricing: 'enterprise',
      category: 'data',
      platforms: ['web'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        "A BI platform with 'AI Service Layer' that allows users to chat with data and generate predictive models.",
      features: ['Real-time data', 'Text-to-SQL', 'Predictive AI'],
      limitations: ['Expensive', 'Steep learning curve'],
      pricing: [
        {name: 'Enterprise', price: 'Custom', features: ['Full platform'], highlight: true},
      ],
    },
    stats: {views: 65, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Akkio',
    website: 'https://akkio.com',
    tagline: 'Generative analytics and ML.',
    filters: {
      pricing: 'paid',
      category: 'data',
      platforms: ['web'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'A no-code platform for agencies to build predictive models and chat with data charts.',
      features: ['Chat with data', 'Forecasting', 'Report generation'],
      limitations: ['Paid only', 'Dataset size limits'],
      pricing: [{name: 'Starter', price: '$49/mo', features: ['Basic'], highlight: true}],
    },
    stats: {views: 50, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Polymer',
    website: 'https://polymersearch.com',
    tagline: 'Business intelligence without the learning curve.',
    filters: {
      pricing: 'paid',
      category: 'data',
      platforms: ['web'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'Turns spreadsheets into interactive databases with AI-generated insights and dashboards.',
      features: ['Auto-visualization', 'AI insights', 'Embeddable'],
      limitations: ['Paid only', 'Spreadsheet focus'],
      pricing: [{name: 'Starter', price: '$10/mo', features: ['Unlimited'], highlight: true}],
    },
    stats: {views: 45, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Browse AI',
    website: 'https://browse.ai',
    tagline: 'The easiest way to extract data.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['web', 'chrome'],
      open_source: false,
      industry: 'dev',
    },
    content: {
      intro:
        'Train a robot to scrape any website in 2 minutes. Adapts to layout changes automatically.',
      features: ['Point-and-click', 'Monitoring', 'API integration'],
      limitations: ['Credit limits', 'Complex CAPTCHAs'],
      pricing: [
        {name: 'Free', price: '$0', features: ['50 credits']},
        {name: 'Starter', price: '$19/mo', features: ['10k credits'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Bardeen',
    website: 'https://bardeen.ai',
    tagline: 'Automation for the web.',
    filters: {
      pricing: 'freemium',
      category: 'automation',
      platforms: ['chrome'],
      open_source: false,
      industry: 'productivity',
    },
    content: {
      intro:
        "An AI agent that runs in your browser to automate tasks like 'scrape LinkedIn profiles to Notion'.",
      features: ['Browser automation', 'Magic Box (AI)', 'Integrations'],
      limitations: ['Chrome only', 'Run locally'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Standard']},
        {name: 'Pro', price: '$10/mo', features: ['AI credits'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'TextBlaze',
    website: 'https://blaze.today',
    tagline: 'Eliminate repetitive typing.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['chrome', 'windows'],
      open_source: false,
      industry: 'productivity',
    },
    content: {
      intro:
        'Snippet expander that now includes AI to dynamically generate text within your shortcuts.',
      features: ['Snippets', 'Forms', 'GPT integration'],
      limitations: ['Browser focus', 'Snippet limit free'],
      pricing: [
        {name: 'Free', price: '$0', features: ['20 snippets']},
        {name: 'Pro', price: '$2.99/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 90, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Glasp',
    website: 'https://glasp.co',
    tagline: 'Highlight & organize your quotes.',
    filters: {
      pricing: 'free',
      category: 'productivity',
      platforms: ['chrome'],
      open_source: false,
      industry: 'productivity',
    },
    content: {
      intro:
        'A social web highlighter that lets you highlight text/video transcripts and uses AI to summarize them.',
      features: ['YouTube summary', 'Kindle export', 'Social profile'],
      limitations: ['Public by default', 'Extension dependent'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 70, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Snipd',
    website: 'https://snipd.com',
    tagline: 'Unlock the knowledge in podcasts.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'personal',
    },
    content: {
      intro:
        "Podcast player that uses AI to transcribe episodes and create 'snips' (highlights) with a single tap.",
      features: ['AI Highlights', 'Transcript', 'Notion sync'],
      limitations: ['Mobile only', 'English best'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic']},
        {name: 'Premium', price: '$10/mo', features: ['Unlimited AI'], highlight: true},
      ],
    },
    stats: {views: 65, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Fabric',
    website: 'https://fabric.so',
    tagline: 'Your digital home.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web', 'ios'],
      open_source: false,
      industry: 'personal',
    },
    content: {
      intro:
        'An AI-powered file manager and bookmark tool that automatically tags and organizes everything you save.',
      features: ['Semantic search', 'Shared spaces', 'Visual org'],
      limitations: ['Waitlist/Beta', 'Paid only'],
      pricing: [{name: 'Pro', price: '$10/mo', features: ['Full access'], highlight: true}],
    },
    stats: {views: 55, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Endel',
    website: 'https://endel.io',
    tagline: 'Personalized soundscapes.',
    filters: {
      pricing: 'paid',
      category: 'wellness',
      platforms: ['ios', 'android', 'web'],
      open_source: false,
      industry: 'health',
    },
    content: {
      intro:
        'Generates real-time soundscapes based on your heart rate, weather, and time of day to help you focus or sleep.',
      features: ['Circadian rhythm', 'Focus mode', 'Sleep mode'],
      limitations: ['Subscription', 'Abstract audio'],
      pricing: [{name: 'Monthly', price: '$9.99', features: ['Full access'], highlight: true}],
    },
    stats: {views: 80, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Woebot',
    website: 'https://woebothealth.com',
    tagline: 'Your mental health ally.',
    filters: {
      pricing: 'free',
      category: 'wellness',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'health',
    },
    content: {
      intro:
        'A clinically validated chatbot that uses CBT (Cognitive Behavioral Therapy) principles to help users manage stress.',
      features: ['CBT check-ins', 'Mood tracking', 'Evidence-based'],
      limitations: ['Not human therapy', 'Scripted paths'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 75, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'MacroFactor',
    website: 'https://macrofactorapp.com',
    tagline: 'The science-backed diet coach.',
    filters: {
      pricing: 'paid',
      category: 'wellness',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'health',
    },
    content: {
      intro:
        'Uses an adherence-neutral algorithm to calculate your expenditure and adjust calorie targets weekly.',
      features: ['Smart algorithm', 'Food logger', 'No shame'],
      limitations: ['Paid only', 'Requires logging'],
      pricing: [{name: 'Monthly', price: '$11.99', features: ['Full access'], highlight: true}],
    },
    stats: {views: 60, likes: 9.8, verified: 'tested'},
  },
  {
    name: 'Checkr',
    website: 'https://checkr.com',
    tagline: 'Modern background checks.',
    filters: {
      pricing: 'paid',
      category: 'hr',
      platforms: ['web'],
      open_source: false,
      industry: 'hr',
    },
    content: {
      intro:
        'Uses AI to speed up background checks and reduce bias by ignoring irrelevant records.',
      features: ['Fast turnaround', 'Fair chance filtering', 'API'],
      limitations: ['US focus', 'Compliance heavy'],
      pricing: [
        {name: 'Pay-per-check', price: '$30+', features: ['Standard check'], highlight: true},
      ],
    },
    stats: {views: 55, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Socure',
    website: 'https://socure.com',
    tagline: 'Day zero identity verification.',
    filters: {
      pricing: 'enterprise',
      category: 'security',
      platforms: ['api'],
      open_source: false,
      industry: 'finance',
    },
    content: {
      intro:
        'The industry leader in digital identity verification, using AI to approve more good customers and stop fraud.',
      features: ['KYC', 'Fraud prediction', 'Document verification'],
      limitations: ['Enterprise/B2B', 'API only'],
      pricing: [{name: 'Enterprise', price: 'Volume', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 50, likes: 9.2, verified: 'tested'},
  },
  // round five 400-500

  {
    name: 'Weights & Biases',
    website: 'https://wandb.ai',
    tagline: 'The developer platform for AI.',
    filters: {
      pricing: 'freemium',
      category: 'mlops',
      platforms: ['web', 'python'],
      open_source: false,
      industry: 'tech',
    },
    content: {
      intro:
        'The industry standard for tracking machine learning experiments. It visualizes training runs, hyperparameters, and model versions.',
      features: ['Experiment tracking', 'Model registry', 'Hyperparameter sweep'],
      limitations: ['Enterprise cost', 'Hosted data (unless self-hosted)'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Personal']},
        {name: 'Team', price: '$50/mo', features: ['Collaboration'], highlight: true},
      ],
    },
    stats: {views: 95, likes: 9.9, verified: 'tested'},
  },
  {
    name: 'Roboflow',
    website: 'https://roboflow.com',
    tagline: 'Give your software the sense of sight.',
    filters: {
      pricing: 'freemium',
      category: 'computer vision',
      platforms: ['web', 'api'],
      open_source: false,
      industry: 'tech',
    },
    content: {
      intro:
        'End-to-end platform for computer vision. Manage datasets, annotate images, and train models like YOLOv8 in the cloud.',
      features: ['Auto-annotation', 'Dataset management', 'One-click deploy'],
      limitations: ['Public datasets on free tier', 'Vision only'],
      pricing: [
        {name: 'Public', price: '$0', features: ['Public projects']},
        {name: 'Starter', price: '$249/mo', features: ['Private'], highlight: true},
      ],
    },
    stats: {views: 88, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Label Studio',
    website: 'https://labelstud.io',
    tagline: 'Open source data labeling.',
    filters: {
      pricing: 'open source',
      category: 'data',
      platforms: ['web', 'docker'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'The most popular open-source tool for labeling data (audio, text, images, video) to train AI models.',
      features: ['Multi-modal', 'Configurable UI', 'Machine-assisted labeling'],
      limitations: ['Requires setup', 'Enterprise features locked'],
      pricing: [{name: 'Community', price: '$0', features: ['Open source']}],
    },
    stats: {views: 80, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Ray',
    website: 'https://ray.io',
    tagline: 'Scale AI and Python applications.',
    filters: {
      pricing: 'open source',
      category: 'infrastructure',
      platforms: ['python'],
      open_source: true,
      deployment: 'cluster',
    },
    content: {
      intro:
        'An open-source unified compute framework that makes it easy to scale AI workloads (training, serving) across clusters.',
      features: ['Distributed training', 'Ray Serve', 'Hyperparameter tuning'],
      limitations: ['Complex DevOps', 'Overkill for small apps'],
      pricing: [{name: 'Open Source', price: '$0', features: ['MIT License']}],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'BentoML',
    website: 'https://bentoml.com',
    tagline: 'Ship AI models faster.',
    filters: {
      pricing: 'open source',
      category: 'mlops',
      platforms: ['python'],
      open_source: true,
      deployment: 'local/cloud',
    },
    content: {
      intro:
        'Standardizes the process of packaging models into production-ready APIs (Docker containers) with a few lines of code.',
      features: ['Model serving', 'Pythonic', 'High performance'],
      limitations: ['Learning curve', 'BentoCloud is paid'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Apache 2.0']}],
    },
    stats: {views: 75, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Excel Formula Bot',
    website: 'https://excelformulabot.com',
    tagline: 'Text to Excel formulas in seconds.',
    filters: {
      pricing: 'freemium',
      category: 'productivity',
      platforms: ['web', 'excel'],
      open_source: false,
      industry: 'office',
    },
    content: {
      intro:
        'Translates English instructions into complex Excel or Google Sheets formulas (and vice versa).',
      features: ['Formula generation', 'Formula explanation', 'VBA support'],
      limitations: ['Limited free generations', 'Niche'],
      pricing: [
        {name: 'Free', price: '$0', features: ['5 formulas/mo']},
        {name: 'Pro', price: '$6.99/mo', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'AI2SQL',
    website: 'https://ai2sql.io',
    tagline: 'Write SQL in seconds.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['web'],
      open_source: false,
      industry: 'data',
    },
    content: {
      intro:
        'Converts natural language questions into efficient SQL queries for various databases (MySQL, Postgres, Snowflake).',
      features: ['Text-to-SQL', 'Query explanation', 'Schema support'],
      limitations: ['Paid only', 'Complex joins vary'],
      pricing: [{name: 'Start', price: '$9/mo', features: ['100 queries'], highlight: true}],
    },
    stats: {views: 60, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Remini',
    website: 'https://remini.ai',
    tagline: 'Turn old photos into HD.',
    filters: {
      pricing: 'freemium',
      category: 'photo',
      platforms: ['ios', 'android', 'web'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'Famous mobile app that uses AI to unblur, sharpen, and restore old or low-quality photos instantly.',
      features: ['Face enhancement', 'Old photo restore', 'Baby generator'],
      limitations: ['Ads on free', 'Privacy concerns'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Ad-supported']},
        {name: 'Pro', price: '$4.99/wk', features: ['Unlimited'], highlight: true},
      ],
    },
    stats: {views: 98, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'FaceApp',
    website: 'https://faceapp.com',
    tagline: 'Face editing magic.',
    filters: {
      pricing: 'freemium',
      category: 'photo',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'The viral app for neural face transformation—aging, gender swapping, and smile addition.',
      features: ['Age filter', 'Gender swap', 'Makeup'],
      limitations: ['Watermarks', 'Aggressive upsell'],
      pricing: [{name: 'Free', price: '$0', features: ['Basic filters']}],
    },
    stats: {views: 99, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Wombo Dream',
    website: 'https://dream.ai',
    tagline: 'High quality art in seconds.',
    filters: {
      pricing: 'freemium',
      category: 'image generation',
      platforms: ['ios', 'android', 'web'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'A highly stylized, easy-to-use art generator app known for its vibrant and abstract styles.',
      features: ['Art styles', 'Social feed', ' NFT export'],
      limitations: ['Less prompt control', 'Mobile focus'],
      pricing: [{name: 'Free', price: '$0', features: ['Standard']}],
    },
    stats: {views: 90, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'ELSA Speak',
    website: 'https://elsaspeak.com',
    tagline: 'Your personal AI English coach.',
    filters: {
      pricing: 'freemium',
      category: 'education',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'language',
    },
    content: {
      intro:
        'Uses speech recognition to listen to your pronunciation and gives syllable-level feedback to reduce accents.',
      features: ['Pronunciation score', 'Daily lessons', 'Real-time feedback'],
      limitations: ['English only', 'Pro required for detailed analysis'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Limited lessons']},
        {name: 'Pro', price: '$11.99/mo', features: ['Full coach'], highlight: true},
      ],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Hopper',
    website: 'https://hopper.com',
    tagline: 'Book flights at the right time.',
    filters: {
      pricing: 'free',
      category: 'travel',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'travel',
    },
    content: {
      intro:
        'Uses predictive AI to analyze billions of flight prices and tell you exactly when to buy or wait.',
      features: ['Price prediction', 'Freeze price', 'Hotel deals'],
      limitations: ['Mobile only app', 'Booking fees'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 92, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Viz.ai',
    website: 'https://viz.ai',
    tagline: 'AI-powered care coordination.',
    filters: {
      pricing: 'enterprise',
      category: 'medical',
      platforms: ['cloud'],
      open_source: false,
      industry: 'healthcare',
    },
    content: {
      intro:
        'Detects suspected strokes in brain scans (CT LVO) in minutes and alerts the neurovascular team immediately.',
      features: ['Stroke detection', 'Mobile alerts', 'Care coordination'],
      limitations: ['Hospitals only', 'FDA regulated'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 60, likes: 9.8, verified: 'tested'},
  },
  {
    name: 'FarmWise',
    website: 'https://farmwise.io',
    tagline: 'AI weeding robots.',
    filters: {
      pricing: 'enterprise',
      category: 'robotics',
      platforms: ['hardware'],
      open_source: false,
      industry: 'agriculture',
    },
    content: {
      intro:
        'Robots that use computer vision to identify weeds vs crops and mechanically remove weeds without chemicals.',
      features: ['Weed recognition', 'Mechanical weeding', 'Data analytics'],
      limitations: ['Hardware cost', 'Large scale farming'],
      pricing: [{name: 'Service', price: 'Custom', features: ['Weeding service'], highlight: true}],
    },
    stats: {views: 45, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Stable Audio',
    website: 'https://stableaudio.com',
    tagline: 'Generative audio by Stability AI.',
    filters: {
      pricing: 'freemium',
      category: 'audio',
      platforms: ['web'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'Generates high-quality music and sound effects (44.1kHz) from text prompts, with control over timing.',
      features: ['High fidelity', 'Timing control', 'Commercial use'],
      limitations: ['Credit system', 'Generation length'],
      pricing: [
        {name: 'Free', price: '$0', features: ['20 tracks/mo']},
        {name: 'Pro', price: '$11.99/mo', features: ['500 tracks'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'NVIDIA Jetson',
    website: 'https://developer.nvidia.com/embedded-computing',
    tagline: 'AI at the edge.',
    filters: {
      pricing: 'hardware',
      category: 'hardware',
      platforms: ['linux'],
      open_source: false,
      industry: 'robotics',
    },
    content: {
      intro:
        'A series of embedded computing boards designed to run AI models locally on robots, drones, and cameras.',
      features: ['CUDA cores', 'Low power', 'Edge AI'],
      limitations: ['Hardware cost', 'Technical setup'],
      pricing: [{name: 'Nano', price: '$149', features: ['Entry level'], highlight: true}],
    },
    stats: {views: 85, likes: 9.7, verified: 'tested'},
  },
  {
    name: 'Google Coral',
    website: 'https://coral.ai',
    tagline: 'Build local AI.',
    filters: {
      pricing: 'hardware',
      category: 'hardware',
      platforms: ['linux'],
      open_source: false,
      industry: 'iot',
    },
    content: {
      intro:
        'Hardware (USB accelerators, Dev boards) featuring the Edge TPU, designed for ultra-fast local inference of TensorFlow Lite models.',
      features: ['Edge TPU', 'TensorFlow Lite', 'USB plug-in'],
      limitations: ['Model compatibility', 'Heat management'],
      pricing: [{name: 'USB Stick', price: '$59', features: ['Accelerator'], highlight: true}],
    },
    stats: {views: 75, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Rabbit R1',
    website: 'https://rabbit.tech',
    tagline: 'The pocket companion.',
    filters: {
      pricing: 'hardware',
      category: 'hardware',
      platforms: ['proprietary'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        "A dedicated AI hardware device that uses a 'Large Action Model' to navigate apps and perform tasks for you.",
      features: ['Action model', 'Voice control', 'Camera vision'],
      limitations: ['App support limited', 'Review reception mixed'],
      pricing: [{name: 'Device', price: '$199', features: ['No sub'], highlight: true}],
    },
    stats: {views: 95, likes: 7.0, verified: 'tested'},
  },
  {
    name: 'Salesforce Einstein',
    website: 'https://salesforce.com',
    tagline: 'AI for CRM.',
    filters: {
      pricing: 'enterprise',
      category: 'crm',
      platforms: ['cloud'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'The first comprehensive AI for CRM, offering predictive lead scoring, opportunity insights, and automated emails.',
      features: ['Lead scoring', 'Opportunity insights', 'Copilot'],
      limitations: ['High cost', 'Complex ecosystem'],
      pricing: [{name: 'Add-on', price: '$50/user', features: ['Einstein'], highlight: true}],
    },
    stats: {views: 90, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'HubSpot AI',
    website: 'https://hubspot.com',
    tagline: 'AI built into your customer platform.',
    filters: {
      pricing: 'freemium',
      category: 'crm',
      platforms: ['cloud'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Generative AI tools embedded in HubSpot for writing emails, creating blog posts, and analyzing customer data.',
      features: ['Content assistant', 'ChatSpot', 'Campaign gen'],
      limitations: ['Platform dependent', 'Generic output'],
      pricing: [{name: 'Free', price: '$0', features: ['Basic tools'], highlight: true}],
    },
    stats: {views: 88, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'ClickUp Brain',
    website: 'https://clickup.com',
    tagline: 'The AI neural network for work.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        "Connects your tasks, docs, and people. Ask it 'what did I work on yesterday?' or 'summarize this thread'.",
      features: ['Knowledge search', 'Auto-updates', 'Writing'],
      limitations: ['Paid add-on', 'Platform specific'],
      pricing: [{name: 'Add-on', price: '$5/mo', features: ['All AI'], highlight: true}],
    },
    stats: {views: 80, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'GitLab Duo',
    website: 'https://gitlab.com',
    tagline: 'AI-powered DevSecOps.',
    filters: {
      pricing: 'paid',
      category: 'coding',
      platforms: ['web', 'ide'],
      open_source: false,
      industry: 'dev',
    },
    content: {
      intro:
        'A suite of AI features for the entire software lifecycle, from code suggestion to vulnerability explanation.',
      features: ['Code suggestions', 'Root cause analysis', 'Chat'],
      limitations: ['GitLab ecosystem', 'Enterprise focus'],
      pricing: [{name: 'Pro', price: '$19/mo', features: ['Full access'], highlight: true}],
    },
    stats: {views: 70, likes: 8.7, verified: 'tested'},
  },
  {
    name: 'Superhuman',
    website: 'https://superhuman.com',
    tagline: 'The fastest email experience.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['web', 'ios'],
      open_source: false,
      industry: 'productivity',
    },
    content: {
      intro:
        "Premium email client with 'Superhuman AI' that drafts replies, summarizes threads, and auto-corrects tone.",
      features: ['Instant draft', 'Auto-summarize', 'Split inbox'],
      limitations: ['Expensive', 'Waitlist sometimes'],
      pricing: [
        {name: 'Subscription', price: '$30/mo', features: ['Full access'], highlight: true},
      ],
    },
    stats: {views: 75, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Spotify AI DJ',
    website: 'https://spotify.com',
    tagline: 'A DJ in your pocket.',
    filters: {
      pricing: 'paid',
      category: 'music',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'A personalized AI guide that selects music for you and adds commentary between tracks using a realistic voice.',
      features: ['Voice commentary', 'Personalized mix', 'Vibe switching'],
      limitations: ['Premium only', 'Voice can be repetitive'],
      pricing: [{name: 'Premium', price: '$11/mo', features: ['Included'], highlight: true}],
    },
    stats: {views: 99, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Fitbod',
    website: 'https://fitbod.me',
    tagline: 'Your personalized workout builder.',
    filters: {
      pricing: 'paid',
      category: 'wellness',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'fitness',
    },
    content: {
      intro:
        'Uses AI to build workouts based on your available equipment, recovery state, and past performance.',
      features: ['Muscle recovery', 'Equipment filtering', 'Auto-progression'],
      limitations: ['Paid only', 'UI density'],
      pricing: [{name: 'Monthly', price: '$12.99', features: ['Full access'], highlight: true}],
    },
    stats: {views: 85, likes: 9.5, verified: 'tested'},
  },
  {
    name: 'Sleep Cycle',
    website: 'https://sleepcycle.com',
    tagline: 'Wake up easy.',
    filters: {
      pricing: 'freemium',
      category: 'wellness',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'health',
    },
    content: {
      intro:
        'Uses sound analysis to track your sleep phases and wakes you up during your lightest sleep phase.',
      features: ['Smart alarm', 'Snore detection', 'Sleep notes'],
      limitations: ['Battery drain', 'Premium for trends'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Basic alarm']},
        {name: 'Premium', price: '$39.99/yr', features: ['Trends'], highlight: true},
      ],
    },
    stats: {views: 92, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Microsoft Copilot for 365',
    website: 'https://microsoft.com',
    tagline: 'Your everyday AI companion.',
    filters: {
      pricing: 'paid',
      category: 'productivity',
      platforms: ['windows', 'web'],
      open_source: false,
      industry: 'office',
    },
    content: {
      intro: 'The deep integration of GPT-4 into Word, Excel, PowerPoint, Outlook, and Teams.',
      features: ['Draft in Word', 'Analyze in Excel', 'Create PPT'],
      limitations: ['Expensive per user', 'Requires 365 license'],
      pricing: [
        {name: 'Commercial', price: '$30/user/mo', features: ['Full suite'], highlight: true},
      ],
    },
    stats: {views: 100, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'DoNotPay',
    website: 'https://donotpay.com',
    tagline: "The world's first robot lawyer.",
    filters: {
      pricing: 'paid',
      category: 'legal',
      platforms: ['web', 'ios'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'A consumer bot that helps you fight parking tickets, cancel subscriptions, and sue robocalls automatically.',
      features: ['Subscription canceler', 'Ticket disputes', 'Small claims'],
      limitations: ['Subscription only', 'Effectiveness varies'],
      pricing: [
        {name: 'Subscription', price: '$36/3mo', features: ['Full access'], highlight: true},
      ],
    },
    stats: {views: 88, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Vicuna (LMSYS)',
    website: 'https://lmsys.org',
    tagline: 'Open-source chatbot impressing GPT-4.',
    filters: {
      pricing: 'open source',
      category: 'model',
      platforms: ['huggingface'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        'A chat assistant fine-tuned from Llama 2/3 on user-shared conversations. Known for high quality open-source chat.',
      features: ['High quality chat', 'Open weights', 'Llama base'],
      limitations: ['Not for commercial use (usually)', 'Model only'],
      pricing: [{name: 'Free', price: '$0', features: ['Download']}],
    },
    stats: {views: 80, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'WizardLM',
    website: 'https://github.com/nlpxucan/WizardLM',
    tagline: 'Empowering LLMs with Evol-Instruct.',
    filters: {
      pricing: 'open source',
      category: 'model',
      platforms: ['huggingface'],
      open_source: true,
      deployment: 'local',
    },
    content: {
      intro:
        "Famous for its 'Evol-Instruct' method, making it exceptionally good at following complex instructions.",
      features: ['Complex instruction', 'Math reasoning', 'Code gen'],
      limitations: ['Model weights only', 'Hardware req'],
      pricing: [{name: 'Free', price: '$0', features: ['Download']}],
    },
    stats: {views: 78, likes: 9.1, verified: 'tested'},
  },
  {
    name: 'Riffusion',
    website: 'https://riffusion.com',
    tagline: 'Generate music from spectrograms.',
    filters: {
      pricing: 'free',
      category: 'audio',
      platforms: ['web'],
      open_source: true,
      industry: 'music',
    },
    content: {
      intro:
        'An innovative project that fine-tuned Stable Diffusion to generate images of spectrograms, which are then converted to audio.',
      features: ['Text-to-music', 'Loop generation', 'Unique method'],
      limitations: ['Lo-fi quality', 'Experimental'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 70, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Modal',
    website: 'https://modal.com',
    tagline: 'End-to-end cloud compute.',
    filters: {
      pricing: 'paid',
      category: 'infrastructure',
      platforms: ['python'],
      open_source: false,
      deployment: 'cloud',
    },
    content: {
      intro:
        'Allows developers to run code in the cloud without configuring infrastructure. Popular for running AI inference jobs.',
      features: ['Serverless GPU', 'Instant boot', 'Pythonic'],
      limitations: ['Developer focused', 'Cost scaling'],
      pricing: [{name: 'Usage', price: 'Per sec', features: ['Pay as you go'], highlight: true}],
    },
    stats: {views: 65, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Arize AI',
    website: 'https://arize.com',
    tagline: 'ML observability platform.',
    filters: {
      pricing: 'freemium',
      category: 'mlops',
      platforms: ['web'],
      open_source: false,
      industry: 'tech',
    },
    content: {
      intro:
        'Monitors deployed ML models for performance degradation, drift, and data quality issues.',
      features: ['Drift detection', 'LLM evaluation', 'Root cause analysis'],
      limitations: ['Enterprise focus', 'Setup'],
      pricing: [
        {name: 'Free', price: '$0', features: ['2 models']},
        {name: 'Pro', price: 'Custom', features: ['Full suite'], highlight: true},
      ],
    },
    stats: {views: 60, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Deepchecks',
    website: 'https://deepchecks.com',
    tagline: 'Continuous validation for ML.',
    filters: {
      pricing: 'open source',
      category: 'mlops',
      platforms: ['python'],
      open_source: true,
      industry: 'tech',
    },
    content: {
      intro:
        'An open-source library for testing and validating ML models and data from research to production.',
      features: ['Data integrity', 'Model performance', 'CI/CD integration'],
      limitations: ['Code heavy', 'SaaS is paid'],
      pricing: [{name: 'Open Source', price: '$0', features: ['Library']}],
    },
    stats: {views: 55, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Humane AI Pin',
    website: 'https://humane.com',
    tagline: 'Screenless, sensing, personal.',
    filters: {
      pricing: 'hardware',
      category: 'hardware',
      platforms: ['proprietary'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'A wearable pin that projects a display onto your hand and uses voice/gestures to interact with AI services.',
      features: ['Laser projection', 'Voice OS', 'Translation'],
      limitations: ['Heat issues', 'Subscription required', 'Mixed reviews'],
      pricing: [{name: 'Device', price: '$699', features: ['+ $24/mo sub'], highlight: true}],
    },
    stats: {views: 98, likes: 6.5, verified: 'tested'},
  },
  {
    name: 'Taboola',
    website: 'https://taboola.com',
    tagline: 'Powering recommendations for the open web.',
    filters: {
      pricing: 'enterprise',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'adtech',
    },
    content: {
      intro:
        "The engine behind the 'recommended for you' articles on news sites, using AI to match content to user interests.",
      features: ['Content recommendation', 'Native ads', 'Predictive engine'],
      limitations: ['Ad focus', 'Publisher requirement'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Monetization'], highlight: true}],
    },
    stats: {views: 80, likes: 7.5, verified: 'tested'},
  },
  {
    name: 'Mutiny',
    website: 'https://mutinyhq.com',
    tagline: 'Turn your website into your #1 revenue channel.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'Uses AI to rewrite website headlines and change content dynamically based on who is visiting (industry, company size).',
      features: ['Personalization', 'A/B testing', 'Writer AI'],
      limitations: ['Expensive', 'B2B focus'],
      pricing: [{name: 'Growth', price: 'Custom', features: ['Full access'], highlight: true}],
    },
    stats: {views: 55, likes: 9.1, verified: 'tested'},
  },
  {
    name: '6sense',
    website: 'https://6sense.com',
    tagline: 'Revenue AI for B2B.',
    filters: {
      pricing: 'enterprise',
      category: 'sales',
      platforms: ['web'],
      open_source: false,
      industry: 'sales',
    },
    content: {
      intro:
        "Predicts which companies are in-market to buy your product by analyzing 'dark funnel' intent signals.",
      features: ['Intent data', 'Predictive modeling', 'Orchestration'],
      limitations: ['High enterprise cost', 'Complex setup'],
      pricing: [{name: 'Enterprise', price: 'Custom', features: ['Full suite'], highlight: true}],
    },
    stats: {views: 60, likes: 8.9, verified: 'tested'},
  },
  {
    name: 'Drift',
    website: 'https://drift.com',
    tagline: 'Conversational marketing.',
    filters: {
      pricing: 'paid',
      category: 'marketing',
      platforms: ['web'],
      open_source: false,
      industry: 'marketing',
    },
    content: {
      intro:
        'A chatbot platform that uses AI to qualify leads on your website and book meetings for sales reps.',
      features: ['Conversational AI', 'Meeting booking', 'Intent analysis'],
      limitations: ['Expensive', 'Can be annoying to users'],
      pricing: [{name: 'Premium', price: '$2,500/mo', features: ['AI tools'], highlight: true}],
    },
    stats: {views: 75, likes: 8.6, verified: 'tested'},
  },
  {
    name: 'Dialpad',
    website: 'https://dialpad.com',
    tagline: 'The AI-powered customer intelligence platform.',
    filters: {
      pricing: 'paid',
      category: 'comms',
      platforms: ['web', 'app'],
      open_source: false,
      industry: 'business',
    },
    content: {
      intro:
        'A business phone system with built-in AI that transcribes calls in real-time and coaches agents live.',
      features: ['Real-time transcript', 'Sentiment analysis', 'Live coaching'],
      limitations: ['VoIP dependency', 'Per user cost'],
      pricing: [{name: 'Standard', price: '$15/mo', features: ['AI voice'], highlight: true}],
    },
    stats: {views: 65, likes: 8.8, verified: 'tested'},
  },
  {
    name: 'Waze',
    website: 'https://waze.com',
    tagline: 'Outsmart traffic.',
    filters: {
      pricing: 'free',
      category: 'navigation',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'transport',
    },
    content: {
      intro:
        'Google-owned navigation that uses crowdsourced data and AI to route you around traffic in real-time.',
      features: ['Crowdsourcing', 'Real-time routing', 'Police alerts'],
      limitations: ['Ads', 'Battery drain'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 99, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Uber (Routing)',
    website: 'https://uber.com',
    tagline: 'Go anywhere.',
    filters: {
      pricing: 'free',
      category: 'logistics',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'transport',
    },
    content: {
      intro:
        'Uses massive AI models to predict demand (surge pricing), match riders/drivers, and optimize routes.',
      features: ['Demand prediction', 'Matching algo', 'Route optimization'],
      limitations: ['Service fees', 'Gig economy'],
      pricing: [{name: 'Free', price: '$0', features: ['App access']}],
    },
    stats: {views: 100, likes: 9.2, verified: 'tested'},
  },
  {
    name: 'Pinterest Lens',
    website: 'https://pinterest.com',
    tagline: 'Visual search for ideas.',
    filters: {
      pricing: 'free',
      category: 'vision',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'Allows you to take a photo of an object (like a chair or shoe) and finds similar items to buy or style.',
      features: ['Visual search', 'Shop the look', 'Style matching'],
      limitations: ['Shopping focus', 'App only'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 95, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'Google Lens',
    website: 'https://lens.google',
    tagline: 'Search what you see.',
    filters: {
      pricing: 'free',
      category: 'vision',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'The gold standard for visual search. Translate text, identify plants, solve homework, and shop from your camera.',
      features: ['Translation', 'Homework help', 'Object ID'],
      limitations: ['Privacy', 'Requires internet'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 100, likes: 9.9, verified: 'tested'},
  },
  {
    name: 'Shazam',
    website: 'https://shazam.com',
    tagline: 'Identify music instantly.',
    filters: {
      pricing: 'free',
      category: 'audio',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'music',
    },
    content: {
      intro:
        'Apple-owned app that uses audio fingerprinting AI to identify songs playing around you in seconds.',
      features: ['Music ID', 'Lyrics', 'Apple Music sync'],
      limitations: ['Requires distinct audio', 'No humming (mostly)'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 100, likes: 9.9, verified: 'tested'},
  },
  {
    name: 'SwiftKey',
    website: 'https://microsoft.com/swiftkey',
    tagline: 'The smart keyboard.',
    filters: {
      pricing: 'free',
      category: 'utility',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        "Microsoft's mobile keyboard that learns your writing style for predictive text, now integrated with Bing Chat.",
      features: ['Predictive text', 'Bing AI', 'Theme engine'],
      limitations: ['Data privacy', 'Keyboard lag'],
      pricing: [{name: 'Free', price: '$0', features: ['Full access']}],
    },
    stats: {views: 95, likes: 9.3, verified: 'tested'},
  },
  {
    name: 'Prisma',
    website: 'https://prisma-ai.com',
    tagline: 'Turn photos into art.',
    filters: {
      pricing: 'freemium',
      category: 'photo',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'consumer',
    },
    content: {
      intro:
        'The app that popularized neural style transfer, turning photos into paintings in the style of Van Gogh or Picasso.',
      features: ['Style transfer', 'Art filters', 'Daily styles'],
      limitations: ['HD paid', 'Slower processing'],
      pricing: [
        {name: 'Free', price: '$0', features: ['SD output']},
        {name: 'Premium', price: '$7.99/mo', features: ['HD'], highlight: true},
      ],
    },
    stats: {views: 88, likes: 9.0, verified: 'tested'},
  },
  {
    name: 'Strava (Metro/Routes)',
    website: 'https://strava.com',
    tagline: 'The social network for athletes.',
    filters: {
      pricing: 'freemium',
      category: 'wellness',
      platforms: ['ios', 'android', 'web'],
      open_source: false,
      industry: 'fitness',
    },
    content: {
      intro:
        'Uses aggregated data from millions of athletes to suggest popular running/cycling routes and analyze performance.',
      features: ['Route builder', 'Segment analysis', 'Relative effort'],
      limitations: ['Privacy zones', 'Premium features'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Tracking']},
        {name: 'Subscription', price: '$11.99/mo', features: ['Analysis'], highlight: true},
      ],
    },
    stats: {views: 95, likes: 9.6, verified: 'tested'},
  },
  {
    name: 'Oura',
    website: 'https://ouraring.com',
    tagline: 'Smart ring for health.',
    filters: {
      pricing: 'hardware',
      category: 'wearable',
      platforms: ['hardware'],
      open_source: false,
      industry: 'health',
    },
    content: {
      intro:
        "A smart ring that tracks sleep and readiness. Uses AI to analyze biosignals and predict if you're getting sick.",
      features: ['Sleep tracking', 'Readiness score', 'Sickness prediction'],
      limitations: ['Hardware cost + Sub', 'Ring format'],
      pricing: [{name: 'Ring', price: '$299', features: ['+ $5.99/mo'], highlight: true}],
    },
    stats: {views: 85, likes: 9.4, verified: 'tested'},
  },
  {
    name: 'TaxGPT (April)',
    website: 'https://getapril.com',
    tagline: 'AI-powered tax filing.',
    filters: {
      pricing: 'paid',
      category: 'finance',
      platforms: ['web'],
      open_source: false,
      industry: 'fintech',
    },
    content: {
      intro:
        'A tax platform that uses AI to parse tax documents and autofill your return, minimizing manual data entry.',
      features: ['Doc parsing', 'Instant filing', 'Tax optimization'],
      limitations: ['US only', 'Complex returns vary'],
      pricing: [{name: 'Filing', price: 'Varies', features: ['Federal/State'], highlight: true}],
    },
    stats: {views: 50, likes: 8.5, verified: 'tested'},
  },
  {
    name: 'Cleo',
    website: 'https://meetcleo.com',
    tagline: 'The AI that roasts your spending.',
    filters: {
      pricing: 'freemium',
      category: 'finance',
      platforms: ['ios', 'android'],
      open_source: false,
      industry: 'fintech',
    },
    content: {
      intro:
        "A budgeting app with a sassy AI persona that 'roasts' you for spending too much or 'hypes' you for saving.",
      features: ['Roast mode', 'Budgeting', 'Cash advance'],
      limitations: ['Personality polarized', 'Subscription for cash'],
      pricing: [
        {name: 'Free', price: '$0', features: ['Budgeting']},
        {name: 'Plus', price: '$5.99/mo', features: ['Credit builder'], highlight: true},
      ],
    },
    stats: {views: 80, likes: 9.2, verified: 'tested'},
  },

  //end document
]

// 3. THE BUILDER LOGIC (Don't touch this unless needed)
const BATCH_SIZE = 100 // Sanity transaction limit; batching avoids overflow

const importData = async () => {
  console.log(`🚀 Preparing to import ${toolsToImport.length} tools...`)
  const slugCounts = new Map<string, number>()

  for (let idx = 0; idx < toolsToImport.length; idx += BATCH_SIZE) {
    const batch = toolsToImport.slice(idx, idx + BATCH_SIZE)
    const transaction = client.transaction()

    for (let i = 0; i < batch.length; i++) {
      const tool = batch[i]
      const globalIndex = idx + i
      console.log(`Processing [${globalIndex + 1}/${toolsToImport.length}]: ${tool.name}...`)

      const base = slugify(tool.name, {lower: true, strict: true})
      const count = slugCounts.get(base) ?? 0
      slugCounts.set(base, count + 1)
      const slugCurrent = count === 0 ? base : `${base}-${count + 1}`

      const doc = {
        _type: 'tool',
        _id: `tool-${globalIndex}-${base}`,
        name: tool.name,
        slug: {_type: 'slug', current: slugCurrent},
        websiteUrl: tool.website,
        shortDescription: tool.tagline,
        status: 'active',

        // 1. BUILD PROPERTIES
        properties: Object.entries(tool.filters).map(([key, value]) => ({
          _key: nanoid(),
          key: key, // e.g., "pricing"
          displayName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize key as display name
          // Auto-detect type
          type: Array.isArray(value) ? 'multiselect' : 'select',
          value: Array.isArray(value) ? value.join(',') : value,
          filterPriority: 2,
          showInCard: true,
          icon: '🔹', // Default icon
        })),

        // 2. BUILD CONTENT BLOCKS
        content: [
          // A. Intro Text Block
          {
            _key: nanoid(),
            _type: 'richTextBlock',
            heading: 'Overview',
            content: [
              {
                _type: 'block',
                style: 'normal',
                children: [{_type: 'span', text: tool.content.intro}],
              },
            ],
          },

          // B. Features List
          ...(tool.content.features
            ? [
                {
                  _key: nanoid(),
                  _type: 'listBlock',
                  heading: 'Key Features',
                  listType: 'features',
                  items: tool.content.features,
                },
              ]
            : []),

          // C. Pricing Block
          ...(tool.content.pricing
            ? [
                {
                  _key: nanoid(),
                  _type: 'pricingBlock',
                  plans: tool.content.pricing.map((plan) => ({
                    _key: nanoid(),
                    name: plan.name,
                    price: plan.price,
                    features: plan.features || [],
                    highlight: plan.highlight || false,
                  })),
                },
              ]
            : []),

          // D. Limitations List
          ...(tool.content.limitations
            ? [
                {
                  _key: nanoid(),
                  _type: 'listBlock',
                  heading: 'Limitations',
                  listType: 'limitations',
                  items: tool.content.limitations,
                },
              ]
            : []),
        ],

        // 3. METADATA
        metadata: {
          verification: tool.stats?.verified || 'listed',
          views: Number(tool.stats?.views) || 0,
          likes: Number(tool.stats?.likes) || 0,
          featured: false,
        },
      }

      transaction.createOrReplace(doc)
    }

    try {
      const result = await transaction.commit()
      console.log(
        `✅ Batch ${Math.floor(idx / BATCH_SIZE) + 1}: imported ${result.results.length} documents.`,
      )
    } catch (err: any) {
      console.error(`❌ Batch failed:`, err?.message || err)
      throw err
    }
  }

  console.log(`✅ Done! Imported ${toolsToImport.length} tools in total.`)
}

importData()
