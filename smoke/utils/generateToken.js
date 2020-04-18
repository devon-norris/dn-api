const jwt = require('jsonwebtoken')
const config = require('../config')
const _find = require('lodash/find')

module.exports = async (users, email) => {
  const user = _find(users, { email })
  if (!user) return false
  return jwt.sign({ userId: user._id }, config.secret)
}
