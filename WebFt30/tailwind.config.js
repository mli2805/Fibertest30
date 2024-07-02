/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'bounce-higlight': {
          '0%, 100%': {
            transform: 'translateY(-1rem)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
          }
        },
        'pulse-2': {
          '50%': {
            opacity: '.3'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 500ms ease-in-out',
        'bounce-higlight': 'bounce-higlight 0.5s 1.5',
        'pulse-2': 'pulse-2 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      colors: {
        'rtu-text': 'black',
        'rtu-dark-text': 'white', //#D0D1D3',
        'rtu-primary-bg': '#F9F9F9',
        'rtu-second-bg': '#F1F1F1',
        'rtu-dark-primary-bg': '#212224',
        'rtu-dark-second-bg': '#313336' // combobox, extra button, switch
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
      minHeight: {
        9: '2.25rem',
        16: '4rem',
        32: '8rem'
      },
      minWidth: {
        36: '9rem',
        40: '10rem',
        96: '24rem',
        144: '36rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
