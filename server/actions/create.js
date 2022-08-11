const _ = require('lodash');

module.exports = ({ defaultHandler }) => ({
  name: 'collection-types.create',
  handler: ctx => {
    const affectedEntity = _.get(ctx, 'response.body.id');

    return {
      ...defaultHandler(ctx),
      affectedEntities: JSON.stringify(affectedEntity ? [affectedEntity] : []),
    };
  },
});
