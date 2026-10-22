import { chromium } from "playwright";
export const base = process.env.BASE || "http://localhost:4174";
// The pinned Playwright wants a browser revision that is not downloaded; the 1228 shell works.
export const launch = () => chromium.launch({ executablePath: process.env.PW_EXE || "/Users/kartikeyjandial/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell" });
