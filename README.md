<div align="center">
  <br />
  <p>
    <a href="https://galaxiatapp.com"><img src="https://galaxiatapp.com/logo_texte_appli_avec_arrondie_et_ombre.png" width="546" alt="galaxiat.serve.seo" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.galaxiat.fr"><img src="https://img.shields.io/discord/804787354703364116?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/galaxiat.serve.seo"><img src="https://img.shields.io/npm/v/galaxiat.serve.seo?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/galaxiat.serve.seo"><img src="https://img.shields.io/npm/dt/galaxiat.serve.seo?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://github.com/galaxiat/galaxiat.serve.seo/actions"><img src="https://github.com/galaxiat/galaxiat.serve.seo/actions/workflows/build.yaml/badge.svg" alt="Build status" /></a>
  </p>
</div>

## About

galaxiat.serve.seo [Node.js](https://nodejs.org) package allows you to easily cron crawl path that you want to have an html version (for dynamic rendering like React) without have to make SSR when request is passed.

We use it at Galaxiat to do our https://galaxiatapp.com/pub/hash/dev rendering.

## Package support 

[galaxiat.serve.seo](https://github.com/galaxiat.serve.seo) Support both static and dynamic route.

Dynamic route can be delivered by a remote json endpoint and static route can be delivered by the `.galaxiat.json` file.

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install galaxiat.serve.seo
```

## Example

### Static and remote crawl
---
`.galaxiat.json` OR `.galaxiat.{env}.json`

To set env use the `GALAXIAT_SERVE_ENV` var

```json
{
  "hostname" : "galaxiatapp.com",
  "port" : 3000,
  "args" : ["--no-sandbox", 
    "--disable-setuid-sandbox"],
  "target" : "http://localhost:3000",
  "public" : "./public",
  "crawl" : [
    {
      "type" : "config",
      "url" : "/path",
      "file" : "/cache/path.html",
      "cron" : "0 * * * * *"
    },
    {
      "type" : "remote",
      "json_url" : "https://api.galaxiatapp.com/seo/galaxiat.json",
      "cron" : "0 */15 * * * *"
    }
  ],
  "crawl_cron" : "* * * * * *",
  "crawl_max_num" : 3,
  "crawl_queue_num" : 10,
  "errors" : {
    "https" : false
  }
}
```
---
`https://galaxiatapp.com/seo/galaxiat.json`

```json
[
  {
    "url": "https://galaxiatapp.com/pub/hash/dev",
    "file": "/pub/hash/dev.html"
  },{
    "url": "https://galaxiatapp.com/pub/hash/something",
    "file": "/pub/hash/something.html"
  }
]
```

## RoadMap

- `V1.X.X` - Single workload implementation
  - Per node deployment -> not so good for performance
  - Crawling is done on the local node
- `V2.X.X` - Multiple workload implementation
  - Multi-node deployment -> better performance 
  - Crawling is done on remote node
- `V3.X.X` - Advanced Multiple workload implementation
  - Multi-node deployment + Cluster cache -> better performance 
  - Cache is cluster wide instead of a local cache per node

## Links

- [Galaxiat](https://galaxiatapp.com/)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested.

## License
Software is under [MIT](./LICENSE.md) license

