'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('audit')
      .service('myService')
      .getWelcomeMessage();
  },
});
