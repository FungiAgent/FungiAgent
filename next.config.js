/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ARBITRUM_API_KEY: process.env.ARBITRUM_API_KEY,
        OPTIMISM_API_KEY: process.env.OPTIMISM_API_KEY,
        POLYGON_API_KEY: process.env.POLYGON_API_KEY,
        TAVILY_API_KEY: process.env.TAVILY_API_KEY,
        NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID:
            process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID,
        MAGIC_API_KEY: process.env.MAGIC_API_KEY,
    },
    images: {
        domains: [
            "static.alchemyapi.io",
            "raw.githubusercontent.com",
            "static.debank.com",
        ],
    },
};

module.exports = nextConfig;
