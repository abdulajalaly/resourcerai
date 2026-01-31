import {defineType, defineField} from 'sanity'
import {PropertyInput} from '../components/PropertyInput'

export default defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  fields: [
    // ============================================
    // CORE REQUIRED FIELDS (minimal)
    // ============================================
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'One-line tagline for cards (max 120 chars)',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '🟢 Active', value: 'active'},
          {title: '🟡 Beta', value: 'beta'},
          {title: '🔴 Deprecated', value: 'deprecated'},
          {title: '⚫ Discontinued', value: 'discontinued'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),

    // ============================================
    // DYNAMIC PROPERTIES SYSTEM
    // ============================================
    defineField({
      name: 'properties',
      title: 'Properties',
      type: 'array',
      description: 'Add any property - they become filters automatically',
      components: {
        input: PropertyInput,
      },
      of: [
        {
          type: 'object',
          name: 'property',
          fields: [
            {
              name: 'key',
              title: 'Property Key',
              type: 'string',
              description: 'Internal identifier (e.g., \"pricing\", \"toolType\", \"platform\")',
              validation: (Rule) =>
                Rule.required().custom((key?: string) => {
                  if (!key) return true
                  if (!/^[a-z0-9_-]+$/.test(key)) {
                    return 'Must be lowercase letters, numbers, dashes, or underscores only'
                  }
                  return true
                }),
            },
            {
              name: 'displayName',
              title: 'Display Name',
              type: 'string',
              description: 'How it appears to users (e.g., \"Pricing Model\", \"Platform\")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Value Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Single Choice', value: 'select'},
                  {title: 'Multiple Choices', value: 'multiselect'},
                  {title: 'Text', value: 'text'},
                  {title: 'Number', value: 'number'},
                  {title: 'Yes/No', value: 'boolean'},
                  {title: 'Date', value: 'date'},
                  {title: 'Price Range', value: 'priceRange'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description:
                'For multiple choices, separate with commas (e.g., \"web,mobile,desktop\")',
            },
            {
              name: 'unit',
              title: 'Unit (optional)',
              type: 'string',
              description: 'e.g., \"minutes\", \"$\", \"GB\", \"%\"',
              hidden: ({parent}: any) => !['number', 'priceRange'].includes(parent?.type),
            },
            {
              name: 'filterPriority',
              title: 'Filter Priority',
              type: 'number',
              description:
                '1 = Main filters (always visible), 2 = Secondary, 3 = Advanced (hidden by default)',
              options: {
                list: [
                  {title: '⭐ Main Filter (Priority 1)', value: 1},
                  {title: '📋 Secondary Filter (Priority 2)', value: 2},
                  {title: '🔍 Advanced Filter (Priority 3)', value: 3},
                ],
              },
              initialValue: 2,
            },
            {
              name: 'showInCard',
              title: 'Show in Tool Card?',
              type: 'boolean',
              description: 'Display this property on the tool card preview',
              initialValue: false,
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Emoji or icon identifier (e.g., \"💰\", \"⚡\", \"🔒\")',
              validation: (Rule) => Rule.max(10),
            },
          ],
          preview: {
            select: {
              key: 'key',
              displayName: 'displayName',
              value: 'value',
              icon: 'icon',
              showInCard: 'showInCard',
            },
            prepare({key, displayName, value, icon, showInCard}: any) {
              return {
                title: `${icon || '•'} ${displayName || key}`,
                subtitle: `${value || 'No value'} ${showInCard ? '📌' : ''}`,
              }
            },
          },
        },
      ],
    }),

    // ============================================
    // FLEXIBLE CONTENT BLOCKS
    // ============================================
    defineField({
      name: 'content',
      title: 'Content Blocks',
      type: 'array',
      description: 'Add any content - page layout adapts automatically',
      of: [
        // Text Block
        {
          type: 'object',
          name: 'textBlock',
          title: 'Text Section',
          icon: () => '📝',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {name: 'content', title: 'Content', type: 'text', rows: 5},
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}: any) {
              return {title: `📝 ${title || 'Text Block'}`}
            },
          },
        },

        // Rich Text Block
        {
          type: 'object',
          name: 'richTextBlock',
          title: 'Rich Text',
          icon: () => '📄',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}: any) {
              return {title: `📄 ${title || 'Rich Text'}`}
            },
          },
        },

        // List Block
        {
          type: 'object',
          name: 'listBlock',
          title: 'List Block',
          icon: () => '📋',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {
              name: 'listType',
              title: 'List Type',
              type: 'string',
              options: {
                list: [
                  {title: '✓ Pros', value: 'pros'},
                  {title: '✗ Cons', value: 'cons'},
                  {title: '⚡ Features', value: 'features'},
                  {title: '🎯 Use Cases', value: 'useCases'},
                  {title: '⚠️ Limitations', value: 'limitations'},
                  {title: '• Custom List', value: 'custom'},
                ],
              },
              initialValue: 'features',
            },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
          preview: {
            select: {title: 'heading', type: 'listType'},
            prepare({title, type}: any) {
              const icons: Record<string, string> = {
                pros: '✓',
                cons: '✗',
                features: '⚡',
                useCases: '🎯',
                limitations: '⚠️',
                custom: '•',
              }
              return {title: `${icons[type] || '•'} ${title || 'List'}`}
            },
          },
        },

        // Media Gallery
        {
          type: 'object',
          name: 'mediaBlock',
          title: 'Media Gallery',
          icon: () => '🖼️',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {
              name: 'media',
              title: 'Media Items',
              type: 'array',
              of: [
                {
                  type: 'image',
                  fields: [
                    {name: 'caption', title: 'Caption', type: 'string'},
                    {name: 'alt', title: 'Alt Text', type: 'string'},
                  ],
                },
              ],
            },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  {title: 'Grid', value: 'grid'},
                  {title: 'Carousel', value: 'carousel'},
                  {title: 'Single', value: 'single'},
                ],
              },
              initialValue: 'grid',
            },
          ],
          preview: {
            select: {title: 'heading', media0: 'media.0'},
            prepare({title, media0}: any) {
              return {
                title: `🖼️ ${title || 'Media Gallery'}`,
                media: media0,
              }
            },
          },
        },

        // Pricing Table
        {
          type: 'object',
          name: 'pricingBlock',
          title: 'Pricing Plans',
          icon: () => '💰',
          fields: [
            {
              name: 'plans',
              title: 'Plans',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'name', title: 'Plan Name', type: 'string'},
                    {name: 'price', title: 'Price', type: 'string'},
                    {
                      name: 'period',
                      title: 'Period',
                      type: 'string',
                      placeholder: 'per month',
                    },
                    {
                      name: 'features',
                      title: 'Features',
                      type: 'array',
                      of: [{type: 'string'}],
                    },
                    {
                      name: 'cta',
                      title: 'Call to Action',
                      type: 'string',
                      placeholder: 'Get Started',
                    },
                    {name: 'ctaUrl', title: 'CTA URL', type: 'url'},
                    {
                      name: 'highlight',
                      title: 'Highlight Plan',
                      type: 'boolean',
                      initialValue: false,
                    },
                  ],
                  preview: {
                    select: {name: 'name', price: 'price', highlight: 'highlight'},
                    prepare({name, price, highlight}: any) {
                      return {
                        title: `${highlight ? '⭐ ' : ''}${name}`,
                        subtitle: price,
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {plans: 'plans'},
            prepare({plans}: any) {
              return {title: `💰 Pricing (${plans?.length || 0} plans)`}
            },
          },
        },

        // Use Case Examples
        {
          type: 'object',
          name: 'useCaseBlock',
          title: 'Use Case Examples',
          icon: () => '🎯',
          fields: [
            {
              name: 'cases',
              title: 'Use Cases',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'title', title: 'Title', type: 'string'},
                    {name: 'description', title: 'Description', type: 'text'},
                    {name: 'example', title: 'Example', type: 'text'},
                    {name: 'screenshot', title: 'Screenshot', type: 'image'},
                  ],
                  preview: {
                    select: {title: 'title', media: 'screenshot'},
                    prepare({title, media}: any) {
                      return {title: title || 'Use Case', media}
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {cases: 'cases'},
            prepare({cases}: any) {
              return {title: `🎯 Use Cases (${cases?.length || 0})`}
            },
          },
        },

        // Video Embed
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Video',
          icon: () => '🎥',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'YouTube, Vimeo, or Loom URL',
            },
            {name: 'caption', title: 'Caption', type: 'string'},
          ],
          preview: {
            select: {title: 'heading', url: 'url'},
            prepare({title, url}: any) {
              return {title: `🎥 ${title || 'Video'}`, subtitle: url}
            },
          },
        },
      ],
    }),

    // ============================================
    // RELATIONSHIPS (Dynamic)
    // ============================================
    defineField({
      name: 'relationships',
      title: 'Related Tools',
      type: 'array',
      description: 'Define relationships to other tools',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Relationship Type',
              type: 'string',
              options: {
                list: [
                  {title: '🔄 Similar Tools', value: 'similar'},
                  {title: '🔀 Alternatives', value: 'alternative'},
                  {title: '🤝 Works Well With', value: 'complement'},
                  {title: '⬆️ Upgrades From', value: 'upgrade'},
                  {title: '⬇️ Downgrades To', value: 'downgrade'},
                  {title: '➡️ Often Used Before', value: 'before'},
                  {title: '⬅️ Often Used After', value: 'after'},
                ],
              },
            },
            {
              name: 'displayName',
              title: 'Display Name (optional)',
              type: 'string',
              description: 'Override default (e.g., \"Budget Alternatives\")',
            },
            {
              name: 'tools',
              title: 'Tools',
              type: 'array',
              of: [{type: 'reference', to: [{type: 'tool'}]}],
            },
            {
              name: 'note',
              title: 'Note (optional)',
              type: 'text',
              description: 'Why these tools? When to use?',
            },
          ],
          preview: {
            select: {
              type: 'type',
              displayName: 'displayName',
              tools: 'tools',
            },
            prepare({type, displayName, tools}: any) {
              const typeLabels: Record<string, string> = {
                similar: '🔄 Similar',
                alternative: '🔀 Alternatives',
                complement: '🤝 Complements',
                upgrade: '⬆️ Upgrades',
                downgrade: '⬇️ Downgrades',
                before: '➡️ Before',
                after: '⬅️ After',
              }
              return {
                title: displayName || typeLabels[type] || type,
                subtitle: `${tools?.length || 0} tools`,
              }
            },
          },
        },
      ],
    }),

    // ============================================
    // LEGACY COMPATIBILITY (Temporary)
    // ============================================
    defineField({
      name: 'legacyCategory',
      title: 'Legacy Category',
      type: 'reference',
      to: [{type: 'category'}],
      description: '⚠️ DEPRECATED: Use properties instead',
      hidden: true,
    }),
    defineField({
      name: 'legacyTags',
      title: 'Legacy Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: '⚠️ DEPRECATED: Use properties instead',
      hidden: true,
    }),
    defineField({
      name: 'legacyDescription',
      title: 'Legacy Description',
      type: 'array',
      of: [{type: 'block'}],
      description: '⚠️ DEPRECATED: Use content blocks instead',
      hidden: true,
    }),

    // ============================================
    // METADATA
    // ============================================
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        {
          name: 'verification',
          title: 'Verification Status',
          type: 'string',
          options: {
            list: [
              {title: '✓ Tested by us', value: 'tested'},
              {title: '◉ Community verified', value: 'community'},
              {title: '○ Listed only', value: 'listed'},
            ],
          },
          initialValue: 'listed',
        },
        {name: 'lastVerified', title: 'Last Verified Date', type: 'date'},
        {name: 'featured', title: 'Featured Tool', type: 'boolean', initialValue: false},
        {name: 'views', title: 'Page Views', type: 'number', initialValue: 0, readOnly: true},
        {name: 'clicks', title: 'Outbound Clicks', type: 'number', initialValue: 0, readOnly: true},
        {name: 'likes', title: 'Likes', type: 'number', initialValue: 0},
      ],
    }),

    // ============================================
    // SEO
    // ============================================
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Leave empty to use tool name',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Leave empty to use logo',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'shortDescription',
      media: 'logo',
      status: 'status',
    },
    prepare({title, subtitle, media, status}: any) {
      const statusEmoji: Record<string, string> = {
        active: '🟢',
        beta: '🟡',
        deprecated: '🔴',
        discontinued: '⚫',
      }
      return {
        title: `${statusEmoji[status] || ''} ${title}`,
        subtitle,
        media,
      }
    },
  },
})
