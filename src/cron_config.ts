import { config_type, crawl_urls_cron_config } from "./types";
import puppeteer from "puppeteer"
import Cron from "croner"
import { writeFileSync, mkdirSync } from 'fs';


/**
 * NewCronConfig (Cron that are static)
 * Use it for static path like a blog page or other
 * we do not recommend this for usage with dynamic path
 * (Use Cron Remote instead)
 * @param config 
 * @param entry 
 */
export function NewCronConfig(browser: puppeteer.Browser, config: config_type, entry: crawl_urls_cron_config) {
  // log that cron was added
  console.log(`ADDED : ${entry.url} -> ${entry.file} | ${entry.cron}`)

  const runner = async () => {
    const page = await browser.newPage();
    try {
      // log cron start
      console.log(`CAPTURE : ${entry.url} -> ${entry.file}`)

      await page.setJavaScriptEnabled(true)

      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);

      let url = (entry.url.includes("http")) ? entry.url : `${config.target}${entry.url}`
      console.log(url)
      await page.goto(url, {
        waitUntil: ["domcontentloaded", "load", "networkidle2", "networkidle0"],
      });
      await page.waitForNetworkIdle()
      await page.waitForTimeout(15000) // wait until react app is render (will change soon)
      let ctn = await page.content()

      console.log(`END CAPTURE : ${entry.url} -> ${entry.file}`)
      const path = `${config.public}${entry.file.split("/").slice(0, -1).join("/")}`
      mkdirSync(path, {
        recursive: true
      })
      writeFileSync(`${config.public}/${entry.file}`, ctn)
      
      await page.close()
    } catch (e) {
      if (!page.isClosed()) {
        await page.close()
      }
      console.log(e)
    }
  }
  let crn = new Cron(entry.cron, async () => {
    await runner()
  });

  (async () => {
    await runner()
  })()
}