import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const heroImagesDir = path.join(projectRoot, 'heroImages');
const mobileImagesDir = path.join(heroImagesDir, 'mobile');
const supportedExtensions = new Set(['.webp', '.png', '.jpg', '.jpeg', '.avif']);
const maxDimension = 1440;
const quality = 72;

async function ensureCleanOutputDir() {
    await fs.rm(mobileImagesDir, { recursive: true, force: true });
    await fs.mkdir(mobileImagesDir, { recursive: true });
}

async function getRootHeroImages() {
    const entries = await fs.readdir(heroImagesDir, { withFileTypes: true });

    return entries
        .filter(entry => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
        .map(entry => entry.name)
        .sort((left, right) => left.localeCompare(right));
}

async function generateMobileVariant(fileName) {
    const sourcePath = path.join(heroImagesDir, fileName);
    const outputName = `${path.parse(fileName).name}-mobile.webp`;
    const outputPath = path.join(mobileImagesDir, outputName);

    await sharp(sourcePath, { failOn: 'none' })
        .rotate()
        .resize({
            width: maxDimension,
            height: maxDimension,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({
            quality,
            effort: 6,
        })
        .toFile(outputPath);
}

async function main() {
    const files = await getRootHeroImages();
    await ensureCleanOutputDir();
    await Promise.all(files.map(generateMobileVariant));
    console.log(`Generated ${files.length} mobile hero images in ${path.relative(projectRoot, mobileImagesDir)}.`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
