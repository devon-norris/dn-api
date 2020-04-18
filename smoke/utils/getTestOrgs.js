const api = require('../api')
const config = require('../config')
const _filter = require('lodash/filter')
const { testSuperAdmin, org: configOrg } = config
const { token } = testSuperAdmin

module.exports = async email => {
  const { data } = await api({ url: '/organizations', method: 'get', token })
  const findOne = !!email
  const returnData = email ? _filter(data, { email }) : data.filter(({ email }) => email.includes(configOrg.email))
  return findOne ? returnData[0] : returnData
}
