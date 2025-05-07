/**
 * Cloudflare Worker that simply adds an SSL_CLIENT_CERT header with the
 * URL-encoded PEM certificate from the cf-client-cert-der-base64 header
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // Get the original certificate from the Cloudflare header
    const originalCert = request.headers.get('cf-client-cert-der-base64')
    
    if (originalCert && originalCert.length > 0) {
      // Format the certificate with PEM header and footer
      const pemFormatted = formatAsPEM(originalCert)
      
      // URL encode the certificate to make it safe for HTTP headers
      const encodedCert = encodeURIComponent(pemFormatted)
      
      // Clone the request
      const newRequest = new Request(request)
      
      // Add the URL-encoded PEM certificate header
      newRequest.headers.set('SSL_CLIENT_CERT', encodedCert)
      
      // Send the request with the added header
      return fetch(newRequest)
    }
    
    // If no certificate, pass through unchanged
    return fetch(request)
  } catch (error) {
    // Pass through the request even on error
    return fetch(request)
  }
}

function formatAsPEM(certContent) {
  if (!certContent) return ''
  
  // Clean any existing PEM formatting
  let cleanCert = certContent.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|[\r\n]/g, '')
  
  // Format with proper PEM header and footer
  let formattedCert = '-----BEGIN CERTIFICATE-----\n'
  
  // Add line breaks every 64 characters
  for (let i = 0; i < cleanCert.length; i += 64) {
    formattedCert += cleanCert.substring(i, i + 64) + '\n'
  }
  
  formattedCert += '-----END CERTIFICATE-----'
  
  return formattedCert
}
