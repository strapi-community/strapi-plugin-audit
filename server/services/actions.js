'use strict';

const actions = {};

module.exports = () => ({
  defaultHandler: ctx => ({
    ip: ctx.ips.length > 0 ? ctx.ips : ctx.ip,
    user: ctx.state.user.id,
    url: ctx.request.url,
    action: ctx.state.route.handler,
    model: ctx.params.model || null,
    affectedEntities: JSON.stringify(ctx.params.id ? [ctx.params.id] : []),
    plugin: ctx.state.route.info.pluginName || null,
    responseCode: ctx.response.status,
    responseMessage: ctx.response.message,
  }),
  register: (name, description, handler) => {
    actions[name] = { description, handler };
  },
  get: name => actions[name] || { description: name, handler: defaultHandler },
});
