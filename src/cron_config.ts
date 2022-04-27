import { config_type, crawl_urls_cron_config } from "./types";
import puppeteer from "puppeteer"
import Cron from "croner"
import { writeFileSync, mkdirSync } from 'fs';
import { Stack } from ".";


/**
 * NewCronConfig (Cron that are static)
 * Use it for static path like a blog page or other
 * we do not recommend this for usage with dynamic path
 * (Use Cron Remote instead)
 * @param config 
 * @param entry 
 */
export function NewCronConfig(entry: crawl_urls_cron_config, queue: Stack) {
  // log that cron was added
  console.log(`ADDED : ${entry.url} -> ${entry.file} | ${entry.cron}`)

  const runner = () => {
    queue.push({
      file: entry.file,
      url: entry.url
    })
  }
  new Cron(entry.cron, () => {
    runner()
  });

  runner()

}