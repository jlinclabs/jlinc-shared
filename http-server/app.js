/**
 * Main application file
 */

'use strict';

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const logger = require('../logger')('express');

// Setup server
const app = express();

app.use(
  morgan('tiny', {
    stream: {
      write: function(message){
        logger.info(message.toString().replace(/\n+$/,''));
      }
    }
  })
);

app.use(compression());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

// helpers
app.use(function(req, res, next) {

  req.id = Math.random().toString().split('.')[1];
  req.context = {};
  req.context.logger = logger.prefix(req.id);
  req.context.logger.debug(`REQUEST START ${req.method} ${req.url}`, req.query, req.body);

  res.renderUnauthorizedError = function() {
    const unauthorizedError = new Error('unauthorized');
    unauthorizedError.status = 401;
    throw unauthorizedError;
  };

  res.json = (renderJson => (json, ...args) => {
    try{ return renderJson.call(res, json, ...args); }
    catch(error){ throw error; }
    finally{ res._responseJSON = json; }
  })(res.json);

  res.renderError = function(error) {
    logger.error('RENDERING ERROR', error);
    const errorAsString = typeof error === 'string' ? error : error.message;
    res.status(error.status || 200);
    res.json({
      success: false,
      error: errorAsString,
    });
  };

  res.renderSuccess = function(json={}) {
    res.json(
      Object.assign(json, {success: true})
    );
  };

  if (req.method === 'OPTIONS'){
    res.header('Cache-Control', 'private, max-age=31536000');
  }else{
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  res.header('Access-Control-Allow-Origin', req.get('origin'));
  res.header('Access-Control-Allow-Headers', 'Accept, content-type, Session-Id');
  res.header('Access-Control-Max-Age', '86400');
  // res.header('Access-Control-Allow-Credentials', 'true');

  res.on('finish', function() {
    const { method, url, query, body } = req;
    const { statusCode } = res;
    req.context.logger.debug('REQUEST END', {
      req: { method, url, query, body: trucJSON(body) },
      res: { statusCode, json: trucJSON(res._responseJSON) },
    });
  });

  if (req.method === 'OPTIONS'){
    res.end();
  }else{
    next();
  }
});

function trucJSON(object){
  if (typeof object === 'undefined') return;
  try{ return JSON.stringify(object).substr(0, 1000); }
  catch(error){ return `${error}`; }
}

app.defineRoutes = function(definition){
  app.defineRoutes = () => { throw new Error('app.defineRoutes called twice!'); };
  definition(require('./promiseRouter')(app));

  // catch all Not Found
  app.use('*', (req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.status(404);
    res.json({
      success: false,
      error: `Endpoint Not Found: ${req.method} ${url}`,
    });
  });

  // log errors
  app.use(errorHandler({
    log: (error, errorAsString) => {
      logger.error(`Request Error: ${errorAsString}`);
    },
  }));
};

module.exports = app;
