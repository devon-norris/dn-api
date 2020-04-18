const api = require('../api')
const config = require('../config')
const _filter = require('lodash/filter')
const { testSuperAdmin, org: configOrg } = config
const { token } = testSuperAdmin

module.exports = async email => {
  const emailFilter = email ? email : configOrg.email
  const { data } = await api({ url: '/organizations', method: 'get', token })
  const findOne = !!email
  const returnData = _filter(data, { email: emailFilter })
  return findOne ? returnData[0] : returnData
}
