module.exports = {
	env: {
		browser: true,
		es6: true,
		'jest/globals': true
	},
	plugins: ['jest'],
	extends: 'eslint:recommended',
	parserOptions: {
		sourceType: 'module'
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'never']
	}
}
