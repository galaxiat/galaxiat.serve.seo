#! /usr/bin/env node

// imports

import handler from 'serve-handler';
import http from 'http';
import { readFileSync } from 'fs';
import { config_type, crawl, crawl_urls_cron } from './types';
import puppeteer from "puppeteer"
import { NewCronConfig } from './cron_config';
import { NewCronRemote } from './cron_remote';
import Cron from 'croner';
import { Crawl } from './crawl';


const galaxiat_env = process.env.GALAXIAT_SERVE_ENV
const config_location = galaxiat_env ? `./.galaxiat.${galaxiat_env}.json` : `./.galaxiat.json`

console.log(`loading config ${config_location}`);

const config: config_type = JSON.parse(readFileSync(config_location).toString());
(async () => {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: config.public
    });
  })

  const browser = await puppeteer.launch({ headless: false, args: config.args });
  const borwserPID = browser.process();
  let queue = new Stack()

  let httpserv = server.listen(config.port, () => {
    if (config["crawl"] != undefined) {
      let curr_crawl_num = 0
      new Cron(config.crawl_cron, async () => {
        console.log("targets :", browser.targets().length)
        console.log("crawl_num :", curr_crawl_num)
        console.log("queue count : ",queue.count())
        if ((curr_crawl_num < config.crawl_max_num)) {
          curr_crawl_num++
          for (const entry of queue.get(config.crawl_queue_num)) {
            await Crawl(browser, entry, config)
          }
          curr_crawl_num--
        }

      })
      for (const entry of (config["crawl"] as crawl_urls_cron[])) {
        if (entry.type == "config") {
          NewCronConfig(entry, queue)
        } else if (entry.type == "remote") {
          NewCronRemote(entry, queue)
        } else {
          console.log("ERROR : entry type not found")
        }
      }
      //await browser.close()
    } else {
      console.log("No crawl params found")
    }

    console.log(`Running at http://localhost:${config.port}`);
  });

  httpserv.on("close", () => {
    browser.on('disconnected', () => {
      console.log('sleeping 100ms'); //  sleep to eliminate race condition  
      setTimeout(function () {
        console.log(`Browser Disconnected... Process Id: ${process}`);
        borwserPID?.kill()
      }, 100);
    })
  })
})();

export class Stack {
  list: crawl[]
  constructor() {
    this.list = []
  }
  public push(item: crawl): number {
    console.log(item)
    return this.list.indexOf(item) === -1 ? this.list.push(item) : this.list.length
  }
  public get(num: number): crawl[] {
    let array: crawl[] = []
    for (let i = 0; i < num; i++) {
      let item = this.list.shift()
      if (item) {
        array.push(item)
      }
    }
    return array;
  }
  public count(): number {
    return this.list.length
  }
}
