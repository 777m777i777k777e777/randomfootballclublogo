# Search-engine setup

The site is ready to be indexed, but publishing alone does not guarantee that Google will discover it immediately.

1. Connect the site's final domain to [Google Search Console](https://search.google.com/search-console/about).
2. Verify the domain and use **URL inspection** to request indexing of the home page.
3. Submit `https://randomfootballclublogo.com/sitemap.xml` under **Sitemaps**.
4. Inspect `https://randomfootballclublogo.com/`, run the live test, and request indexing.
5. Configure a permanent redirect from `https://randomfootballclublogo.pages.dev/` to the main `.com` domain in Cloudflare Bulk Redirects.

The canonical URL and sitemap are already configured for `https://randomfootballclublogo.com/`.
