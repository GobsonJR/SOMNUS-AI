/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ddecfa",
        surface: "#eaf3fb",
        ink: "#0d1e38",
        "muted-ink": "#3b587d",
        line: "#b9d2eb",
        brand: "#2c4e7b",
        "brand-dark": "#1a3356",
        celestial: {
          50: "#f6fafe",
          100: "#eaf3fb",
          200: "#ddecfa",
          300: "#b9d2eb",
          400: "#86b3dc",
          500: "#508ec5",
          600: "#2c4e7b",
          700: "#1a3356",
          800: "#11223b",
          900: "#091424",
        },
      },
      borderRadius: {
        small: "6px",
        medium: "12px",
        large: "20px",
        pill: "9999px",
      },
      fontFamily: {
        ciberus: ['"CiberusDemo"', '"Ciberus"', "sans-serif"],
        jeanoti: ['"JeanotiRegular"', '"Jeanoti"', "sans-serif"],
        stenz: ['"StenzGraxon"', "sans-serif"],
        nineties: ['"BehindTheNineties"', "sans-serif"],
        sans: ['"StenzGraxon"', "system-ui", "sans-serif"],
        serif: ['"CiberusDemo"', '"Ciberus"', "Georgia", "serif"],
        mono: ['"BehindTheNineties"', "monospace"],
      },
      letterSpacing: {
        widest: ".18em",
        extrawide: ".25em",
      },
    },
  },
  plugins: [],
};
