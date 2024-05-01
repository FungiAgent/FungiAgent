/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ARBITRUM_API_KEY: process.env.ARBITRUM_API_KEY,
    OPTIMISM_API_KEY: process.env.OPTIMISM_API_KEY,
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  },
  images: {
    domains: ['static.debank.com', 'static.alchemyapi.io', 'raw.githubusercontent.com'],
  },
}

module.exports = nextConfig;