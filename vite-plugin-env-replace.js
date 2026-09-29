/**
 * Vite plugin to replace __SITE_URL__ placeholder in built files with environment variable
 */
export default function envReplacePlugin() {
  let siteUrl;
  
  return {
    name: 'env-replace-plugin',
    
    configResolved() {
      siteUrl = process.env.VITE_SITE_URL;
      
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
