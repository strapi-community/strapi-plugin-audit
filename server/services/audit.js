'use strict';

const pluginId = require('../utils/pluginId');
const { isPluginActionExcluded } = require('../utils/exclude');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  shouldAuditRoute: ctx => {
    const actionsService = strapi.plugin(pluginId).service('actions');
    const exclude = strapi.plugin(pluginId).config('exclude');
    const action = _.get(ctx, 'state.route.handler');
    const plugin = _.get(ctx, 'state.route.info.pluginName');
    const method = _.get(ctx, 'request.method');
    const model = _.get(ctx, 'params.model');

    if (!action) return false;

    let {
      methods: excludedMethods = [],
      plugins: excludedPlugins = {},
      models: excludedModels = [],
    } = _.pick(exclude, ['methods', 'plugins']);

    if (Array.isArray(excludedPlugins))
      excludedPlugins = excludedPlugins.reduce(
        (acc, plugin) => ({ ...acc, [plugin]: { actions: '*' } }),
        {}
      );

    // Automatically exclude this plugin's actions and models from audits
    excludedPlugins[pluginId] = { actions: '*' };

    const auditModels = strapi.plugins[pluginId].contentTypes;
    const auditModelsUIDs = Object.values(auditModels).map(({ uid }) => uid);

    excludedModels = _.uniq([...excludedModels, ...auditModelsUIDs]);

    // If current method is one of the excluded methods, do not audit.
    if (excludedMethods.includes(method)) return false;

    // If current action is registered by a plugin, and is excluded, do not audit.
    if (isPluginActionExcluded(action, plugin, excludedPlugins)) return false;

    // If current action is a content manager action for an excluded model, do not audit.
    if (plugin === 'content-manager' && excludedModels.includes(model)) return false;

    // If action is not registered, do not audit.
    if (!actionsService.get(plugin, action)) return false;

    console.log(`Auditing request for ${(action, plugin, ctx.state.route)}`);
    console.log(ctx.state.route);

    return true;
  },
  log: async ctx => {
    const actionsService = strapi.plugin(pluginId).service('actions');

    const handlerName = ctx.state.route.handler;
    const plugin = ctx.state.route.info.pluginName;

    const action = actionsService.get(plugin, handlerName);

    const data = await action.handler(ctx);

    try {
      return await strapi.entityService.create(`plugin::${pluginId}.log`, { data });
    } catch (error) {
      throw new Error(error);
    }
  },
});
