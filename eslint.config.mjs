import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

import prettierOptions from './prettier.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
	{
		ignores: ['**/node_modules', '**/dist'],
	},
	js.configs.recommended,
	{
		files: ['**/*.mjs'],
		rules: {
		  "no-undef": "off"
		}
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				tsconfigRootDir: __dirname,
				project: [
					'./packages/core-utils/tsconfig.json',
					'./packages/vue-utils/tsconfig.json',
				],
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			prettier: eslintPluginPrettier,
		},
		rules: {
			...tsPlugin.configs['recommended-type-checked'].rules,
			// Let Prettier handle format checks
			'prettier/prettier': ['error', prettierOptions],
		},
	},
	prettierConfig,
]
