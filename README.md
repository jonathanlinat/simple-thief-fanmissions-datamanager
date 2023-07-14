# Simple Thief Fan Missions Data Scraper

This is a very simple and automated tool to scrape Fan Missions data from multiple sources at once.

# Table of Content

1. [Simple Thief Fan Missions Data Scraper](#simple-thief-fan-missions-data-scraper)
1. [Details](#details)
    - [Sources](#sources)
    - [Prerequisites](#prerequisites)
1. [First steps](#first-steps)
    - [Specific commands](#specific-commands)
1. [Sample](#sample)

## Details

The goal of this scraper is to consolidate data on Fan Missions from multiple sources into a single, well-structured, and validated JSON object.

### Sources

- Cheap Thief Missions: [thiefmissions.com](https://www.thiefmissions.com)
- Thief - The Last GLASS: [ttlg.de](https://www.ttlg.de)

### Prerequisites

- Node v18: [nodejs.org](https://nodejs.org/en/download/)
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

## Sample

The provided JSON document serves as an illustrative sample of the data scraper's structured output. 

It features a diverse array of data pertaining to various missions from the following games: 

- Thief: The Dark Project
- Thief Gold
- Thief II: The Metal Age
- Thief Deadly Shadows
- The Dark Mod
- System Shock 2

Each mission's dataset, uniquely identified by an ID and timestamp of entry into the database, includes:

- Authors' names
- URL of the details page
- File size of the mission
- Supported languages
- Date of the last release
- Name of the mission
- Source of data

The exemplified output efficiently portrays the data scraper's prowess in consolidating multifarious mission information into a well-organized JSON document.

```json
{
  "tma": [
    {
      "_id": "96504b8e-3224-4da0-9e82-10be10a53cc5",
      "created_at": "2023-07-14T04:39:31.135Z",
      "data": {
        "authors": [
          "BlackRuin (Mark Roller)"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=929",
        "fileSize": 2516582,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2001-09-27T00:00:00.000Z",
        "name": "Paladine Manor",
        "sourceName": "Thief - The Last GLASS"
      }
    }
  ],
  "tdp": [
    {
      "_id": "55f0f739-d81f-45df-9cd1-79a853fa0e6c",
      "created_at": "2023-07-14T04:35:38.094Z",
      "data": {
        "authors": [
          "Jonquil"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=1054",
        "fileSize": 2936013,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "1999-12-02T00:00:00.000Z",
        "name": "Inheritance",
        "sourceName": "Thief - The Last GLASS"
      }
    }
  ],
  "tg": [
    {
      "_id": "f8130285-312e-4b77-8bb8-e239507bbbe7",
      "created_at": "2023-07-14T04:39:40.202Z",
      "data": {
        "authors": [
          "darthsLair (Rod Peirson)"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=316",
        "fileSize": 4540334,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2008-10-06T00:00:00.000Z",
        "name": "Phoenix Hath Risen, The",
        "sourceName": "Thief - The Last GLASS"
      }
    }
  ],
  "tdm": [
    {
      "_id": "463c6eb5-29da-430c-a49d-16a4a1c46a3e",
      "created_at": "2023-07-14T04:30:52.378Z",
      "data": {
        "authors": [
          "LordSavage"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=107",
        "fileSize": 2118124,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2012-01-15T00:00:00.000Z",
        "name": "Closemouthed Shadows",
        "sourceName": "Thief - The Last GLASS"
      }
    }
  ],
  "tds": [
    {
      "_id": "ccfc97a0-75f8-4bac-966d-a2b095c96593",
      "created_at": "2023-07-14T04:44:16.021Z",
      "data": {
        "authors": [
          "Cracked Gear"
        ],
        "detailsPageUrl": "https://www.thiefmissions.com/m/Silence",
        "fileSize": 114504499,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2007-10-31T00:00:00.000Z",
        "name": "Silence",
        "sourceName": "Cheap Thief Missions"
      }
    }
  ],
  "ss2": [
    {
      "_id": "a522234a-adef-4d79-9fdd-44d940bde782",
      "created_at": "2023-07-14T04:35:58.318Z",
      "data": {
        "authors": [
          "Christine Schneider"
        ],
        "detailsPageUrl": "https://www.thiefmissions.com/m/HaveANiceHoliday",
        "fileSize": 140194611,
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2008-10-31T00:00:00.000Z",
        "name": "Have a Nice Holiday!",
        "sourceName": "Cheap Thief Missions"
      }
    }
  ]
}
```