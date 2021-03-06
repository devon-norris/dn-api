const printMsg = require('../../utils/printMsg')
const generateTestUsers = require('../../utils/generateTestUsers')
const deleteTestUsers = require('../../utils/deleteTestUsers')
const mergeErrors = require('../../utils/mergeErrors')

// Import routes
const healthRoute = require('./routes/health')
const longLivedTokenRoute = require('./routes/usersLongToken')
const usersAuthenticateRoute = require('./routes/usersAuthenticate')
const usersLogoutRoute = require('./routes/usersLogout')
const permissionsRoute = require('./routes/permissions')
const organizationsRoute = require('./routes/organizations')
const usersRoute = require('./routes/users')

const { testOrg1 } = require('../../config/testOrganizations')
const { testUsers1: configTestUsers1 } = require('../../config/testUsers')
const { smoketestorg1_user1 } = configTestUsers1
const description = 'No token'

module.exports = async () => {
  // Cleanup previous users
  await deleteTestUsers()
  await generateTestUsers({ orgEmail: testOrg1.email })

  const healthErrors = await healthRoute({ description })
  const longLivedTokenErrors = await longLivedTokenRoute({ description })
  const usersAuthenticateErrors = await usersAuthenticateRoute({
    description,
    user: { email: smoketestorg1_user1.email, password: smoketestorg1_user1.password },
  })
  const usersLogoutErrors = await usersLogoutRoute({ description })
  const permissionsErrors = await permissionsRoute({ description })
  const organizationsRouteErrors = await organizationsRoute({ description })
  const usersRouteErrors = await usersRoute({ description })

  const allErrors = mergeErrors(
    healthErrors,
    longLivedTokenErrors,
    usersAuthenticateErrors,
    usersLogoutErrors,
    permissionsErrors,
    organizationsRouteErrors,
    usersRouteErrors
  )
  printMsg({ errors: allErrors, msg: 'Access Control - no token' })
  return allErrors
}
