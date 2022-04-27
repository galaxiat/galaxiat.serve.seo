#! /usr/bin/env node

// imports

import handler from 'serve-handler';
import http from 'http';
import { readFileSync } from 'fs';
import { config_type, crawl_urls_cron } from './types';
import puppeteer from "puppeteer"
import { NewCronConfig } from './cron_config';
import { NewCronRemote } from './cron_remote';




const galaxiat_env = process.env.GALAXIAT_SERVE_ENV
const config_location = galaxiat_env ? `./.galaxiat.${galaxiat_env}.json` : `./.galaxiat.json`

console.log(`loading config ${config_location}`);

const config: config_type = JSON.parse(readFileSync(config_location).toString());
(async () => {
  if (config["crawl"] != undefined) {
    const browser = await puppeteer.launch({ headless: true, args: config.args });
    for (const entry of (config["crawl"] as crawl_urls_cron[])) {
      if (entry.type == "config") {
        NewCronConfig(browser, config, entry)
      } else if (entry.type == "remote") {
        NewCronRemote(browser, config, entry)
      } else {
        console.log("ERROR : entry type not found")
      }
    }
    //await browser.close()

  } else {
    console.log("No crawl params found")
  }

})();

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: config.public
  });
})


server.listen(config.port, () => {
  console.log(`Running at http://localhost:${config.port}`);
});