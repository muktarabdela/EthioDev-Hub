/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F855A',
          dark: '#38A169',
        },
        secondary: {
          DEFAULT: '#DD6B20',
          dark: '#ED8936',
        },
        accent: {
          DEFAULT: '#3182CE',
          dark: '#4299E1',
        },
        muted: {
          DEFAULT: '#718096',
          dark: '#A0AEC0',
        },
      },
    },
  },
  plugins: [],
};
