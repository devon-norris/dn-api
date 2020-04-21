const deleteTestUsers = require('../../utils/deleteTestUsers')
const generateTestUsers = require('../../utils/generateTestUsers')
const printMsg = require('../../utils/printMsg')
const mergeErrors = require('../../utils/mergeErrors')
const { testOrg1 } = require('../../config/testOrganizations')
const {
  testSuperAdmin: {
    token,
    one: { email, id, password },
  },
} = require('../../config')

// Import routes
const healthRoute = require('./routes/health')
const longLivedTokenRoute = require('./routes/usersLongToken')
const usersAuthenticateRoute = require('./routes/usersAuthenticate')
const usersLogoutRoute = require('./routes/usersLogout')
const permissionsRoute = require('./routes/permissions')
const organizationsRoute = require('./routes/organizations')
const usersRoute = require('./routes/users')

const description = 'superadmin token'

module.exports = async () => {
  await deleteTestUsers()
  await generateTestUsers({ orgEmail: testOrg1.email })
  const user = { token, role: 'superadmin', id }

  const healthErrors = await healthRoute({ description, user })
  const longLivedTokenErrors = await longLivedTokenRoute({ description, user })
  const usersAuthenticateErrors = await usersAuthenticateRoute({
    description,
    user: { email, password },
  })
  const usersLogoutErrors = await usersLogoutRoute({ description, user })
  const permissionsErrors = await permissionsRoute({ description, user })
  const organizationsRouteErrors = await organizationsRoute({ description, user })
  const usersRouteErrors = await usersRoute({ description, user })

  const allErrors = mergeErrors(
    healthErrors,
    longLivedTokenErrors,
    usersAuthenticateErrors,
    usersLogoutErrors,
    permissionsErrors,
    organizationsRouteErrors,
    usersRouteErrors
  )
  printMsg({ errors: allErrors, msg: 'Access Control - Super Admin' })
  return allErrors
}
