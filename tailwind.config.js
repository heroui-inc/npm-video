import {heroui} from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.45,
        fontSize: {
          tiny: "0.75rem", // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "8px",
          medium: "12px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#FFFFFF",
            },
            content1: {
              DEFAULT: "#FAFAFA",
              foreground: "#0A0A0C",
            },
            content2: {
              DEFAULT: "#F5F5F5",
              foreground: "#0A0A0C",
            },
            content3: {
              DEFAULT: "#EBEBEB",
              foreground: "#0A0A0C",
            },
            content4: {
              DEFAULT: "#E0E0E0",
              foreground: "#0A0A0C",
            },
            divider: {
              DEFAULT: "rgba(0, 0, 0, 0.1)",
            },
            focus: {
              DEFAULT: "#5B3FDB",
            },
            foreground: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              DEFAULT: "#0A0A0C",
            },
            overlay: {
              DEFAULT: "#FFFFFF",
            },
            primary: {
              50: "#FFFFFF",
              100: "#FAFAFA",
              200: "#F5F5F5",
              300: "#E0E0E0",
              400: "#A6A6A6",
              500: "#0A0A0C",
              600: "#080808",
              700: "#050505",
              800: "#030303",
              900: "#000000",
              DEFAULT: "#0A0A0C",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: {
              DEFAULT: "#0A0A0C",
            },
            content1: {
              DEFAULT: "#16161A",
              foreground: "#EDEDEF",
            },
            content2: {
              DEFAULT: "#1E1E24",
              foreground: "#EDEDEF",
            },
            content3: {
              DEFAULT: "#26262E",
              foreground: "#EDEDEF",
            },
            content4: {
              DEFAULT: "#2E2E38",
              foreground: "#EDEDEF",
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.1)",
            },
            focus: {
              DEFAULT: "#7C5CFF",
            },
            foreground: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              DEFAULT: "#EDEDEF",
            },
            overlay: {
              DEFAULT: "#000000",
            },
            primary: {
              50: "#1A1A1A",
              100: "#262626",
              200: "#333333",
              300: "#404040",
              400: "#595959",
              500: "#F5F5F5",
              600: "#FAFAFA",
              700: "#FFFFFF",
              800: "#FFFFFF",
              900: "#FFFFFF",
              DEFAULT: "#F5F5F5",
              foreground: "#0A0A0C",
            },
          },
        },
      },
    }),
  ],
};
