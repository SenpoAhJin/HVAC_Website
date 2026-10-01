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
      
      if (!siteUrl) {
        throw new Error(
          '\n❌ ERROR: VITE_SITE_URL environment variable is not set!\n\n' +
          'Set it before building:\n' +
          '  export VITE_SITE_URL=https://yourdomain.com   (Mac/Linux)\n' +
          '  set VITE_SITE_URL=https://yourdomain.com      (Windows CMD)\n' +
          '  $env:VITE_SITE_URL="https://yourdomain.com"   (Windows PowerShell)\n\n' +
          'Or add it to .env.production:\n' +
          '  VITE_SITE_URL=https://yourdomain.com\n'
        );
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
      return html.replace(/__SITE_URL__/g, siteUrl);
    },
    
    // Also process public files (robots.txt, sitemap.xml)
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type === 'asset' && typeof file.source === 'string') {
          if (fileName === 'robots.txt' || fileName === 'sitemap.xml') {
            file.source = file.source.replace(/__SITE_URL__/g, siteUrl);
          }
        }
      }
    }
  };
}
