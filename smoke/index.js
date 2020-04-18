require('dotenv').config()
const handleErrors = require('./handleErrors')
const mergeErrors = require('./utils/mergeErrors')

// Import test suites
const createTestOrgs = require('./tests/createTestOrgs')
const createTestUsers = require('./tests/createTestUsers')

const smokeTests = async () => {
  const createTestOrgsErrors = await createTestOrgs()
  const createTestUsersErrors = await createTestUsers()

  handleErrors(mergeErrors(createTestOrgsErrors, createTestUsersErrors))
}

smokeTests()
