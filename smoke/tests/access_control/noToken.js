const printMsg = require('../../utils/printMsg')
const generateTestUsers = require('../../utils/generateTestUsers')
const getUserId = require('../../utils/getUserId') // need?
const ensureTestOrgsExist = require('../../utils/ensureTestOrgsExist')
const deleteTestUsers = require('../../utils/deleteTestUsers')
const mergeErrors = require('../../utils/mergeErrors')
const _omit = require('lodash/omit') // need?
const _find = require('lodash/find')
const config = require('../../config') // need?

// Import routes
const healthRoute = require('./routes/health')
const longLivedTokenRoute = require('./routes/usersLongToken')
const usersAuthenticateRoute = require('./routes/usersAuthenticate')
const usersLogoutRoute = require('./routes/usersLogout')
const permissionsRoute = require('./routes/permissions')
const organizationsRoute = require('./routes/organizations')

const { testOrg1: configTestOrg1, testOrg2: configTestOrg2 } = require('../../config/testOrganizations') // need?
const { testUsers1: configTestUsers1, testUsers2: configTestUsers2 } = require('../../config/testUsers') // need?

const { smoketestorg1_user1, smoketestorg1_admin1, smoketestorg1_orgadmin1 } = configTestUsers1
const { smoketestorg2_user1, smoketestorg2_admin1, smoketestorg2_orgadmin1 } = configTestUsers2 // need?

const description = 'No token'

module.exports = async () => {
  // Cleanup previous users
  await deleteTestUsers()

  const testOrgs = await ensureTestOrgsExist()
  const testOrg1Id = _find(testOrgs, { email: configTestOrg1.email })._id
  // const testOrg2Id = _find(testOrgs, { email: configTestOrg2.email })._id // need?
  // DB USERS:
  const testUsersRes = await generateTestUsers({ orgEmail: configTestOrg1.email })
  const testUsersOrg1 = testUsersRes.map(({ data }) => data) // need?

  const healthErrors = await healthRoute({ description })
  const longLivedTokenErrors = await longLivedTokenRoute({ description })
  const usersAuthenticateErrors = await usersAuthenticateRoute({
    description,
    user: { email: smoketestorg1_user1.email, password: smoketestorg1_user1.password },
  })
  const usersLogoutErrors = await usersLogoutRoute({ description })
  const permissionsErrors = await permissionsRoute({ description })
  const organizationsRouteErrors = await organizationsRoute({ description })

  const allErrors = mergeErrors(
    healthErrors,
    longLivedTokenErrors,
    usersAuthenticateErrors,
    usersLogoutErrors,
    permissionsErrors,
    organizationsRouteErrors
  )
  printMsg({ errors: allErrors, msg: 'Access Control - no token' })
  return allErrors
}

// '/health' GET-public
// '/users/longLivedToken' POST-superadmin
// '/users', POST-public, GET-all roles, PUT-all roles, DELETE-I think only admins and up?
// '/users/authenticate' POST-public, GET-all roles
// '/users/logout' POST-public
// '/permissions' GET-superadmin
// '/organizations' GET-public, everything else-superadmin
