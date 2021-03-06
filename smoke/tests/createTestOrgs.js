const generateTestOrgs = require('../utils/generateTestOrgs')
const deleteTestOrgs = require('../utils/deleteTestOrgs')
const deleteTestUsers = require('../utils/deleteTestUsers')
const expect = require('../utils/expect')
const { testOrg1, testOrg2 } = require('../config/testOrganizations')
const api = require('../api')
const printMsg = require('../utils/printMsg')
const config = require('../config')
const { token } = config.testSuperAdmin
const configTestOrgs = [testOrg1, testOrg2]

module.exports = async () => {
  const errors = []

  // Cleanup previous Orgs and Users
  await deleteTestUsers()
  await deleteTestOrgs()

  // Create test orgs success
  const testOrgsRes = await generateTestOrgs()
  testOrgsRes.forEach(res => {
    expect({ res, expectedStatus: 201, description: 'Successfully created test org', errors })
  })

  // Should not be able to create duplicates
  for await (const configTestOrg of configTestOrgs) {
    const res = await api({ url: '/organizations', method: 'post', token, body: configTestOrg })
    expect({ res, expectedStatus: 500, description: 'Org already exists, duplicate key', errors })
  }

  printMsg({ errors, msg: 'Create test organizations' })
  return errors
}
