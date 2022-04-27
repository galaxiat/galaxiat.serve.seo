export type crawl_urls_cron = crawl_urls_cron_config | crawl_urls_cron_remote

export interface crawl_urls_cron_config {
  type : "config"
  url: string,
  file: string,
  cron: string
}
export interface crawl_urls_cron_remote {
  type : "remote"
  json_url : string
  cron : string
}
export type crawl_urls_cron_remote_json = {
  url: string,
  file: string
}[]

export type config_type = {
  args : string[]
  hostname: string,
  port: number,
  target: string,
  public: string,
  crawl: crawl_urls_cron[]
}