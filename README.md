# Microfrontends - Podium + Angular

This repository was made just for learning purposes.

## Installation

Install dependencies in every project directory that contains package.json

```bash
npm install
```

Build angular files

```bash
npm run build
```

Build angular universal files

```bash
ng build && ng run angular-universal-project:server
npm run serve:ssr
```

Start podlets

```bash
node header-podlet
node feedback-podlet
node angular-project-podlet 
node angular-universal-project-podlet
node loans-layout
```


## Inspired by

[Micro Frontends with Podium (Jens-Christian Bjerkek)](https://bjerkek.medium.com/micro-frontends-with-podium-e772abda9fe)