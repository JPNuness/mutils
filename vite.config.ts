import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['packages/*']
		},
		exclude: [...configDefaults.exclude, 'packages/**/dist/**']
	}
})
