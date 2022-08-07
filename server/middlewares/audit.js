'use strict';

/**
 * Programmatic audit middleware. We do not want to expose it in the plugin
 * @param {{ strapi: import('@strapi/strapi').Strapi }}
 */
module.exports = ({ strapi }) => {
  const auditService = strapi.plugin('strapi-plugin-audit').service('auditLog');

  strapi.server.use(async (ctx, next) => {
    await next();

    if (ctx.state.isAuthenticated === true && ctx.state.auth) {
      if (ctx.state.auth.strategy.name === 'admin' && ctx.state.route.method !== 'GET' && ctx.state.route.plugin !== 'strapi-plugin-audit') {
        await auditService.create(ctx);
      }
    }
  });
};
