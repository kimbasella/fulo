/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
    purge: ['./*.html', './*.js'],
    theme: {
        extend: {
            colors: {
                'primary': 'var(--primary-color)',
                'accent': 'var(--accent-color)',
                'accent-dark': 'var(--accent-color-dark)',
                'text-base': 'var(--text-base-color)',
                'text-muted': 'var(--text-muted-color)',
                'text-on-accent': 'var(--text-on-accent-color)',
                'bg-light-gray': 'var(--bg-light-gray-color)',
            },
        },
    },
    plugins: [],
} 