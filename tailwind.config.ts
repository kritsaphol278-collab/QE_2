// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.15)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.90)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        // 🔄 ปรับให้ทำงานวนลูปไปเรื่อยๆ ไม่มีวันสิ้นสุด (infinite)
        blob: "blob 10s infinite ease-in-out", 
      },
    },
  },
};
export default config;