const esbuild = require('esbuild');

// Check if watch mode is enabled
const isWatchMode = process.argv.includes('--watch');

// Check if production mode is enabled (no source maps)
const isProduction = process.argv.includes('--prod');

esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    minify: true,
    sourcemap: !isProduction,
    outfile: 'index.min.js',
    platform: 'node',
    target: 'node18',
    watch: isWatchMode ? {
        onRebuild(error, result) {
            if (error) {
                console.error('❌ Watch build failed:', error);
            } else {
                console.log('✅ Watch build succeeded:', result);
            }
        },
    } : false,
}).then(() => {
    if (isWatchMode) {
        console.log('👀 Watching for changes in index.js...');
    } else {
        console.log('✅ Build successful: index.min.js has been created.');
    }
}).catch(() => process.exit(1)); 