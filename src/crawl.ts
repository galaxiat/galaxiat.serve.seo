import { config_type, crawl } from "./types";
import { writeFileSync, mkdirSync } from 'fs';
import { BrowserContext, ChromiumBrowser } from "playwright";
import { GetBrowser } from "./getBrowser";

export async function Crawl(crawl_infos: crawl, config: config_type) {
  const browser = await GetBrowser(config)
  const context = await browser.newContext()
  const page = await context.newPage();
  try {
    // log cron start
    console.log(`CAPTURE : ${crawl_infos.url} -> ${crawl_infos.file}`)

    let url = (crawl_infos.url.includes("http")) ? crawl_infos.url : `${config.target}${crawl_infos.url}`
    console.log(url)
    await page.goto(url);
    await page.waitForLoadState("networkidle")
    let ctn = await page.content()

    console.log(`END CAPTURE : ${crawl_infos.url} -> ${crawl_infos.file}`)
    const path = `${config.public}${crawl_infos.file.split("/").slice(0, -1).join("/")}`
    mkdirSync(path, {
      recursive: true
    })
    writeFileSync(`${config.public}/${crawl_infos.file}`, ctn)
  } catch (e) {

    console.log(`${crawl_infos.url} -> ${e}`)
  }
  if (!page.isClosed()) {
    await page.close()
  }
  if (!browser.isConnected) {
    await browser.close()
  }
}
