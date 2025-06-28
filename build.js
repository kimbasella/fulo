import * as esbuild from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
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

// Function to run versioning
async function runVersioning() {
    try {
        await execAsync('node version.js');
        console.log('✅ Versioning completed');
    } catch (error) {
        console.error('❌ Versioning failed:', error);
    }
}

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
                runVersioning();
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
        await runVersioning();
    }
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
} 