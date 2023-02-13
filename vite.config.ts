import { defineConfig } from 'vite'

import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const lifecycle = process.env.npm_lifecycle_event
    return {
        plugins: [
            tsconfigPaths(),
            dts({ tsConfigFilePath: 'tsconfig.build.json', aliasesExclude: [/^@\//], rollupTypes: true }),
            lifecycle === 'report'
                ? visualizer({
                    open: true,
                    brotliSize: true,
                    filename: 'report.html',
                })
                : null,
        ],
        /*     esbuild: {
                mangleProps: command == 'serve' ? undefined : /(?:^_)|(?:_$)/
            }, */
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                formats: ['es'],
                // the proper extensions will be added
                fileName: 'problem',
            },
            rollupOptions: {
                external: [
                    /^lodash/,
                ],
            },
            target: 'esnext',
            minify: false,
            reportCompressedSize: false,
            sourcemap: true,
        },
    }
})
