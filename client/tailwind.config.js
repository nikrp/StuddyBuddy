/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "pale-green": "#B7FFC3",
        "pale-turquoise": "#AFCEE",
        "dark": "#AFCEAA",
        "black": "#CFB997",
        "white": "#000000",
        "background": "#CFB997",
        "secondary-bg": "#A7C6DA",
        "foreground": "#034F35",
        "borders": "#1C7C54",
        "random": "#60463B",
      },
      width: {
        '49p': '49%',
      },
      boxShadow: {
        '3xl': '0px 5px 0px',
      }
    },
  },
  plugins: [],
}

