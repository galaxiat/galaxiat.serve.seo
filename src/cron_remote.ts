import { config_type, crawl_urls_cron_config, crawl_urls_cron_remote, crawl_urls_cron_remote_json } from "./types";
import puppeteer from "puppeteer"
import cron from "node-cron"
import { writeFileSync, mkdirSync } from 'fs';
import fetch from "node-fetch";

/**
 * NewCronRemote (Cron that are dynamic)
 * Use it for dynamic path like a user profile or other
 * we recommend this for usage with dynamic path
 * @param config 
 * @param entry 
 */
export function NewCronRemote(browser: puppeteer.Browser, config: config_type, entry: crawl_urls_cron_remote) {
  // log that cron was added
  console.log(`ADDED : ${entry.json_url} -> REMOTE`)

  const runner = async () => {

    try {
      console.log(`CAPTURE : ${entry.json_url} -> REMOTE`)
      let json: crawl_urls_cron_remote_json = await fetch(entry.json_url).then(res => res.json() as any)
      const total_entry = json.length
      let timeout = 0
      for (const entry of json) {
        setTimeout(() => {
          (async () => {
            try {
              const page = await browser.newPage();
              try {
                await page.setJavaScriptEnabled(true)
                page.setDefaultTimeout(5000);
                page.setDefaultNavigationTimeout(10000);
                let url = (entry.url.includes("http")) ? entry.url : `${config.target}${entry.url}`
                console.log(url)
                await page.goto(url);
                await page.waitForTimeout(15000) // wait until react app is render (will change soon)
                let ctn = await page.content()
    
                console.log(`END CAPTURE : ${entry.url} -> ${entry.file}`)
                const path = `${config.public}${entry.file.split("/").slice(0, -1).join("/")}`
                mkdirSync(path, {
                  recursive: true
                })
                writeFileSync(`${config.public}/${entry.file}`, ctn)
    
                await page.close()
              } catch (e){
                if (!page.isClosed()) {
                  page.close()
                }
                console.log(e)
              }
            } catch (e) {
              console.log(e)
            }
          })()
        }, timeout);
        timeout += 2000

      }
    } catch (e) {
      console.log(e)
    }
  }
  let crn = cron.schedule(entry.cron, async () => {
    await runner()
  })
  crn.start();

  (async () => {
    await runner()
  })()
}

/**
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
 */