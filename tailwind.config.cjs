/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/*.jsx',
    './src/components/**/*.jsx',
    './src/pages/*.jsx',
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: 'width',
        'position-left': 'left',
      },
    },
  },
  plugins: [],
};
