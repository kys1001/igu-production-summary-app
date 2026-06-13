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
          navy: "#0B2F5B",
          blue: "#124C8C",
          steel: "#E8EEF5",
          line: "#D8E2EE",
          ink: "#142033",
          muted: "#607089",
          amber: "#F2B84B",
          green: "#2D8A68",
        },
      },
      boxShadow: {
        board: "0 18px 45px rgba(11, 47, 91, 0.08)",
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
