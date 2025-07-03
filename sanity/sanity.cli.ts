import {defineConfig} from 'sanity'

export default defineConfig({
  name: 'cli',
  title: 'Resourcer CLI',
  projectId: '9g7x9be2',
  dataset: 'production',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
