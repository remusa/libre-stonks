import path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { internalIpV4 } from "internal-ip";
import { defineConfig } from "vite";

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	// root: path.join(path.dirname('./'), 'src'),
	plugins: [svelte()],

	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},

	build: {
		target: ["es2022", "chrome120", "safari137"],
		// minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
		sourcemap: !!process.env.TAURI_DEBUG,
		outDir: "dist",
	},

	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: mobile ? "0.0.0.0" : false,
		hmr: mobile
			? {
					protocol: "ws",
					host: await internalIpV4(),
					port: 1421,
			  }
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},

	envPrefix: ["VITE_", "TAURI_"],
}));
