/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML Export - KRITISCH für Static Site!
  trailingSlash: false,  // URLs OHNE / am Ende (SEO Best Practice)
  images: {
    unoptimized: true,  // Nötig für Static Export
  },
  // Optional: Base path falls nicht auf Root-Domain
  // basePath: '',
}

module.exports = nextConfig

