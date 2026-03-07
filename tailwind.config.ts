import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.75',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        subtle: "hsl(var(--text-subtle))",
        elevated: "hsl(var(--surface-elevated))",
        banner: "hsl(var(--surface-banner))",
        "swiss-red": "hsl(var(--swiss-red))",
        "swiss-red-hover": "hsl(var(--swiss-red-hover))",
        "switz-red": "hsl(var(--swiss-red))",
        // Design System palettes
        stone: {
          50:  "var(--ds-stone-50)",
          100: "var(--ds-stone-100)",
          200: "var(--ds-stone-200)",
          300: "var(--ds-stone-300)",
          400: "var(--ds-stone-400)",
          500: "var(--ds-stone-500)",
          600: "var(--ds-stone-600)",
          700: "var(--ds-stone-700)",
          800: "var(--ds-stone-800)",
          900: "var(--ds-stone-900)",
        },
        glacier: {
          50:  "var(--ds-glacier-50)",
          100: "var(--ds-glacier-100)",
          200: "var(--ds-glacier-200)",
          300: "var(--ds-glacier-300)",
          400: "var(--ds-glacier-400)",
          500: "var(--ds-glacier-500)",
          600: "var(--ds-glacier-600)",
          700: "var(--ds-glacier-700)",
          800: "var(--ds-glacier-800)",
          900: "var(--ds-glacier-900)",
        },
        gold: {
          50:  "var(--ds-gold-50)",
          100: "var(--ds-gold-100)",
          200: "var(--ds-gold-200)",
          300: "var(--ds-gold-300)",
          400: "var(--ds-gold-400)",
          500: "var(--ds-gold-500)",
          600: "var(--ds-gold-600)",
          700: "var(--ds-gold-700)",
          800: "var(--ds-gold-800)",
          900: "var(--ds-gold-900)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "ds-sm":  "var(--ds-shadow-sm)",
        "ds-md":  "var(--ds-shadow-md)",
        "ds-lg":  "var(--ds-shadow-lg)",
        "ds-xl":  "var(--ds-shadow-xl)",
        "ds-glow": "var(--ds-shadow-glow)",
      },
      transitionTimingFunction: {
        "swiss-luxury": "cubic-bezier(0.23, 1, 0.32, 1)",
        "ds-ease":   "var(--ds-ease)",
        "ds-spring": "var(--ds-spring)",
      },
      transitionDuration: {
        "ds-fast":   "var(--ds-duration-fast)",
        "ds-normal": "var(--ds-duration-normal)",
        "ds-slow":   "var(--ds-duration-slow)",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
