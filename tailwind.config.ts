import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          navy: "#1D1D1F",
          blue: "#0071E3",
          steel: "#F5F5F7",
          line: "#D2D2D7",
          ink: "#1D1D1F",
          muted: "#6E6E73",
          amber: "#BF5B00",
          green: "#248A3D",
        },
      },
      boxShadow: {
        board: "0 20px 60px rgba(0, 0, 0, 0.08)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Noto Sans KR",
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
