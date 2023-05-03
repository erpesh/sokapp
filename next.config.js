/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ['en', 'uk', 'ru'],
    defaultLocale: 'en',
    localeDetection: true
  },
}

module.exports = nextConfig
