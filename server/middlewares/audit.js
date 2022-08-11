'use strict';

const pluginId = require('../utils/pluginId');

/**
 * Programmatic audit middleware. We do not want to expose it in the plugin
 * @param {{ strapi: import('@strapi/strapi').Strapi }}
 */
module.exports = ({ strapi }) => {
  const auditService = strapi.plugin(pluginId).service('audit');

  strapi.server.use(async (ctx, next) => {
    await next();
    if (auditService.shouldAuditRoute(ctx)) await auditService.log(ctx);
  });
};
