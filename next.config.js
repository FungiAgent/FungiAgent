/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ARBITRUM_API_KEY: process.env.ARBITRUM_API_KEY,
        BASE_API_KEY: process.env.BASE_API_KEY,
        OPTIMISM_API_KEY: process.env.OPTIMISM_API_KEY,
        POLYGON_API_KEY: process.env.POLYGON_API_KEY,
        TAVILY_API_KEY: process.env.TAVILY_API_KEY,
        NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID_BASE:
            process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID_BASE,
        MAGIC_API_KEY: process.env.MAGIC_API_KEY,
        THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
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
