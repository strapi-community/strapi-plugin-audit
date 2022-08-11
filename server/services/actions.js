'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const importDefault = require('../utils/importDefault');
const yup = require('yup');
const pluginId = require('../utils/pluginId');
const { mapRoutesObject } = require('../utils/route');

const actionSchema = yup.object({
  name: yup.string().required(),
  handler: yup
    .mixed()
    .required()
    .test('isFunction', 'Handler is not a function', value => typeof value === 'function'),
});

const actions = {};

module.exports = () => {
  const defaultHandler = ctx => ({
    ip: ctx.ips.length > 0 ? ctx.ips : ctx.ip,
    user: _.get(ctx, 'state.user.id'),
    url: _.get(ctx, 'request.url'),
    action: _.get(ctx, 'state.route.handler'),
    model: _.get(ctx, 'params.model', null),
    affectedEntities: JSON.stringify(_.get(ctx, 'params.id') ? [ctx.params.id] : []),
    plugin: _.get(ctx, 'state.route.info.pluginName', null),
    responseCode: _.get(ctx, 'response.status'),
    responseMessage: _.get(ctx, 'response.message'),
  });

  const register = (registrar, name, handler) => {
    if (!actions[registrar]) actions[registrar] = {};
    actions[registrar][name] = { handler };
  };

  const get = (registrar, name) => _.get(actions, [registrar, name], null);

  const list = () =>
    Object.entries(actions).reduce((acc, [key, value]) => {
      return { ...acc, [key]: Object.keys(value) };
    }, {});

  const validate = async action => await actionSchema.validate(action);

  const loadActions = async (dir, registrar) => {
    const dirExists = await fs.pathExists(dir);

    if (!dirExists) return;

    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fileDir = path.join(dir, file.name);

      if (file.isFile() && path.extname(file.name) === '.js') {
        let action = importDefault(fileDir);

        if (typeof action === 'function') action = action({ defaultHandler });

        if (!(await validate(action))) continue;

        register(registrar, action.name, action.handler);
      }
    }
  };

  const loadRouteActions = async () => {
    for (const adminRoute of strapi.admin.routes) {
      register('admin', adminRoute.handler, defaultHandler);
    }

    for (const [pluginName, plugin] of Object.entries(strapi.plugins)) {
      if (Array.isArray(plugin.routes)) continue;

      const adminRoutes = _.get(plugin, 'routes.admin.routes', []);

      for (const adminRoute of adminRoutes) {
        register(pluginName, adminRoute.handler, defaultHandler);
      }
    }
  };

  const loadInternalActions = async () =>
    await loadActions(path.resolve(__dirname, '..', 'actions'), pluginId);

  const loadExtendedActions = async () => {
    const extensionsDir = strapi.dirs.app.extensions;
    const extensions = await fs.readdir(extensionsDir, { withFileTypes: true });

    for (const extension of extensions) {
      if (extension.isDirectory()) {
        const actionsDir = path.join(extensionsDir, extension.name, pluginId, 'actions');
        const hasAuditActions = await fs.pathExists(actionsDir);

        if (hasAuditActions) {
          await loadActions(actionsDir, extension.name);
        }
      }
    }
  };

  return {
    loadRouteActions,
    loadInternalActions,
    loadExtendedActions,
    defaultHandler,
    register,
    get,
    list,
  };
};
