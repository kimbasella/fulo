import penthouse from 'penthouse';
import fs from 'fs';

const viewports = [
    { width: 375, height: 667, media: '(max-width: 767px)' },       // Mobile
    { width: 768, height: 1024, media: '(min-width: 768px) and (max-width: 1279px)' }, // Tablet
    { width: 1300, height: 900, media: '(min-width: 1280px)' },     // Desktop
];

const url = 'file:///Users/admin/Desktop/Fulo/index.html'; // Or use file:///path/to/index.html
const cssFile = 'index.min.css';

(async () => {
    let combinedCss = '';

    for (const vp of viewports) {
        console.log(`Generating critical CSS for ${vp.width}x${vp.height}`);
        const criticalCss = await penthouse({
            url,
            css: cssFile,
            width: vp.width,
            height: vp.height,
        });
        combinedCss += `\n/* Critical CSS for ${vp.width}x${vp.height} */\n@media ${vp.media} {\n${criticalCss}\n}\n`;
    }

    fs.writeFileSync('critical.css', combinedCss);
    console.log('Combined critical CSS with media queries saved to critical.css');
})();
