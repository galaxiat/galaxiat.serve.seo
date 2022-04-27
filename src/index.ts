#! /usr/bin/env node

// imports

import handler from 'serve-handler';
import http from 'http';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import cron from "node-cron"
import puppeteer from "puppeteer"
// types 

type crawl_urls_cron = {
  url: string,
  file: string,
  cron: string
}
type config_type = {
  args : string[]
  hostname: string,
  port: number,
  target: string,
  public: string,
  crawl: crawl_urls_cron[]
}

// runs



//console.log("Reading config")
const config: config_type = JSON.parse(readFileSync("./.galaxiat.json").toString())
if (config["crawl"] != undefined) {
  for (const entry of (config["crawl"] as crawl_urls_cron[])) {
    console.log(`ADDED : ${entry.url} -> ${entry.file} | ${entry.cron}`)
    const runner = async () => {
      try {
        console.log(`CAPTURE : ${entry.url} -> ${entry.file}`)
        const browser = await puppeteer.launch({ headless: true, args: config.args });
        const page = await browser.newPage();
        await page.setJavaScriptEnabled(true)
        await page.setDefaultTimeout(5000);
        //change the defualt naviagation wait time
        
        await page.setDefaultNavigationTimeout(10000);
        let url = (entry.url.includes("http")) ? entry.url : `${config.target}${entry.url}`
        console.log(url)
        await page.goto(url, {
          waitUntil: ["domcontentloaded", "load", "networkidle2", "networkidle0"],
        });
        await page.waitForNetworkIdle()
        await page.waitForTimeout(15000)
        let ctn = await page.content()
        console.log(`END CAPTURE : ${entry.url} -> ${entry.file}`)
        const path = `${config.public}${entry.file.split("/").slice(0, -1).join("/")}`
        mkdirSync(path, {
          recursive: true
        })
        writeFileSync(`${config.public}/${entry.file}`, ctn)
        await browser.close();
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

}
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: config.public
  });
})


server.listen(config.port, () => {
  console.log(`Running at http://localhost:${config.port}`);
});

/**
 (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
 */