import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                main: "#514AF3",
                // secondBlack: "#0F0F0F",
                mainHover: "#706aff",
                confirm: "#16C784",
                cancel: "#ED2B2BE5",
                chat: "rgba(255, 255, 255, 0.50)",
                tips: "rgba(255, 255, 255, 0.75)",
            },
            boxShadow: {
                input: "0 1px 10px 0px #514AF3",
                searchBar: "0px 1px 10px 0px rgba(81, 74, 243, 0.50)",
                chat: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
                tips: "0px 0.404px 3.234px 0px rgba(81, 74, 243, 0.25)",
            },
            fontFamily: {
                dmSans: ["DM Sans"],
            },
            fontSize: {
                xxl: "32px",
            },
            borderRadius: {
                chat: "10px",
                tips: "16.172px",
            },
        },
    },
    plugins: [],
};
export default config;
