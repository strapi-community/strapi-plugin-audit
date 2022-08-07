'use strict';

const pluginId = require('../utils/pluginId');

const mapContext = (ctx) => {
  return {
    adminUserIPAddress: ctx.ips.length > 0 ? ctx.ips : ctx.ip,
    adminUser: ctx.state.user.id,
    url: ctx.request.url,
    action: ctx.state.route.handler,
    entityModel: ctx.params.model || null,
    entityID: ctx.params.id || null,
    plugin: ctx.state.route.info.pluginName || null,
    responseCode: ctx.response.status,
    responseMessage: ctx.response.message,
  };
};

module.exports = ({ strapi }) => ({
  async create(ctx, map = mapContext) {
    const audit = map(ctx);

    try {
      return await strapi.entityService.create(`plugin::${pluginId}.audit-log`, {
        data: audit,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
});
