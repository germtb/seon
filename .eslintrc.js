module.exports = {
	env: {
		browser: true,
		es6: true,
		'jest/globals': true
	},
	plugins: ['jest'],
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			experimentalObjectRestSpread: true
		}
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'never'],
		'no-console': ['error', { allow: ['info', 'error'] }],
		'jest/no-disabled-tests': ['warn'],
		'jest/no-focused-tests': ['error'],
		'jest/no-identical-title': ['error'],
		'jest/valid-expect': ['error'],
		indent: ['off']
	},
	globals: {
		__filename: true,
		__dirname: true,
		process: true
	}
}
