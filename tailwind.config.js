/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ['Dancing Script', 'cursive'],
        lobster: ['Lobster', 'cursive'],
        pacifico: ['Pacifico', 'cursive'],
        caveat: ['Caveat', 'cursive'],
        amatic: ['Amatic SC', 'cursive'],
        comfortaa: ['Comfortaa', 'cursive'],
  },
      keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-4px)' },
      },
      fadeUp: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      
    },
    animation: {
      float: 'float 3s ease-in-out infinite',
      fadeUp: 'fadeUp 0.8s ease forwards',
    },
    
   
  },
  },
  plugins: [],
}