// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}", // adjust for your structure
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
}
