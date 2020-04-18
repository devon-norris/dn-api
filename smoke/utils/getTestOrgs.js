const api = require('../api')
const config = require('../config')
const _filter = require('lodash/filter')
const { testSuperAdmin, org: configOrg } = config
const { token } = testSuperAdmin

module.exports = async email => {
  const emailFilter = email ? email : configOrg.email
  const { data } = await api({ url: '/organizations', method: 'get', token })
  return _filter(data, { email: emailFilter })
}
