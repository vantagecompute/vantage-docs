import docsearch from '@docsearch/js';
import '@docsearch/css';

// Initialize DocSearch with your credentials
docsearch({
  container: '#docsearch',
  appId: 'MPYYYNENH9',
  apiKey: '4eea2544feea2cf558be1ce57ff44db4',
  indexName: 'Vantage Compute Documentation Website Crawler',
  
  // Optional: Additional configuration options
  searchParameters: {
    // Filter results if needed
    // facetFilters: ['language:en', 'version:latest']
  },
  
  // Optional: Transform search results
  transformItems: (items) => {
    return items.map((item) => {
      // Custom transformation logic if needed
      return item;
    });
  },
  
  // Optional: Custom placeholder text
  placeholder: 'Search docs...',
  
  // Optional: Customize the search behavior
  debug: false, // Set to true for debugging
  
  // Optional: Additional styling or behavior
  maxResultsPerGroup: 10,
  
  // Optional: Custom search insights for analytics
  insights: true,
});