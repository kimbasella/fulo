const esbuild = require('esbuild');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Check if watch mode is enabled
const isWatchMode = process.argv.includes('--watch');

// Check if production mode is enabled (no source maps)
const isProduction = process.argv.includes('--prod');

const buildConfig = {
    entryPoints: ['index.js'],
    bundle: true,
    minify: true,
    sourcemap: !isProduction,
    outfile: 'index.min.js',
    platform: 'node',
    target: 'node18',
};

async function generateCriticalCSS() {
    try {
        // Dynamically import the critical package
        const { generate } = await import('critical');

        await generate({
            base: __dirname,
            src: 'index.html',
            css: ['index.min.css'],
            width: 1300,
            height: 900,
            target: {
                html: 'index.html' // Explicitly set the output to overwrite the source
            },
            inline: true, // Ensure CSS is inlined
        });

        console.log('✅ Critical CSS generated and inlined successfully.');

    } catch (error) {
        console.error('❌ Failed to generate critical CSS:', error);
    }
}

// Function to run versioning
function runVersioning() {
    try {
        execSync('node version.js', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Versioning failed:', error);
    }
}

if (isWatchMode) {
    buildConfig.watch = {
        onRebuild(error, result) {
            if (error) {
                console.error('❌ Watch build failed:', error);
            } else {
                console.log('✅ Watch build succeeded:', result);
                runVersioning();
            }
        },
    };
}

esbuild.build(buildConfig).then(async () => {
    if (isWatchMode) {
        console.log('👀 Watching for changes in index.js...');
    } else {
        console.log('✅ Build successful: index.min.js has been created.');
        await generateCriticalCSS();
        runVersioning();
    }
}).catch(() => process.exit(1)); 