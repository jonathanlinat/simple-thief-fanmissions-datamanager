# Simple Thief Fan Missions Data Manager

This is a simple and automated tool to crawl, scrape, parse and store Fan Missions data from multiple sources at once.

# Table of Content

1. [Details](#details)
    - [Sources](#sources)
    - [Prerequisites](#prerequisites)
1. [First steps](#first-steps)
    - [Specific commands](#specific-commands)

## Details

The goal of this data manager is to consolidate data on Fan Missions from multiple sources into a single, well-structured, and validated database.

### Sources

- Cheap Thief Missions: [thiefmissions.com](https://www.thiefmissions.com)
- Shadowdark Keep: [shadowdarkkeep.com](http://www.shadowdarkkeep.com)
- Taffers Paradise: [taffersparadise.co.uk](https://www.taffersparadise.co.uk)
- The Keep of Metal and Gold: [keepofmetalandgold.com](http://www.keepofmetalandgold.com)
- Thief - The Last GLASS: [ttlg.de](https://www.ttlg.de)
- Thief Guild: [thiefguild.com](https://www.thiefguild.com)
- Thief: The Circle: [thief-thecircle.com](http://www.thief-thecircle.com)
- Through the Looking Glass: [ttlg.com](https://www.ttlg.com)

### Prerequisites

- Node v18: [nodejs.org](https://nodejs.org/en/download/)
- pnpm v7: `npm install -g pnpm@7`
- Docker Engine: [docs.docker.com](https://docs.docker.com/engine/)

## First steps

Clone the repository locally.

```bash
cd <path/to/your/desired/folder/>
git clone git@github.com:jonathanlinat/simple-thief-fanmissions-datascraper.git
```

Install the dependencies.

```bash
cd simple-thief-fanmissions-datascraper/
pnpm install
```

### Specific commands

> **Important**
>
> Docker engine must be installed and running.

Run the script.

```bash
pnpm run docker:start
```
