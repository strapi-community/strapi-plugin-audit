const mapRoutesObject = routes => {
  if (Array.isArray(routes)) return routes.map(({ handler }) => handler);
  return Object.values(routes).map(({ routes }) => mapRoutesObject(routes));
};

module.exports = {
  mapRoutesObject,
};
