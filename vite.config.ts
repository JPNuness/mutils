import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
		exclude: [...configDefaults.exclude, 'packages/**/dist/**'],
	},
})
