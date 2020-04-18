const api = require('../api')
const config = require('../config')
const _filter = require('lodash/filter')
const { testSuperAdmin, user: configUser } = config
const { token } = testSuperAdmin

module.exports = async ({ email, orgId }) => {
  const url = orgId ? `/users?orgId=${orgId}` : '/users'
  const { data } = await api({ url: url, method: 'get', token })
  const findOne = !!email
  const returnData = email ? _filter(data, { email }) : data.filter(({ email }) => email.includes(configUser.email))
  return findOne ? returnData[0] : returnData
}
