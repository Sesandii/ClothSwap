
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf3f2',
          100: '#fbe5e3',
          200: '#f7cfcb',
          300: '#f1afa9',
          400: '#e8786f', // Main primary (Rose/Coral)
          500: '#e05c51',
          600: '#cc4237',
          700: '#aa352b',
          800: '#8d2f27',
          900: '#752b24',
        },
        secondary: {
          50: '#f4f7f4',
          100: '#e4ece4',
          200: '#cbdacb',
          300: '#a6c0a6',
          400: '#7da17d', // Main secondary (Sage Green)
          500: '#5e855e',
          600: '#486948',
          700: '#3b543b',
          800: '#314431',
          900: '#293929',
        },
        warmGray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
