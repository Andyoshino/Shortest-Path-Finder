module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                zoom: {
                    '0%': {
                        transform: 'scale(1, 1)'
                    },
                    '25%': {
                        transform: 'scale(1.1, 1.1)'
                    },
                    '50%': {
                        transform: 'scale(1.2, 1.2)'
                    },
                    '75%': {
                        transform: 'scale(1.1, 1.1)'
                    },
                    '100%': {
                        transform: 'scale(1, 1)'
                    }
                },
                rotate: {
                    '0%, 100%': {
                        transform: 'rotate(3deg)'
                    },
                    '50%': {
                        transform: 'rotate(-3deg)'
                    }
                },
                pulse: {
                    '0%, 100%': {
                        opacity: 1
                    },
                    '50%': {
                        opacity: .75
                    }
                }
            },
            animation: {
                'quick-zoom': 'zoom 0.4s ease-in-out',
                'wiggle': 'rotate 1s ease-in-out infinite',
                'path': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }
        },
    },
    plugins: [],
}
