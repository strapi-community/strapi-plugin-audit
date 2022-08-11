const _ = require('lodash');

module.exports = ({ defaultHandler }) => ({
  name: 'authentication.login',
  handler: ctx => {
    const affectedEntity = _.get(ctx, 'response.body.data.user.id');

    return {
      ...defaultHandler(ctx),
      affectedEntities: JSON.stringify(affectedEntity ? [affectedEntity] : []),
    };
  },
});
