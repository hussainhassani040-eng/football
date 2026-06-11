module.exports = {
  content: ['./app/**/*.{vue,js,ts}', './components/**/*.{vue,js,ts}', './styles/**/*.{css}'],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#111827',
        accent: '#F59E0B',
        background: '#F8FAFC',
        text: '#111827',
        muted: '#6B7280'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(22, 163, 74, 0.16)'
      }
    }
  },
  plugins: []
}
