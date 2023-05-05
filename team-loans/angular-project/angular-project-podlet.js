const express = require('express');
const http = require('http');

const Podlet = require('@podium/podlet');
const utils = require('@podium/utils');
const fs = require('fs');

const app = express();

const domain = 'http://localhost';
const port = '7400';
const url = `${domain}:${port}`;

const podlet = new Podlet({
    name: 'angular-project',
    version: '1.0.0',
    pathname: '/',
    manifest: '/manifest.json',
    content: '/',
    fallback: '/fallback',
    development: true,
});

podlet.view((incoming, content) => {
  return `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${incoming.css.map(utils.buildLinkElement).join('\n')}
          <title>${incoming.view.title}</title>
      </head>
      <body>
          ${content}
          ${incoming.js.map(utils.buildScriptElement).join('\n')}
      </body>
  </html>`;
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
      <app-root></app-root>
    `);
});

app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});

app.use('/', express.static('dist/angular-project'));

// Include all crucial angular assets (css, js) in final HTML. Other scripts (modules) will be loaded based on route and other factors lazily.
// Load all crucial assets from dist/angular-project folder using node FS

const filesInAngularDistFolder = fs.readdirSync('dist/angular-project');

for (const file of filesInAngularDistFolder) {
  // Include styles.css in podlet
  if (file.startsWith('styles') && file.endsWith('.css')) {
    podlet.css({ value: file });
  }

  // Include runtime.js in podlet
  if (file.startsWith('runtime') && file.endsWith('.js')) {
    podlet.js({ value: file });
  }

  // Include polyfills.js in podlet
  if (file.startsWith('polyfills') && file.endsWith('.js')) {
    podlet.js({ value: file });
  }

  // Include main.js in podlet
  if (file.startsWith('main') && file.endsWith('.js')) {
    podlet.js({ value: file });
  }
}

app.listen(port, () => {
  console.log(url);

  // Notify layout podlet about angular project podlet changes - just for testing purposes
  http.get('http://localhost:8000/refresh/angular', function (err, res) {
    console.log("Podium - Angular project podlet refreshed in layout!")
  });
});
