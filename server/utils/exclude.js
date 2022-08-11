const isPluginActionExcluded = (action, plugin, excludedPlugins) => {
  if (!excludedPlugins[plugin]) return false;
  else if (excludedPlugins[plugin].actions === '*') return true;
  else if (excludedPlugins[plugin].actions.includes(action)) return true;
  return false;
};

module.exports = {
  isPluginActionExcluded,
};
