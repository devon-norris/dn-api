const jwt = require('jsonwebtoken')
const config = require('../config')
const _find = require('lodash/find')
const _isArray = require('lodash/isArray')

module.exports = async (users, email) => {
  const user = _isArray(users) ? _find(users, { email }) : users
  if (!user) return false
  return jwt.sign({ userId: user._id }, config.secret)
}
