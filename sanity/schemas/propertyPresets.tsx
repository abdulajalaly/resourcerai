export const PROPERTY_PRESETS = [
  // Core Properties
  {
    key: 'pricing',
    displayName: 'Pricing',
    type: 'select',
    icon: '💰',
    filterPriority: 1,
    showInCard: true,
    commonValues: ['free', 'freemium', 'paid', 'usage-based', 'enterprise'],
  },
  {
    key: 'toolType',
    displayName: 'Tool Type',
    type: 'multiselect',
    icon: '🔧',
    filterPriority: 1,
    showInCard: true,
    commonValues: ['webapp', 'desktop', 'mobile', 'extension', 'api', 'cli', 'model'],
  },
  {
    key: 'platform',
    displayName: 'Platform',
    type: 'multiselect',
    icon: '💻',
    filterPriority: 2,
    showInCard: true,
    commonValues: ['web', 'windows', 'mac', 'linux', 'ios', 'android'],
  },
  {
    key: 'skillLevel',
    displayName: 'Skill Level',
    type: 'select',
    icon: '🎓',
    filterPriority: 1,
    showInCard: true,
    commonValues: ['beginner', 'intermediate', 'advanced', 'expert'],
  },

  // Input/Output
  {
    key: 'inputType',
    displayName: 'Input Type',
    type: 'multiselect',
    icon: '📥',
    filterPriority: 2,
    showInCard: false,
    commonValues: ['text', 'image', 'video', 'audio', 'code', 'data', 'pdf'],
  },
  {
    key: 'outputType',
    displayName: 'Output Type',
    type: 'multiselect',
    icon: '📤',
    filterPriority: 2,
    showInCard: false,
    commonValues: ['text', 'image', 'video', 'audio', 'code', 'data', 'pdf'],
  },

  // Privacy & Security
  {
    key: 'dataPrivacy',
    displayName: 'Data Privacy',
    type: 'select',
    icon: '🔒',
    filterPriority: 2,
    showInCard: true,
    commonValues: ['local', 'cloud', 'hybrid', 'encrypted'],
  },
  {
    key: 'openSource',
    displayName: 'Open Source',
    type: 'boolean',
    icon: '🔓',
    filterPriority: 1,
    showInCard: true,
  },

  // Integration
  {
    key: 'hasAPI',
    displayName: 'Has API',
    type: 'boolean',
    icon: '🔌',
    filterPriority: 2,
    showInCard: true,
  },
  {
    key: 'integrations',
    displayName: 'Integrations',
    type: 'multiselect',
    icon: '🔗',
    filterPriority: 3,
    showInCard: false,
    commonValues: ['zapier', 'make', 'slack', 'notion', 'google-workspace', 'microsoft-365'],
  },

  // Practical
  {
    key: 'setupTime',
    displayName: 'Setup Time',
    type: 'number',
    unit: 'minutes',
    icon: '⚡',
    filterPriority: 2,
    showInCard: true,
  },
  {
    key: 'requiresAccount',
    displayName: 'Requires Account',
    type: 'boolean',
    icon: '👤',
    filterPriority: 3,
    showInCard: false,
  },

  // AI Specific
  {
    key: 'aiModel',
    displayName: 'AI Model',
    type: 'select',
    icon: '🤖',
    filterPriority: 2,
    showInCard: false,
    commonValues: ['gpt-4', 'claude', 'gemini', 'llama', 'custom', 'multiple'],
  },
  {
    key: 'contextWindow',
    displayName: 'Context Window',
    type: 'number',
    unit: 'tokens',
    icon: '📏',
    filterPriority: 3,
    showInCard: false,
  },
]
