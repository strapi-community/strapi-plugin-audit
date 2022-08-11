const _ = require('lodash');

module.exports = ({ defaultHandler }) => ({
  name: 'collection-types.bulkDelete',
  handler: ctx => {
    const affectedEntities = _.get(ctx, 'request.body.ids', []);

    return {
      ...defaultHandler(ctx),
      affectedEntities: JSON.stringify(affectedEntities),
    };
  },
});
