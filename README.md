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

- Shadowdark Keep: [shadowdarkkeep.com](http://www.shadowdarkkeep.com)
- The Keep of Metal and Gold: [keepofmetalandgold.com](http://www.keepofmetalandgold.com)
- Cheap Thief Missions: [thiefmissions.com](https://www.thiefmissions.com)
- Thief - The Last GLASS: [ttlg.de](https://www.ttlg.de)

### Prerequisites

- Node v18: [nodejs.org](https://nodejs.org/en/download/)
- pnpm v7: `npm install -g pnpm@7`
- Docker Engine: [docs.docker.com](https://docs.docker.com/engine/)

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

> **Important**
>
> Docker must be installed and running.

Run the script.

```bash
pnpm run docker:start
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

Each mission dataset is included and uniquely identified by an ID and a timestamp of creation, consisting of:

- Mission name
- File data, including name, size in bytes, and download URL
- Source data, including name and URL
- Authors' names
- URL of the details page
- Supported languages
- Date of the last release

This sample efficiently portrays the data scraper's prowess in consolidating vast and multifarious mission information into a well-organized and structured JSON document.


```json
{
  "tma": [
    {
      "_id": "8548dbfe-8022-472a-ae29-515db24e9f86",
      "created_at": "2023-07-16T07:10:50.077Z",
      "data": {
        "name": "Uncontest: Unholy Vivid Innocence",
        "file": {
          "name": "UNPC-UVIv1.3.zip",
          "size": 12740198,
          "url": "https://www.ttlg.de/download/download.php?site=3&file=UNPC-UVIv1.3.zip"
        },
        "source": {
          "name": "Thief - The Last GLASS",
          "url": "https://www.ttlg.de"
        },
        "authors": [
          "Haplo (Ali Pouladi)"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=238",
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2010-02-13T00:00:00.000Z"
      }
    }
  ],
  "tdp": [
    {
      "_id": "d515f69e-13ab-4b39-beac-40f45730e51a",
      "created_at": "2023-07-16T06:57:46.910Z",
      "data": {
        "name": "Curse of the Ancients",
        "file": {
          "name": "curse.zip",
          "size": 3774874,
          "url": "https://www.thiefmissions.com/download.cgi?m=curse"
        },
        "source": {
          "name": "Cheap Thief Missions",
          "url": "https://www.thiefmissions.com"
        },
        "authors": [
          "Kozmala"
        ],
        "detailsPageUrl": "https://www.thiefmissions.com/m/curse",
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2000-07-24T00:00:00.000Z"
      }
    }
  ],
  "tg": [
    {
      "_id": "557f4149-c634-4e69-812a-e9e7a90ca313",
      "created_at": "2023-07-16T06:53:42.243Z",
      "data": {
        "name": "Lost Among The Forsaken",
        "file": {
          "name": "TDP20AC_Forsaken.zip",
          "size": 48234496,
          "url": "http://www.keepofmetalandgold.com/missionst1/TDP20AC_Forsaken.zip"
        },
        "source": {
          "name": "The Keep of Metal and Gold",
          "url": "http://www.keepofmetalandgold.com"
        },
        "authors": [
          "Drk"
        ],
        "detailsPageUrl": "http://www.keepofmetalandgold.com/fmarchive.php",
        "languages": [],
        "lastReleaseDate": "2018-11-30T00:00:00.000Z"
      }
    }
  ],
  "tdm": [
    {
      "_id": "228e0cce-f8a8-4f90-8a86-1d61a591b5d4",
      "created_at": "2023-07-16T06:53:41.953Z",
      "data": {
        "name": "Not An Ordinary Guest",
        "file": {
          "name": "naog_v1.1.pk4",
          "size": 82837504,
          "url": "http://www.shadowdarkkeep.com/missionsdm/naog_v1.1.pk4"
        },
        "source": {
          "name": "Shadowdark Keep",
          "url": "http://www.shadowdarkkeep.com"
        },
        "authors": [
          "Fieldmedic"
        ],
        "detailsPageUrl": "http://www.shadowdarkkeep.com/fmarchive.php",
        "languages": [],
        "lastReleaseDate": "2013-09-01T00:00:00.000Z"
      }
    }
  ],
  "tds": [
    {
      "_id": "a572c208-a62a-4bca-8d10-9cb808903d99",
      "created_at": "2023-07-16T07:07:59.707Z",
      "data": {
        "name": "Special Vintage",
        "file": {
          "name": "Special_Vintage.zip",
          "size": 39321600,
          "url": "https://www.ttlg.de/download/download.php?site=46&file=Special_Vintage.zip"
        },
        "source": {
          "name": "Thief - The Last GLASS",
          "url": "https://www.ttlg.de"
        },
        "authors": [
          "Gonchong (James D. Roberts)"
        ],
        "detailsPageUrl": "https://www.ttlg.de/index.php?fm-detail&id=590",
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2005-10-20T00:00:00.000Z"
      }
    }
  ],
  "ss2": [
    {
      "_id": "fa980566-f6ec-4816-b498-7f87de8f95e1",
      "created_at": "2023-07-16T07:01:44.750Z",
      "data": {
        "name": "Have a Nice Holiday!",
        "file": {
          "name": "SS2_Christine_UrlaubV2.zip",
          "size": 140194611,
          "url": "https://www.thiefmissions.com/download.cgi?m=HaveANiceHoliday"
        },
        "source": {
          "name": "Cheap Thief Missions",
          "url": "https://www.thiefmissions.com"
        },
        "authors": [
          "Christine Schneider"
        ],
        "detailsPageUrl": "https://www.thiefmissions.com/m/HaveANiceHoliday",
        "languages": [
          "en"
        ],
        "lastReleaseDate": "2008-10-31T00:00:00.000Z"
      }
    }
  ]
}
```