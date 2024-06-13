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
            },
            boxShadow: {
                input: "0 1px 10px 0px #514AF3",
                searchBar: "0px 1px 10px 0px rgba(81, 74, 243, 0.50)",
            },
            fontFamily: {
                dmSans: ["DM Sans"],
            },
            fontSize: {
                xxl: "32px",
            },
        },
    },
    plugins: [],
};
export default config;
