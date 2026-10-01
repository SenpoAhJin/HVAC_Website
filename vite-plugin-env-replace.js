/**
 * Vite plugin to replace __SITE_URL__ placeholder in built files with environment variable
 */
export default function envReplacePlugin() {
  let siteUrl;
  
  return {
    name: 'env-replace-plugin',
    
    configResolved(config) {
      // Read from config.env which includes values from .env files
      siteUrl = config.env.VITE_SITE_URL;
      const isDev = config.mode === 'development';
      
      // In development mode, default to localhost if not set
      if (!siteUrl && isDev) {
        siteUrl = 'http://localhost:5173';
        console.log('ℹ️  Using default dev URL: http://localhost:5173');
        return;
      }
      
      // In production, allow empty/unset for template mode
      if (!siteUrl) {
        console.log('ℹ️  VITE_SITE_URL not set - building in template mode (no URL replacement)');
        siteUrl = ''; // Set to empty string so transformations don't fail
        return;
      }
      
      // Allow localhost in development mode, require HTTPS in production
      const urlLower = siteUrl.toLowerCase();
      
      if (!isDev && !urlLower.startsWith('https://') && !urlLower.startsWith('http://localhost')) {
        throw new Error(
          '\n❌ ERROR: VITE_SITE_URL must start with https://\n\n' +
          `Current value: ${siteUrl}\n\n` +
          'Production sites must use HTTPS for security.\n' +
          'Example: https://example.com\n'
        );
      }
      
      // Check for placeholder/test domains (but allow localhost in dev)
      const invalidDomains = ['yourdomain', 'example.com'];
      if (!isDev) {
        invalidDomains.push('localhost');
      }
      const hasInvalidDomain = invalidDomains.some(domain => urlLower.includes(domain));
      
      if (hasInvalidDomain) {
        throw new Error(
          '\n❌ ERROR: VITE_SITE_URL contains a placeholder or test domain!\n\n' +
          `Current value: ${siteUrl}\n\n` +
          'Invalid domains: ' + invalidDomains.join(', ') + '\n\n' +
          'Please set your actual production domain:\n' +
          '  VITE_SITE_URL=https://your-actual-domain.com\n'
        );
      }
    },
    
    transformIndexHtml(html) {
      // Only replace if siteUrl is set
      if (siteUrl) {
        return html.replace(/__SITE_URL__/g, siteUrl);
      }
      return html;
    },
    
    // Also process public files (robots.txt, sitemap.xml)
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type === 'asset' && typeof file.source === 'string') {
          if (fileName === 'robots.txt' || fileName === 'sitemap.xml') {
            // Only replace if siteUrl is set
            if (siteUrl) {
              file.source = file.source.replace(/__SITE_URL__/g, siteUrl);
            }
          }
        }
      }
    }
  };
}
