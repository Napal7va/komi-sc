/** @type {import('tailwindcss').Config} */
tailwind.config ={
  content: [
    './src/**/*.{html,js}',
    './*.{html,js}', // Добавлено для захвата файлов в корне проекта
  ],
  theme: {
    extend: {
      backgroundImage: {
        'btn-next': "url('/images/next.svg')",
        'bg-main': "url('/images/BG_Mike (2).jpg')",
        'ornament-left': "url('/images/ornam.svg')",
        'ornament-top': "url('/images/ornam-top.svg')"
      },
    },
  },
  plugins: [],
}
