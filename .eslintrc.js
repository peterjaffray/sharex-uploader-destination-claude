module.exports = {
  env: {
    node: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Error prevention
    'no-console': 'off', // We need console for logging
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',

    // Code quality
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Security
    'no-new-require': 'error',
    'no-path-concat': 'error',

    // Style (warnings, not errors)
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'never'],
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn'
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        mocha: true
      },
      rules: {
        'no-unused-expressions': 'off' // Chai assertions
      }
    }
  ]
};
