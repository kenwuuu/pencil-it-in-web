/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./events.html",
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("daisyui"),
        require("@tailwindcss/typography"),
    ],
    daisyui: {
        themes: [
            "light",
            "dark",
            "cupcake"
        ],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
    },
}