import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["var(--font-jakarta)"],
        inter: ["var(--font-inter)"],
        display: ["var(--font-jakarta)"],
        heading: ["var(--font-jakarta)"],
      },
    },
  },
};

export default config;
