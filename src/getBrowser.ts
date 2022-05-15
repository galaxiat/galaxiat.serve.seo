import { config_type } from "./types";
import playwright from "playwright"

export function GetBrowser(config : config_type) : Promise<playwright.Browser> {
  return  (config.type == "remote") ?
    playwright.chromium.connect(config.remote)
  : playwright.chromium.launch({ headless: true, args: config.args });
}