# Simple Thief Fan Missions Data Scraper

This is a very simple and automated tool to scrape Fan Missions data from multiple sources at once.

## Details

The goal of this scraper is to consolidate data on Fan Missions from multiple sources into a single, well-structured, and validated JSON object.

The sources are:

- Cheap Thief Missions: [https://thiefmissions.com/](https://thiefmissions.com/)

### Prerequisites

- Node v18: [Download](https://nodejs.org/en/download/)
- pnpm v7: `npm install -g pnpm@7`

## First steps

Clone the repository locally.

```bash
cd <path/to/your/desired/folder/>
git clone git@github.com:jonathanlinat/simple-thief-fanmissions-scraper.git
```

Install the dependencies.

```bash
cd simple-thief-fanmissions-scraper/
pnpm install
```

### Specific commands

Run the script.

```bash
pnpm run scrape
```
