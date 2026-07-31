/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#ea044e', // Estilo rojo PedidosYa
          dark: '#c7023f',
          light: '#fff0f4',
          accent: '#ff2d60'
        },
        kds: {
          pending: '#eab308',
          prep: '#3b82f6',
          ready: '#22c55e',
          delivered: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 8px 30px rgba(234, 4, 78, 0.35)',
        'glow-green': '0 8px 30px rgba(34, 197, 94, 0.35)',
        'bottom-bar': '0 -4px 25px rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease infinite alternate'
      },
      keyframes: {
        bounceSubtle: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
