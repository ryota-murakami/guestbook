export async function GET() {
  return new Response(
    `User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  )
}
