/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Accent classes are composed at runtime (`text-${c}`), which the scanner
  // cannot see. Without this they are purged and the stat colours vanish.
  safelist: ['text-violet', 'text-mint', 'text-amber', 'text-sky', 'text-rose',
             'bg-violet', 'bg-mint', 'bg-amber', 'bg-sky', 'bg-rose'],
  theme: {
    extend: {
      colors: {
        bg:     '#090A0F',
        card:   '#13151E',
        card2:  '#191C27',
        card3:  '#20242F',
        line:   'rgba(255,255,255,0.07)',

        txt:    '#F2F3F7',
        dim:    '#9BA1B4',
        faint:  '#646B80',

        // A working palette, not a single accent. Each colour means one thing
        // and keeps meaning it everywhere on the page.
        mint:   '#34D399',   // clean, passing, authorised
        violet: '#A78BFA',   // the intent layer
        amber:  '#FBBF24',   // the agent, the mandate
        rose:   '#FB7185',   // divergence, the breach
        sky:    '#38BDF8',   // data, measurement
      },
      fontFamily: {
        // Prose and headings are a text serif, because this page is READ.
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        serif:   ['"Source Serif 4"', 'Georgia', 'serif'],
        // Interface chrome stays sans: labels, chips, buttons.
        sans:    ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: '20px', inner: '14px' },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 40px -12px rgba(0,0,0,0.75)',
        pop:  '0 20px 60px -20px rgba(0,0,0,0.9)',
      },
      keyframes: {
        drift:  { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
                  '50%':     { transform: 'translate3d(3%,-4%,0) scale(1.1)' } },
        breathe:{ '0%,100%': { opacity: '.4' }, '50%': { opacity: '1' } },
        rise:   { from: { opacity: '0', transform: 'translateY(8px)' },
                  to:   { opacity: '1', transform: 'translateY(0)' } },
        sweep:  { from: { transform: 'translateX(-100%)' },
                  to:   { transform: 'translateX(300%)' } },
      },
      animation: {
        drift:  'drift 24s ease-in-out infinite',
        breathe:'breathe 2.8s ease-in-out infinite',
        rise:   'rise .45s cubic-bezier(.2,.7,.3,1) both',
        sweep:  'sweep 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
