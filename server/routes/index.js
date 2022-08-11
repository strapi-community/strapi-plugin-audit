module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/find',
        handler: 'log.find',
      },
    ],
  },
};
