// Shared browser launcher for all collectors
// Uses Edge browser via puppeteer-core (same as WorthIT project)

import type { Browser, Page } from "puppeteer-core";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let puppeteerModule: typeof import("puppeteer-core") | null = null;

async function getPuppeteer() {
  if (!puppeteerModule) {
    puppeteerModule = await import("puppeteer-core");
  }
  return puppeteerModule.default;
}

export async function launchBrowser(): Promise<Browser> {
  const puppeteer = await getPuppeteer();
  return puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--ignore-certificate-errors",
    ],
  });
}

export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(USER_AGENT);
  return page;
}
