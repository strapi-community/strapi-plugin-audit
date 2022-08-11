'use strict';

const initAuditMiddleware = require('./middlewares/audit');
const pluginId = require('./utils/pluginId');
const _ = require('lodash');

module.exports = async ({ strapi }) => {
  const actionsService = strapi.plugin(pluginId).service('actions');

  // Load default actions
  await actionsService.loadRouteActions();

  // Load actions registered through the extension system
  await actionsService.loadExtendedActions();

  console.log(strapi.plugins[pluginId].routes.admin.routes);

  // Init the audit middleware
  initAuditMiddleware({ strapi });
};
