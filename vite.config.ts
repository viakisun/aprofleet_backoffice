import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5555,
		strictPort: false
	},
	preview: {
		port: 4444,
		strictPort: false
	}
});