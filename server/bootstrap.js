'use strict';

const initAuditMiddleware = require('./middlewares/audit');
const pluginId = require('./utils/pluginId');
const _ = require('lodash');

module.exports = ({ strapi }) => {
  const actionsService = strapi.plugin(pluginId).service('actions');

  actionsService.register('collection-types.create', 'Created an entry', ctx => {
    const affectedEntity = _.get(ctx, 'response.body.id');

    return {
      ...actionsService.defaultHandler(ctx),
      affectedEntities: JSON.stringify(affectedEntity ? [affectedEntity] : []),
    };
  });

  actionsService.register('collection-types.bulkDelete', 'Deleted entries', ctx => {
    const affectedEntities = _.get(ctx, 'request.body.ids', []);

    return {
      ...actionsService.defaultHandler(ctx),
      affectedEntities: JSON.stringify(affectedEntities),
    };
  });

  // Init the audit middleware
  initAuditMiddleware({ strapi });
};
