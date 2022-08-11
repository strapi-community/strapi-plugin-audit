'use strict';

const pluginId = require('../utils/pluginId');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  shouldAuditRoute: ctx => {
    const exclude = strapi.plugin(pluginId).config('exclude');

    const { methods = [], plugins = [] } = _.pick(exclude, ['methods', 'plugins']);

    // Automatically exclude this plugin's actions from audits
    plugins.push(pluginId);

    // If current method is one of the excluded methods, do not audit.
    if (methods.includes(ctx.state.route.method)) return false;

    // If current route is registered by an excluded plugin, do not audit.
    if (plugins.includes(ctx.state.route.plugin)) return false;

    // If current route is not an admin panel route, do not audit.
    if (ctx.state.auth.strategy.name !== 'admin') return false;

    return true;
  },
  log: async ctx => {
    const actionsService = strapi.plugin(pluginId).service('actions');
    const action = actionsService.get(ctx.state.route.handler);

    console.log(ctx.response);

    const data = action.handler(ctx);

    try {
      return await strapi.entityService.create(`plugin::${pluginId}.audit-log`, { data });
    } catch (error) {
      throw new Error(error);
    }
  },
});
