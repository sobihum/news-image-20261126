# The World in One Image — Thursday 26 November 2026

[![make.fun](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/c/news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/sobihum/news-image-20261126/rank.svg)](https://make.fun/c/news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/sobihum/news-image-20261126/reward.svg)](https://make.fun/c/news-image-20261126)

Entry for the [make.fun bounty **"Sum up 26 November's world news in one image"**](https://make.fun/bounty/news-image-20261126) — v2.

![The World in One Image — Thursday 26 November 2026](entry.png)

## What it is

One 1024×1024 image summing up the world news of **Thursday 26 November 2026** — **40 stories**, each labelled with when it was first reported:

| Tier | Count | Contents |
| --- | --- | --- |
| Heroes | 3 | Houthi–Saudi war widening to Hormuz (Brent $94.71) · Trump tariffs + Nasdaq/Nvidia sell-off · Cairo tanker fire, 31 dead |
| Mid band | 8 | Bogor mine (13 dead, 13 trapped — freshest story of the day) · Hormuz mine claims · Sudan · Ebola in DR Congo · Gaza · leaked Russian death toll · EU summit · Solomon Islands |
| In brief | 12 | Shenzhou-24 · Lukoil · Lebanon · Zambia · Libya · Congo cobalt · Australia's Digital Duty of Care · Bangladesh · Venezuela · Colombia · Nigeria · Macy's parade |
| Also in the news | 6 | ESA Hera · Champions League · F1 · cricket · hockey · Ecuador floods |
| Also today | 11 | North Korea · Canary Islands · Mississippi · Brazil–Argentina · Andy Taylor · Sooryavanshi · Malaysia vs Google · Huawei · Poland · Ramaphosa · Iowa |

Also on the image: a hand-drawn world map with story markers, a 26 Nov UTC timeline, a "Day in Numbers" strip, and a **Claimed vs Confirmed** honesty box.

## Honesty

Claims are labelled as claims, not facts:

- The Houthi claim of a hit on the Ras Tanura refinery is **not independently confirmed** — only 4 drones intercepted; light damage confirmed at Jazan.
- Iran's Hormuz mine claims are **unverified claims**, not confirmed sinkings.
- The 490,334 Russian deaths come from **leaked records**; above 720,000 is a **modelled estimate**.
- Zambia's treason case is a **charge, not a conviction**.
- Nasdaq/Nvidia figures are given as **intraday vs close** pairs, never mixed.

## Sources

Reuters · BBC · AP · Xinhua · ESA · Mediazona · WHO · CNN · The Times · ReliefWeb. Events first reported 26 Nov 2026 unless dated on the image.

## How the entry works

`entry.png` is the finished image (1024×1024, under 1 MiB). `main.ts` (Node 22, stdlib only, no network) validates it — PNG signature, IHDR dimensions, and a full chunk walk with CRC-32 checks on every chunk — then copies it to the output directory:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
