import studio from '@sanity/eslint-config-studio'

export default [
  ...studio,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
    },
  },
]
