import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Redstone Light Palette
                redstone: {
                    50: '#FFF1F2',
                    100: '#FFE4E6',
                    200: '#FECDD3',
                    300: '#FDA4AF',
                    400: '#FB7185',
                    500: '#F43F5E',
                    600: '#E11D48', // Primary Brand Color
                    700: '#BE123C',
                    800: '#9F1239',
                    900: '#881337',
                    950: '#4C0519',
                },
                dark: {
                    50: '#FDFBF7',  // Warmer white
                    100: '#F8FAFC', // Slate 50
                    200: '#F1F5F9', // Slate 100
                    300: '#E2E8F0', // Slate 200
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Slate 900 (Main Text)
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Google Sans Display', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '32px',
                '5xl': '48px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
        },
    },
    plugins: [],
}
export default config
