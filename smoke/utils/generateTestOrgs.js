const api = require('../api')
const getTestOrgs = require('./getTestOrgs')
const _find = require('lodash/find')
const _filter = require('lodash/filter')
const config = require('../config')
const { token } = config.testSuperAdmin
const { testOrg1, testOrg2 } = require('../config/testOrganizations')
const configTestOrgs = [testOrg1, testOrg2]

const createSingleTestOrg = async body => api({ url: '/organizations', method: 'post', token, body })

const createTestOrgs = async ({ currentOrgs, testOrgs, findOne }) => {
  const orgsToCreate = []
  const responses = []

  testOrgs.forEach(org => {
    const { email } = org
    const orgExists = !!_find(currentOrgs, { email })
    if (!orgExists) orgsToCreate.push(org)
  })

  for await (testOrg of orgsToCreate) {
    const res = await createSingleTestOrg(testOrg)
    responses.push(res)
  }

  return findOne ? responses[0] : responses
}

module.exports = async email => {
  const currentOrgs = await getTestOrgs()
  let testOrgs = configTestOrgs
  const findOne = !!email

  if (email) testOrgs = _filter(configTestOrgs, { email })

  return createTestOrgs({ currentOrgs, testOrgs, findOne })
}
