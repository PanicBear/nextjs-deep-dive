module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: 'media',
  plugins: [require('@tailwindcss/forms')],
};
