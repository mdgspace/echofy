/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',],
    theme: {
      extend:{
        colors: {
          'bg-orange': '#F95131AB',
          'txt-grey' : '#3F3F3F',
          'txt-mdg-username' : '#AAAAAA'
        }
      },

      plugins: [],
    }
}
