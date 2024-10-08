## Installation
1. Run the following npm in your terminal:
```
npm install sanity-seo-checker-plugin
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
