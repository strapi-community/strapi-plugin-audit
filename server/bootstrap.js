'use strict';

const initAuditMiddleware = require('./middlewares/audit');

module.exports = ({ strapi }) => {
  // Init the audit middleware
  initAuditMiddleware({ strapi });
};
