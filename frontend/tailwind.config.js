/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf6e9',
          100: '#fce7c3',
          200: '#fad89d',
          300: '#f8c976',
          400: '#f6ba50',
          500: '#f4ab2a', // color principal
          600: '#e2940e',
          700: '#bc790b',
          800: '#965f09',
          900: '#704707',
        },
        secondary: {
          50: '#e8f1fe',
          100: '#c5dbfc',
          200: '#a1c5fa',
          300: '#7eaff8',
          400: '#5a99f6',
          500: '#3784f4', // color secundario
          600: '#1d6be0',
          700: '#1858b9',
          800: '#134593',
          900: '#0e336d',
        },
        accent: {
          50: '#f2fbf4',
          100: '#d9f3de',
          200: '#bfebc7',
          300: '#a6e2b1',
          400: '#8cda9a',
          500: '#73d284',
          600: '#52c168',
          700: '#3da152',
          800: '#30803f',
          900: '#22602f',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'menu': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 10px 30px rgba(244, 171, 42, 0.1)',
      },
    },
  },
  plugins: [],
}