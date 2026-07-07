/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
          // === PRIMARY COLORS ===
        'primary-100': '#5E548E',
        'primary-80': '#7E76A5',
        'primary-60': '#9E98BB',
        'primary-40': '#BFBBD2',
        'primary-20': '#DFDDE8',

        // === SECONDARY COLORS ===
        'secondary-100': '#9F7A6C',
        'secondary-80': '#B29589',
        'secondary-60': '#C5AFA7',
        'secondary-40': '#D9CAC4',
        'secondary-20': '#ECE4E2',

        // === BASE COLORS ===
        'black-100': '#111111',
        'black-80': '#707070',
        'black-60': '#A0A0A0',
        'black-40': '#CFCFCF',
        'black-20': '#F3F3F3',
        'white': '#FFFFFF',

        // === SUCCESS COLORS ===
        'success-100': '#3F845F',
        'success-80': '#659D7F',
        'success-60': '#8CB59F',
        'success-40': '#B2CEBF',
        'success-20': '#D9E6DF',

        // === WARNING COLORS ===
        'warning-100': '#E4C65B',
        'warning-80': '#E9D17C',
        'warning-60': '#EFDD9D',
        'warning-40': '#F4E8BD',
        'warning-20': '#FAF4DE',

        // === ERROR COLORS ===
        'error-100': '#B51F17',
        'error-80': '#C44C45',
        'error-60': '#D37974',
        'error-40': '#E1A5A2',
        'error-20': '#F0D2D1',

        // === INFO COLORS ===
        'info-100': '#2685CA',
        'info-80': '#519DD5',
        'info-60': '#7DB6DF',
        'info-40': '#A8CEEA',
        'info-20': '#D4E7F4',

        'accent-80': '#659d7f',
        'text-light': 'white',
        'text-dark': '#555555',     
      },
       fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
       fontSize: {
        // Heading 
        'heading-1': ['40px', { lineHeight: '110%', fontWeight: '600' }], 
        'heading-2': ['36px', { lineHeight: '100%', fontWeight: '500' }], 
        'heading-3': ['32px', { lineHeight: '100%',  fontWeight: '500' }], 
        'heading-4': ['28px', { lineHeight: '135%', fontWeight: '500' }], 
        'heading-5': ['24px', { lineHeight: '145%', fontWeight: '500' }], 
        
        // Body 
        'body-xl-medium': ['22px', { lineHeight: '130%',  fontWeight: '600' }], // Double Extra Large Text Medium
        'body-xl-regular': ['22px', { lineHeight: '130%',  fontWeight: '400' }], // Double Extra Large Text Regular
        
        'body-lg-medium': ['20px', { lineHeight: '145%', fontWeight: '600' }], // Extra Large Text Medium
        'body-lg-regular': ['20px', { lineHeight: '145%',  fontWeight: '400' }], // Extra Large Text Regular
        
        'body-md-medium': ['18px', { lineHeight: '140%',  fontWeight: '600' }], // Large Text Medium
        'body-md-regular': ['18px', { lineHeight: '140%',  fontWeight: '400' }], // Large Text Regular
        
        'body-sm-medium': ['16px', { lineHeight: '145%',  fontWeight: '600' }], // Medium Text Medium
        'body-sm-regular': ['16px', { lineHeight: '145%',  fontWeight: '400' }], // Medium Text Regular
        
        'body-xs-medium': ['14px', { lineHeight: '150%',  fontWeight: '600' }], // Small Text Medium
        'body-xs-regular': ['14px', { lineHeight: '150%',  fontWeight: '400' }], // Small Text Regular
        
        'body-xxs-medium': ['12px', { lineHeight: '160%',  fontWeight: '600' }], // Extra Small Text Medium
        'body-xxs-regular': ['12px', { lineHeight: '160%',  fontWeight: '400' }], // Extra Small Text Regular
      },
    },
  },
  plugins: [],
};
