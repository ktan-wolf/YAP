import daisyui from 'daisyui'
import * as daisyUIThemes  from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes['black'],
          primary: "rgb(29,155,240)",
          secondary: "rgb(24,24,24)",
        },
      },
    ],
  },
}

