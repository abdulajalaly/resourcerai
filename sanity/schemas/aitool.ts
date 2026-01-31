import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'aitool',
  title: 'AI Tool',
  type: 'document',
  fields: [
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'websiteUrl', title: 'Website URL', type: 'url'}),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      options: {
        list: [
          {title: 'Free', value: 'Free'},
          {title: 'Paid', value: 'Paid'},
          {title: 'Freemium', value: 'Freemium'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
