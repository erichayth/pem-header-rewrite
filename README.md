# PEM Header Rewrite

A Cloudflare Worker that adds PEM header and footer to client certificates for proper certificate forwarding.

## Overview

This worker intercepts requests with the Cloudflare client certificate header (`cf-client-cert-der-base64`) and creates a new header (`SSL_CLIENT_CERT`) containing the same certificate but properly formatted as a PEM certificate with appropriate headers and footers.

## Features

- Reformats DER base64 encoded certificates to proper PEM format
- Adds the standard `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` delimiters
- Properly formats certificate content with 64-character line length
- URL encodes the resulting PEM certificate for HTTP header safety
- Preserves all other request headers and content

## Use Cases

- Enables applications expecting standard PEM formatted certificates to work with Cloudflare's certificate forwarding
- Bridges compatibility between Cloudflare's certificate implementation and backend applications expecting standard formats
- Simplifies certificate handling in backend applications without requiring custom code

## Setup

1. Deploy this worker to your Cloudflare account
2. Create a route pattern that matches the traffic you want to process
3. Associate this worker with the route

## Configuration

By default, the worker:
- Reads from header: `cf-client-cert-der-base64`
- Writes to header: `SSL_CLIENT_CERT`

You can modify the header names in the worker code if needed.

## Error Handling

The worker is designed to fail safely - if any errors occur during processing, the original request is forwarded unchanged to prevent disruption to your application.

## License

See the [LICENSE](LICENSE) file for details.