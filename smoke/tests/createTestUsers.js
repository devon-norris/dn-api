const generateTestUsers = require('../utils/generateTestUsers')
const getTestOrgs = require('../utils/getTestOrgs')
const expect = require('../utils/expect')
const { testUsers1, testUsers2 } = require('../config/testUsers')
const api = require('../api')
const printMsg = require('../utils/printMsg')
const config = require('../config')
const _find = require('lodash/find')
const { token } = config.testSuperAdmin
const configTestUsers = [...Object.values(testUsers1), ...Object.values(testUsers2)]

module.exports = async () => {
  const errors = []

  // Create test users success
  const testUsersRes = await generateTestUsers()
  testUsersRes.forEach(res => {
    expect({ res, expectedStatus: 201, description: 'Successfully created test user', errors })
  })

  // Should not be able to create duplicates
  const currentOrgs = await getTestOrgs()
  for await (const configTestUser of configTestUsers) {
    const { fName, lName, email, password, role, orgEmail } = configTestUser
    const userOrg = _find(currentOrgs, { email: orgEmail })
    const body = { fName, lName, email, password, role, orgId: userOrg._id }
    const res = await api({ url: '/users', method: 'post', token, body })
    expect({ res, expectedStatus: 500, description: 'User already exists, duplicate key', errors })
  }

  printMsg({ errors, msg: 'Create test users' })
  return errors
}
