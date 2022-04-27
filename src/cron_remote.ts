import { config_type, crawl_urls_cron_config, crawl_urls_cron_remote, crawl_urls_cron_remote_json } from "./types";
import puppeteer from "puppeteer"
import Cron from "croner"
import { writeFileSync, mkdirSync } from 'fs';
import fetch from "node-fetch";
import { Stack } from ".";

/**
 * NewCronRemote (Cron that are dynamic)
 * Use it for dynamic path like a user profile or other
 * we recommend this for usage with dynamic path
 * @param config 
 * @param entry 
 */
export function NewCronRemote(entry: crawl_urls_cron_remote, queue: Stack) {
  // log that cron was added
  console.log(`ADDED : ${entry.json_url} -> REMOTE`)

  const runner = async () => {
    let json: crawl_urls_cron_remote_json = await fetch(entry.json_url).then(res => res.json() as any)
    for (const data of json) {
      console.log(data)
      queue.push({
        file: data.file,
        url: data.url
      })
    }
  }

  new Cron(entry.cron, async () => {
    await runner()
  });

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