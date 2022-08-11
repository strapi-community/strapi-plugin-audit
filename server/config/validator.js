const schema = require('./schema');

module.exports = async data => await schema.validate(data);
