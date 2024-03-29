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
      },
      gridRow: {
        'span-10': 'span 10 / span 10',
      },
      colors: {
        'bg-orange': '#F95131AB',
        'txt-grey' : '#3F3F3F',
        'txt-mdg-username' : '#AAAAAA'
      },
    },
    plugins: [],
  }
}
