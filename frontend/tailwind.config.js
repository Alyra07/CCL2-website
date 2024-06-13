module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D9CDB',   
        secondary: '#56CCF2', 
        accent: '#EB5757',    
        background: '#F2F2F2', 
        text: '#333333',      
        'light-gray': '#F5F5F5', 
        'dark-gray': '#4F4F4F', 
      },
    },
  },
  plugins: [],
}