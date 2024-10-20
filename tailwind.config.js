/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./public/**/*.{html,js,ts,jsx,tsx}",
  ],
  // Add color classes to safe list so they are always generated
  safelist: [],
  // presets: [],
  theme: {
    screens: {
      // see stanadard breakpoints at https://tailwindcss.com/docs/responsive-design
      // sm: `600px`,
      // md: `900px`,
      // lg: `1200px`
    },
    fontSize: {
      xs: "var(--step--2)",
      sm: "var(--step--1)",
      base: "var(--step-0)",
      lg: "var(--step-1)",
      xl: "var(--step-2)",
      "2xl": "var(--step-3)",
      "3xl": "var(--step-4)",
      "4xl": "var(--step-5)",
    },
    extend: {
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        s: "var(--space-s)",
        m: "var(--space-m)",
        l: "var(--space-l)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "3xs-2xs": "var(--space-3xs-2xs)",
        "2xs-xs": "var(--space-2xs-xs)",
        "xs-s": "var(--space-xs-s)",
        "s-m": "var(--space-s-m)",
        "m-l": "var(--space-m-l)",
        "l-xl": "var(--space-l-xl)",
        "xl-2xl": "var(--space-xl-2xl)",
        "2xl-3xl": "var(--space-2xl-3xl)",
        "s-l": "var(--space-s-l)",
      },
      flexGrow: {
        2: '2',
        3: '3',
        999: '999',
      },
    },
  },

  // Disables Tailwind's reset and usage of rgb/opacity
  corePlugins: {
    preflight: false,
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false
  },

  // Prevents Tailwind's core components
  blocklist: ['container'],

  // Prevents Tailwind from generating that wall of empty custom properties 
  experimental: {
    optimizeUniversalDefaults: true
  },

  plugins: [],
}
