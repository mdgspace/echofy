/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}',
            './components/**/*.{js,ts,jsx,tsx,mdx}',
],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-21': 'span 21 / span 21',
        'span-24': 'span 24 / span 24',
        'span-23': 'span 23 / span 23',
        'span-18': 'span 18 / span 18',
        'span-17': 'span 17 / span 17'
      },
      gridRow: {
        'span-10': 'span 10 / span 10',
      },
      colors: {
        'bg-gray': '#B3B3B3',
        'white-primary': "#FBFCFE",
        'light-grey' : "#F8F8F8" ,
        'txt-gray' : '#5E5E5E',
        'gray-secondary': "#49454F",
        'txt-mdg-username' : '#8A8A8A',
        'customBlue' : '#3670F5',
        'semiblack' : "#414042"
      },
      fontFamily:{
        'Lato': ['"Lato"', 'sans-serif'],
        'Roboto': ['"Roboto"', 'sans-serif'],
      }
    },
    plugins: [],

  }
}

