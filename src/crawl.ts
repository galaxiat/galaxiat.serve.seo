import { Browser } from "puppeteer";
import { config_type, crawl } from "./types";
import { writeFileSync, mkdirSync } from 'fs';
import { ChromiumBrowser } from "playwright";

export async function Crawl(browser: ChromiumBrowser, crawl_infos: crawl, config: config_type) {
  const page = await browser.newPage();
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
  console.log(page.isClosed())

}
