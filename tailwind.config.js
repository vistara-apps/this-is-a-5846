/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 50%, 95%)',
        error: 'hsl(0, 70%, 50%)',
        accent: 'hsl(160, 90%, 45%)',
        primary: 'hsl(200, 80%, 40%)',
        success: 'hsl(120, 60%, 40%)',
        surface: 'hsl(220, 30%, 100%)',
        textPrimary: 'hsl(220, 70%, 20%)',
        textSecondary: 'hsl(220, 40%, 40%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 30%, 10%, 0.1)',
        'modal': '0 16px 40px hsla(220, 30%, 10%, 0.2)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      }
    },
  },
  plugins: [],
}