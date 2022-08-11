const pluginId = require('../utils/pluginId');

module.exports = {
  async find(ctx) {
    const entries = await strapi.entityService.findMany(`plugin::${pluginId}.log`, ctx.query);

    console.log(strapi.plugin(pluginId));

    return entries.map(entry => ({
      ...entry,
    }));
  },
};
