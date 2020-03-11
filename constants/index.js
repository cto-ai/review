const { getLogo } = require('./logo')
const scopes = require('./scopes')

module.exports = {
  getLogo,
  ...scopes,
}
