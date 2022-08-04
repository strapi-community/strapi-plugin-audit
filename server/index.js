'use strict';

const bootstrap = require('./bootstrap');
const config = require('./config');
const contentTypes = require('./content-types');
const controllers = require('./controllers');
const routes = require('./routes');
const middlewares = require('./middlewares');
const services = require('./services');

module.exports = {
  bootstrap,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  middlewares,
};
