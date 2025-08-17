import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import faviconsPlugin from 'eleventy-plugin-gen-favicons';
import { feedPlugin } from "@11ty/eleventy-plugin-rss";


export default function (eleventyConfig) {

    eleventyConfig.addFilter("removeTrailingSlash", function(url) {
        if (typeof url !== 'string') {
            return url; // Return as is if not a string
        }
        return url.replace(/\/+$/, ''); // Remove one or more trailing slashes
    });
    //compile tailwind before eleventy processes the files
    eleventyConfig.addPlugin(faviconsPlugin, {}); // Optional: add configuration options here
    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom", // or "rss", "json"
        outputPath: "/feed.xml",
        collection: {
            name: "posts", // iterate over `collections.posts`
            limit: 10,     // 0 means no limit
        },
        metadata: {
            language: "en",
            title: "Blog Title",
            subtitle: "This is a longer description about your blog.",
            base: "https://example.com/",
            author: {
                name: "Your Name",
                email: "", // Optional
            }
        }
    });

    eleventyConfig.on('eleventy.before', async () => {
        const tailwindInputPath = path.resolve('./src/assets/styles/index.css');
        const tailwindOutputPath = '/assets/styles/index.css';
        const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');


        const outputDir = path.dirname(tailwindOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await processor.process(cssContent, {
            from: tailwindInputPath,
            to: tailwindOutputPath,
        });

        fs.writeFileSync(tailwindOutputPath, result.css);
    });

    const processor = postcss([
        //compile tailwind
        tailwindcss(),

        //minify tailwind css
        cssnano({
            preset: 'default',
        }),
    ]);



    return {
        dir: { input: 'src', output: 'dist' },
    };
}