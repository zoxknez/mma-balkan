import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic Dark Theme
        background: "#0f0f0f",
        foreground: "#ffffff",
        
        // Neon Colors
        neon: {
          lime: "#00ff88",
          teal: "#00ccff",
          purple: "#8B5CF6",
          pink: "#EC4899",
        },
        
        // Grayscale
        gray: {
          950: "#0a0a0a",
          900: "#0f0f0f",
          850: "#1a1a1a",
          800: "#2a2a2a",
          750: "#3a3a3a",
          700: "#4a4a4a",
        },
        
        // Status Colors
        success: "#00ff88",
        warning: "#ffaa00",
        danger: "#ff3366",
        info: "#00ccff",
      },
      
      // Glassmorphism & Backdrop
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom Animations
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88',
          },
          '100%': {
            boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      
      // Custom Gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, #00ff88, #00ccff)',
      },
      
      // Spacing for layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
export default config;