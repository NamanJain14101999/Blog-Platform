export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                pulseBtn: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.08)' },
                },
            },
            animation: { 'pulse-btn': 'pulseBtn 2s infinite' },
        },
    },
    plugins: [],
};
  