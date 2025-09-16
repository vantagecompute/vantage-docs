# Algolia DocSearch Implementation Guide

## Current Status: ⚠️ SEARCH TEMPORARILY DISABLED

The Algolia DocSearch configuration has been temporarily disabled to prevent the "Index YOUR_INDEX_NAME does not exist" error. The search functionality is ready to be enabled once you have a valid Algolia index.

## Error Resolution

**Problem**: `ApiError: Index YOUR_INDEX_NAME does not exist`

**Solution**: The search configuration is commented out in `docusaurus.config.js` until you have a proper Algolia index set up.

## Configuration Details

- **App ID**: `MPYYYNENH9`
- **API Key**: `4eea2544feea2cf558be1ce57ff44db4`
- **Index Name**: `NEEDS TO BE OBTAINED` (⚠️ **REQUIRED**: Get actual index name)

## Next Steps (Choose One)

### Option 1: Apply for Free DocSearch (Recommended)

1. **Apply for DocSearch**: <https://docsearch.algolia.com/apply/>
   - Free for open source and non-commercial documentation
   - Algolia will crawl your site and provide the index name
   - Takes 1-2 weeks for approval

2. **Once approved**:
   - You'll receive an index name from Algolia
   - Uncomment the search configuration in `docusaurus.config.js`
   - Replace the index name with the one provided by Algolia

### Option 2: Create Your Own Algolia Index

1. **Sign up for Algolia**: <https://dashboard.algolia.com/>
2. **Create an index** for your documentation
3. **Set up crawling** using Algolia Crawler or manual indexing
4. **Update configuration** with your index name

### Option 3: Use Alternative Search

If you prefer a different search solution:

1. **Local Search**: Re-add `@easyops-cn/docusaurus-search-local`
2. **Other providers**: Swiftype, Elasticsearch, etc.

## How to Enable Search (When Ready)

1. **Uncomment the Algolia configuration** in `docusaurus.config.js`:

```javascript
// Remove the /* and */ comments around the algolia configuration
algolia: {
  appId: 'MPYYYNENH9',
  apiKey: '4eea2544feea2cf558be1ce57ff44db4',
  indexName: 'your-actual-index-name', // Replace with real index name
  contextualSearch: true,
  replaceSearchResultPathname: {
    from: '/docs/',
    to: '/',
  },
  searchParameters: {},
  searchPagePath: 'search',
},
```

2. **Test the search functionality**

```javascript
algolia: {
  appId: 'MPYYYNENH9',
  apiKey: '4eea2544feea2cf558be1ce57ff44db4',
  indexName: 'your-actual-index-name', // Replace this
  // ... rest of config
}
```

### 3. Test Search Functionality

- Search button appears in the navbar with Vantage purple theme
- Click or press `Cmd/Ctrl + K` to open search
- Styled to match your brand colors

### 4. Search will work once index is populated

The search interface is ready, but results will appear only after:

1. Your site is indexed by Algolia
2. The correct index name is configured

## Custom Search Implementation (Alternative)

If you prefer a custom implementation instead of the built-in Docusaurus integration, use the file we created:

**`src/js/docsearch-custom.js`** - Standalone DocSearch implementation

This allows for more customization options and direct control over the search behavior.

## Performance Optimizations

✅ **Preconnect** - Added for faster initial search queries  
✅ **CSS Variables** - Easy theme customization  
✅ **Responsive Design** - Mobile-friendly search interface  
✅ **Dark Mode** - Automatic theme switching  

## Styling Customization

All DocSearch styling is in `src/css/custom.css` under the "DOCSEARCH STYLING" section. You can easily modify:

- Colors (currently Vantage purple theme)
- Fonts and sizing
- Hover effects
- Modal appearance
- Button styling

The implementation follows DocSearch v4 best practices and integrates seamlessly with your existing Vantage branding.
