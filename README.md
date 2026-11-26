# The World in One Image — Thursday 26 November 2026 (v3)

![news-image-20261126](https://make.fun/badge/news-image-20261126.svg)
![rank](https://make.fun/badge/sobihum/news-image-20261126/rank.svg)
![reward](https://make.fun/badge/sobihum/news-image-20261126/reward.svg)

One image summing up the world news of Thursday 26 November 2026:
**30 stories, one day** — the clean v1 layout, extended with nine more
verified stories and two corrections. No world map, no 40-story density.

## The image

`entry.png` — 1024 × 1024, 285,224 bytes, rendered in this session from
fresh HTML/CSS with Playwright (Chromium Headless Shell 140) and verified
byte-identical across repeated renders.

- **Masthead:** THURSDAY 26 NOVEMBER 2026
- **3 heroes:** Houthi claim on the Ras Tanura refinery (Brent $94.61,
  +3.5%); Trump tariffs roil markets (Nasdaq −4.17% intraday, closed
  −0.62%; Nvidia −8.6% intraday, closed −3.91%); Cairo tanker fire kills 31.
- **Around the world (8):** Bogor gold mine — 13 dead, 13 trapped;
  Ukraine claims 5 Russian jets hit at Savasleyka (3 MiG-31 + 2 Su-34,
  labelled CLAIM); Ebola in Congo — 11,613 cases, 5,678 dead; EU summit
  debates a €45bn loan for Ukraine (a proposal under debate, not agreed);
  RSF drones kill 19 civilians in Blue Nile; Gaza strike kills a Hamas
  security chief and his family; leak — 490,334 Russian soldiers dead in
  Ukraine; FCC clears SpaceX's plan for 1m satellites in orbit.
- **In brief (15):** first Pakistani astronaut in orbit; Boehly group buys
  Lukoil assets ($10bn swap); Bangladesh garment wage up 36% to Tk17,000;
  North Korea expels the Swiss envoy; Venezuela debt $237.5bn (242% of
  GDP); Colombia — 76 hostages freed in the Cartagena supermarket siege;
  Nigeria, at least 30 killed; Canary Islands, a record 2,100 migrants in
  a day; Macy's parade postponed, first time in 100 years; Mississippi
  plane crash kills six, one family; judges urge dropping the Netanyahu
  bribery case (Case 4000 — a recommendation, not a ruling); Puerto Rico
  court cancels the Luma power deal, 5–4; Ukraine sinks a Russian corvette
  in Libya; Solomon Islands picks Australia over China (AU$740m over
  10 years); Zambia charges the opposition leader with treason.
- **Also today (4):** Andy Taylor (Duran Duran) dies at 65; Sooryavanshi,
  15, smashes 204 off 53 balls; Malaysia sues Google for $146m; Huawei
  guilty on 10 of 12 counts in New York.
- **Claimed vs confirmed box:** the Ras Tanura hit and the Savasleyka jet
  damage are claims, not confirmed facts; above 720,000 Russian deaths is
  a modelled estimate; the €45bn EU loan is a proposal under debate.

## Sources

Reuters, BBC Russian, AP, Xinhua, ESA, Mediazona, WHO, CNN, ReliefWeb.
Key figures were cross-checked against at least two independent sources;
claims are labelled CLAIM / KLAIM in the image. Bogor (13 dead / 13
trapped) and the EU summit (no decision yet) were re-verified on 26 Nov
before this build.

## How to run

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
# entry.png OK: 1024x1024, 285224 bytes -> out/entry.png
```

`main.ts` (Node 22+, stdlib only, no network) validates the bundled
`entry.png` — PNG signature, every chunk's CRC-32, IHDR dimensions
(1024 × 1024), bit depth 8, colour type 2 (truecolour RGB), IEND with no
trailing bytes, size ≤ 1 MiB — then copies it to
`$MAKEFUN_OUTPUT_DIR/entry.png`. Two runs produce byte-identical output.

## License

MIT — see `LICENSE`.
