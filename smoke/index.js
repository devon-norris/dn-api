require('dotenv').config()
const handleErrors = require('./handleErrors')
const mergeErrors = require('./utils/mergeErrors')

// Default errors, to allow commmenting tests out
const createTestOrgsErrors = [],
  createTestUsersErrors = [],
  deleteTestOrgsErrors = [],
  deleteTestUsersErrors = [],
  userModelErrors = []

// Import test suites
const createTestOrgs = require('./tests/createTestOrgs')
const createTestUsers = require('./tests/createTestUsers')
const deleteTestOrgs = require('./tests/deleteTestOrgs')
const deleteTestUsers = require('./tests/deleteTestUsers')
const userModel = require('./tests/models/user')

const smokeTests = async () => {
  // Model Tests
  const userModelErrors = await userModel()

  // Create Orgs and Users
  const createTestOrgsErrors = await createTestOrgs()
  const createTestUsersErrors = await createTestUsers()

  // Access Control Tests

  // Delete Orgs and Users
  const deleteTestOrgsErrors = await deleteTestOrgs()
  const deleteTestUsersErrors = await deleteTestUsers()

  handleErrors(
    mergeErrors(
      createTestOrgsErrors,
      createTestUsersErrors,
      deleteTestOrgsErrors,
      deleteTestUsersErrors,
      userModelErrors
    )
  )
}

smokeTests()
