import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: ['./app/**/*.vue'],
  theme: {
    extend: {}
  },
  plugins: []
}
