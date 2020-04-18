const getTestOrgs = require('./getTestOrgs')
const generateTestOrgs = require('./generateTestOrgs')
const _find = require('lodash/find')
const { testOrg1, testOrg2 } = require('../config/testOrganizations')
const configTestOrgs = [testOrg1, testOrg2]

const ensureSingleOrgExists = async (currentTestOrgs, email) => {
  const testOrg = _find(currentTestOrgs, { email })
  if (testOrg) return testOrg
  const res = await generateTestOrgs(email)
  if (res.status !== 201) throw new Error('Error with ensuring that organization exists:', res)
  return res.data
}

const ensureAllTestOrgsExist = async currentTestOrgs => {
  const testOrgs = []
  for await (const configOrg of configTestOrgs) {
    const testOrg = await ensureSingleOrgExists(currentTestOrgs, configOrg.email)
    testOrgs.push(testOrg)
  }
  return testOrgs
}

module.exports = async email => {
  const currentTestOrgs = await getTestOrgs()
  return email ? ensureSingleOrgExists(currentTestOrgs, email) : ensureAllTestOrgsExist(currentTestOrgs)
}
