require('dotenv').config()
const handleErrors = require('./handleErrors')
const mergeErrors = require('./utils/mergeErrors')
const { createTestOrgsErrors, createTestUsersErrors, deleteTestOrgsErrors } = require('./defaultErrors')

// Import test suites
const createTestOrgs = require('./tests/createTestOrgs')
const createTestUsers = require('./tests/createTestUsers')
const deleteTestOrgs = require('./tests/deleteTestOrgs')

const smokeTests = async () => {
  // Create Orgs and Users
  const createTestOrgsErrors = await createTestOrgs()
  const createTestUsersErrors = await createTestUsers()

  // Model Tests

  // Access Control Tests

  // Delete Orgs and Users
  const deleteTestOrgsErrors = await deleteTestOrgs()

  handleErrors(mergeErrors(createTestOrgsErrors, createTestUsersErrors, deleteTestOrgsErrors))
}

smokeTests()
