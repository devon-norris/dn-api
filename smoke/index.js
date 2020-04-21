require('dotenv').config()
const handleErrors = require('./handleErrors')
const mergeErrors = require('./utils/mergeErrors')

// Default errors, to allow commmenting tests out
const createTestOrgsErrors = [],
  createTestUsersErrors = [],
  deleteTestOrgsErrors = [],
  deleteTestUsersErrors = [],
  userModelErrors = [],
  organizationModelErrors = [],
  noTokenErrors = [],
  userTokenErrors = [],
  adminTokenErrors = [],
  orgAdminTokenErrors = [],
  superAdminTokenErrors = []

// Import test suites
const createTestOrgs = require('./tests/createTestOrgs')
const createTestUsers = require('./tests/createTestUsers')
const deleteTestOrgs = require('./tests/deleteTestOrgs')
const deleteTestUsers = require('./tests/deleteTestUsers')
const userModel = require('./tests/models/user')
const organizationModel = require('./tests/models/organization')
const noToken = require('./tests/access_control/noToken')
const userToken = require('./tests/access_control/user')
const adminToken = require('./tests/access_control/admin')
const orgAdminToken = require('./tests/access_control/orgAdmin')
const superAdminToken = require('./tests/access_control/superAdmin')

const smokeTests = async () => {
  // Model Tests
  const userModelErrors = await userModel()
  const organizationModelErrors = await organizationModel()

  // Create Orgs and Users
  const createTestOrgsErrors = await createTestOrgs()
  const createTestUsersErrors = await createTestUsers()

  // Access Control Tests
  console.log('    🔑 Access Control - no token')
  const noTokenErrors = await noToken()
  console.log('    🔑 Access Control - User')
  const userTokenErrors = await userToken()
  console.log('    🔑 Access Control - Admin')
  const adminTokenErrors = await adminToken()
  console.log('    🔑 Access Control - Org Admin')
  const orgAdminTokenErrors = await orgAdminToken()
  console.log('    🔑 Access Control - Super Admin')
  const superAdminTokenErrors = await superAdminToken()

  // Delete Orgs and Users
  const deleteTestOrgsErrors = await deleteTestOrgs()
  const deleteTestUsersErrors = await deleteTestUsers()

  handleErrors(
    mergeErrors(
      createTestOrgsErrors,
      createTestUsersErrors,
      deleteTestOrgsErrors,
      deleteTestUsersErrors,
      userModelErrors,
      organizationModelErrors,
      noTokenErrors,
      userTokenErrors,
      adminTokenErrors,
      orgAdminTokenErrors,
      superAdminTokenErrors
    )
  )
}

smokeTests()
