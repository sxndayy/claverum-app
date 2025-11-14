/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML Export - KRITISCH für Static Site!
  trailingSlash: true,  // URLs MIT / am Ende (konsistent mit City Pages)
  images: {
    unoptimized: true,  // Nötig für Static Export
  },
  // Optional: Base path falls nicht auf Root-Domain
  // basePath: '',
}

module.exports = nextConfig

