/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      bgColor: "var(--color-bg)",
      primary: "var(--color-primary) ",
      text: " var(--color-secondary)",
      texv: "var( --color-bgg)",
      form: "var(--color-form)",
      gray: "var(--color-gray)",
      abstract:"var(--color-abstract)",
       ascent: "var(--color-ascent1)",
       lightgrey: "var(--color-lightgrey)",
       purple: "var(--bg-purple)",
       yellow: "var(--bg-yellow)",
       green: "var(--bg-green)",
       sidebar: "var(--color-sidebar)",
 
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIni: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        "fade-ini": "fadeIni 1s ease-out",

        "scale-up": "scaleUp 0.8s ease-out",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

