/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // The Lattice palette — near-black voids and signal-cyan glow.
        void: {
          900: '#05060a',
          800: '#0a0c14',
          700: '#11141f',
          600: '#1a1f2e',
        },
        signal: '#5ef2ff',
        lattice: '#8b7bff',
        warn: '#ff5e7a',
      },
      fontFamily: {
        // Monospace = "this is a transmission from a machine"
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Heebo"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'drift': 'drift 7s ease-in-out infinite',
        'flicker': 'flicker 2.4s steps(3, end) infinite',
        'scanline': 'scanline 6s linear infinite',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.06)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(3px, -4px)' },
          '66%': { transform: 'translate(-4px, 3px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '40%': { opacity: '0.4' },
          '42%': { opacity: '0.85' },
          '60%': { opacity: '0.55' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
