'use strict';

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const bootlint = require('bootlint');

const HTML_MIME_TYPES = [
    'text/html',
    'application/xhtml+xml'
];

// For context, unminified bootstrap.css + bootstrap.js is ~200KiB,
// and JSFiddle inlines the contents of the CSS and JS panes of its editor into the resulting HTML.
const MAX_HTML_SIZE = '1MB';

function disabledIdsFor(req) {
    const rawIds = req.query.disable;
    if (!rawIds) {
        return [];
    }

    return rawIds.split(',');
}

function lintsFor(html, disabledIds) {
    const lints = [];
    const reporter = lint => {
        let output = false;
        if (lint.elements && lint.elements.length) {
            const {elements} = lint;
            lint.elements = undefined;
            elements.each((_, element) => {
                if (element.startLocation) {
                    const locatedLint = {...lint};
                    locatedLint.location = element.startLocation;
                    lints.push(locatedLint);
                    output = true;
                }
            });
        }

        if (!output) {
            lint.elements = undefined;
            lints.push(lint);
        }
    };

    bootlint.lintHtml(html, reporter, disabledIds);
    return lints;
}

const routes = express.Router(); // eslint-disable-line new-cap

routes.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Bootlint is online!'
    });
});

routes.post('/', (req, res) => {
    const isHtml = HTML_MIME_TYPES.some(type => req.is(type));

    if (!isHtml) {
        res.status(415).json({
            status: 415,
            message: 'Unsupported Media Type',
            details: 'Content-Type was not an HTML MIME type'
        });
        return;
    }

    res.format({
        'application/json'() {
            const disabledIds = disabledIdsFor(req);
            const lints = lintsFor(req.body.html, disabledIds);
            res.status(200).json(lints);
        },
        default() {
            res.status(406).json({
                status: 406,
                message: 'Not Acceptable',
                details: '"Accept" header must allow MIME type application/json'
            });
        }
    });
});

const app = express();

app.use(logger('dev'));
HTML_MIME_TYPES.forEach(type => {
    app.use(bodyParser.text({
        type,
        limit: MAX_HTML_SIZE
    }));
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
    const isHttpErr = Boolean(err.status);

    if (!isHttpErr) {
        err.status = 500;
    }

    const errJson = {
        status: err.status,
        message: err.message
    };

    if (!isHttpErr) {
        errJson.stack = err.stack;
    }

    res.status(err.status).json(errJson);
});
/* eslint-enable no-unused-vars */

module.exports = app;
