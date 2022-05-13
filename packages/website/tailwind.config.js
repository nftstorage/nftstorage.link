module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './components/**/*.stories.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'open-sans': ['Open Sans', 'sans-serif'],
      goldman: ['Goldman', 'sans-serif'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      base: ['1rem', 1.6],
      lg: ['1.125rem', 1.9],
      xl: ['1.25rem', 1.8],
      '2xl': ['1.5rem', 1.35],
      '3xl': ['1.875rem', 1.25],
      '4xl': ['2.25rem', 1.2],
      '5xl': ['3rem', 1.15],
      '6xl': ['4rem', 1.1],
      '7xl': '5rem',
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7f7f7',
        200: '#d8dad9',
        300: '#bbbbbb',
        400: '#d8dad9',
        500: '#7d8492',
        600: '#888888',
        700: '#666666',
        800: '#3b4151',
      },
      ltblue: '#eef7f6',
      blue: '#47aed7',
      forest: '#0a854c',
      green: '#d3e7dc',
      navy: '#336bad',
      orange: '#ee4116',
      orangred: '#d53810',
      peach: '#ffe1c5',
      pink: '#f7cdcf',
      red: '#e11e2e',
      ltred: '#feebeb',
      yellow: '#e2ba36',
    },
    extend: {
      rotate: {
        30: '30deg',
      },
      screens: {
        '2xl': '1800px',
        // => @media (min-width: 992px) { ... }
      },
    },
  },
}
