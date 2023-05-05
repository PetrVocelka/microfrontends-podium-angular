const express = require('express');
const Layout = require('@podium/layout');
const utils = require('@podium/utils');

const app = express();

const domain = 'http://localhost';
const port = '8000';
const url = `${domain}:${port}`;

const layout = new Layout({
    name: 'loansLayout',
    pathname: '/',
});

layout.view((incoming, content) => {
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

const headerPodlet = layout.client.register({
    name: 'headerPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

const angularPodlet = layout.client.register({
    name: 'angularPodlet',
    uri: 'http://localhost:7400/manifest.json',
});

const angularUniversalPodlet = layout.client.register({
    name: 'angularUniversalPodlet',
    uri: 'http://localhost:7500/manifest.json',
});

const feedbackPodlet = layout.client.register({
    name: 'feedbackPodlet',
    uri: 'http://localhost:7200/manifest.json',
});

app.use(layout.middleware());

app.get('/', async (req, res) => {
    const incoming = res.locals.podium;

    const [header, angular, feedback] = await Promise.all([
        headerPodlet.fetch(incoming),
        angularPodlet.fetch(incoming),
        feedbackPodlet.fetch(incoming)
    ]);
    
    incoming.podlets = [header, angular, feedback];
    incoming.view.title = 'Angular MFE';

    res.podiumSend(`
        <div>${header}</div>
        <div>${angular}</div>
        <div>${feedback}</div>
    `);
});

app.get('/ssr', async (req, res) => {
    const incoming = res.locals.podium;

    const [header, angularUniversal, feedback] = await Promise.all([
        headerPodlet.fetch(incoming),
        angularUniversalPodlet.fetch(incoming),
        feedbackPodlet.fetch(incoming)
    ]);
    
    incoming.podlets = [header, angularUniversal, feedback];
    incoming.view.title = 'Angular MFE';

    res.podiumSend(`
        <div>${header}</div>
        <div>${angularUniversal}</div>
        <div>${feedback}</div>
    `);
});

app.get('/refresh/angular', async (req, res) => {
    await angularPodlet.refresh();
    res.status(200).send('OK');
});

app.get('/refresh/angular-universal', async (req, res) => {
    await angularUniversalPodlet.refresh();
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(url);
});