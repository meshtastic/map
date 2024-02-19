import type { Config } from "tailwindcss";
import { parkwindPlugin } from "@park-ui/tailwind-plugin";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: [parkwindPlugin],
} satisfies Config;
