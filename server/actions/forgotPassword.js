const _ = require('lodash');

module.exports = ({ defaultHandler }) => ({
  name: 'authentication.forgotPassword',
  handler: async ctx => {
    const email = _.get(ctx, 'request.body.email');

    const userId = await strapi.entityService
      .findMany('admin::user', {
        filters: { email },
        limit: 1,
        fields: ['id'],
      })
      .then(users => (users.length > 0 ? users[0].id : null))
      .catch(() => undefined);

    return {
      ...defaultHandler(ctx),
      affectedEntities: JSON.stringify(userId ? [userId] : []),
      user: userId,
    };
  },
});
