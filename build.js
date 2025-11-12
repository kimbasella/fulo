import * as esbuild from 'esbuild';

const isWatchMode = process.argv.includes('--watch');

// Build configuration
const buildConfig = {
    entryPoints: ['index.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2015'],
    outfile: 'index.min.js',
};

// Function to generate critical CSS (if you have this functionality)
async function generateCriticalCSS() {
    // Your critical CSS generation logic here
    console.log('✅ Critical CSS generated');
}

if (isWatchMode) {
    buildConfig.watch = {
        onRebuild(error, result) {
            if (error) {
                console.error('❌ Watch build failed:', error);
            } else {
                console.log('✅ Watch build succeeded:', result);
            }
        },
    };
}

// Main build process
try {
    await esbuild.build(buildConfig);
    if (isWatchMode) {
        console.log('👀 Watching for changes in index.js...');
    } else {
        console.log('✅ Build successful: index.min.js has been created.');
        await generateCriticalCSS();
    }
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
} 