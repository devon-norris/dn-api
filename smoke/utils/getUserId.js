const _find = require('lodash/find')
const _get = require('lodash/get')

module.exports = (usersArray, configUser) => {
  const dbUser = _find(usersArray, { email: configUser.email })
  return _get(dbUser, '_id', '')
}
