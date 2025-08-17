import faviconsPlugin from 'eleventy-plugin-gen-favicons';
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import {RenderPlugin} from "@11ty/eleventy";

const removeTrailingSlash = (url) => {
    if (typeof url !== 'string') {
        throw new Error(`${removeTrailingSlash.name}: expected argument of type string but instead got ${url} (${typeof url})`);
    }
    return url.replace(/\/$/, '');
}
export default function (eleventyConfig) {

    eleventyConfig.addFilter("removeTrailingSlash", removeTrailingSlash);

    //compile tailwind before eleventy processes the files
    eleventyConfig.addPlugin(faviconsPlugin,
        {'outputDir': 'dist',
                'manifestData': {'name': 'scavino.org'}
                }
    );

    eleventyConfig.addPlugin(RenderPlugin);

    // Optional: add configuration options here
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

    // Passthroughs
    eleventyConfig.addPassthroughCopy({ './src/static/': '/' });

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes",
            data: "data",
        },
        templateFormats: ["html", "njk", "md", "11ty.js"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
    };
}