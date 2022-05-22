# github-repo-stats
Track Views, Clones, and Referrers of your public Github repositories in one place.

You need to be logged into GitHub.

The drawback is that this isn't automated so you need to hit "Reload" at least once a week so your data is covered and up-to-date. At least this doesn't wear down the API servers since you probably won't be doing this too frequently.
## Problem

* Github doesn't track these stats longer than 14 days old.
* None of this data is aggregated, so you have to check each repo.

## Features

* Pulls all stats for every one of your public repos and stores it into your localStorage. (`textarea` is so you can copy the data if you want)
* Graph which displays the last 7, 14, 30, and 356 days of data.
* Super fast loading since it's stored in localStorage

<p align="center">
  <img src="https://lewdev.github.io/apps/github-repo-stats/assets/main.png" width="400"/><br/>
  <a href="https://lewdev.github.io/apps/github-repo-stats">👉 Try Github Repo Stats Here</a><br/>
</p>

## 🛠️ Tools & Resources used
* Bootstrap v5.0.2 (CSS only)
* [ChartJS](https://www.chartjs.org/)

## 👤 Author: Lewis Nakao
I am a software engineer in Hawaii. Find more stuff I made [here](https://lewdev.github.io).

If you like to support me in building these apps in open source:

* [❤️ Sponsor Me](https://github.com/sponsors/lewdev)
* [💸 Send money via Paypal](https://paypal.me/lewisnakao)
