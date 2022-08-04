'use strict';

module.exports = ({ strapi }) => ({
  async create(ctx) {
    const auditStructure = {
      adminUserIPAddress: ((ctx.ips.length > 0) ? ctx.ips : ctx.ip),
      adminUser: ctx.state.user.id,
      url: ctx.request.url,
      action: ctx.state.route.handler,
      entityModel: ((ctx.params.model) ? ctx.params.model : null),
      entityID: ((ctx.params.id) ? ctx.params.id : null),
      plugin: ((ctx.state.route.info.pluginName) ? ctx.state.route.info.pluginName : null),
      responseCode: ctx.response.status,
      responseMessage: ctx.response.message
    };

    try {
      console.log(auditStructure)
      return strapi.entityService.create('plugin::strapi-plugin-audit.audit-log', {
        data: auditStructure
      })
    } catch (error) {
      throw new Error(error);
    }
  },
});
