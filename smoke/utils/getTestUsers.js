const api = require('../api')
const config = require('../config')
const _filter = require('lodash/filter')
const { testSuperAdmin, user: configUser } = config
const { token } = testSuperAdmin

module.exports = async ({ email, orgId }) => {
  const url = orgId ? `/users?orgId=${orgId}` : '/users'
  const emailFilter = email ? email : configUser.email
  const { data } = await api({ url: url, method: 'get', token })
  const findOne = !!email
  const returnData = _filter(data, { email: emailFilter })
  return findOne ? returnData[0] : returnData
}
