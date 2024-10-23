## Introduction
SlashSEO's SEO Checker for Sanity is the ideal way to optimize your posts right within your own environment. 

It checks your keyword in the content, slug, title, and does checks for number of words and more.

Installation takes about 3 minutes or so max. Below you will find a demo, installation instructions and more. 

## Demo
![](https://github.com/FHW3E/SlashSEO-for-Sanity/blob/main/SlashSEO%20SEO%20Checker%20Demo.gif)
You can watch a [20-second demo video in this YouTube video](https://youtu.be/LtMPb3rR7_M)

## Installation
1. Run the following npm in your terminal:
```
npm install sanity-plugin-seo-tool
```

## Configuration
2. Go to your sanity.config.js file and add the following code:


```
import { defineConfig } from 'sanity'
import { seoTool } from 'sanity-plugin-seo-tool'
export default defineConfig({
// ...
plugins: [seoTool()],
// ...
})
```

3. Go to your sanity.config.js file and add the following code:

```
schema: {
    types: schemaTypes.map(schemaType => {
      if (schemaType.name === 'post') {
        return {
          ...schemaType,
          fields: [
            ...schemaType.fields,
            {
              name: 'seoAnalysis',
              title: 'SEO Analysis',
              type: 'object',
              fields: [
                {
                  name: 'keyword',
                  type: 'string',
                  title: 'Keyword'
                },
                {
                  name: 'keywordCount',
                  type: 'number',
                  title: 'Keyword Count'
                },
                {
                  name: 'keywordInTitle',
                  type: 'boolean',
                  title: 'Keyword in Title'
                },
                {
                  name: 'keywordInH2',
                  type: 'boolean',
                  title: 'Keyword in H2'
                },
                {
                  name: 'wordCount',
                  type: 'number',
                  title: 'Word Count'
                },
                {
                  name: 'keywordPercentage',
                  type: 'number',
                  title: 'Keyword Percentage'
                }
              ],
              components: {
                input: SEOTool
              }
            }
          ]
        };
      }
      return schemaType;
    })
  },
```

4. Go to src/config.example.js and rename it to config.js.
5. Add your API key to the config.js file (get your API key at https://slashseo.com)
6. Save all files and run the following npm:
```
npm run dev
```

## Usage

7. Go to your Sanity Studio and create a new post or edit an existing one.
8. Go to your document and click on the SEO Analysis field (this will be displayed below the content Body field)
10. The SEO analysis will be displayed in the SEO Analysis field.
11. Click "Analyze SEO" to run the analysis or after making changes to your content to get the latest insights and score.
