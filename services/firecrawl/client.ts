import FirecrawlApp from '@mendable/firecrawl-js';

let _firecrawl: FirecrawlApp | null = null;

export function getFirecrawl(): FirecrawlApp {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not set');
  }
  if (_firecrawl) return _firecrawl;
  _firecrawl = new FirecrawlApp({ apiKey });
  return _firecrawl;
}