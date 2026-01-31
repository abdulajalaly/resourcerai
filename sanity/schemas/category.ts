import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: '⚠️ Category (DEPRECATED)',
  type: 'document',
  description: 'Legacy categories. New tools should use properties instead.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji icon',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
    },
    prepare({title, icon}: any) {
      return {
        title: `${icon || '📁'} ${title}`,
        subtitle: 'Legacy Category',
      }
    },
  },
})
