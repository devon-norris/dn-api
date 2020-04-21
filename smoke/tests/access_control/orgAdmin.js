const generateTestUsers = require('../../utils/generateTestUsers')
const deleteTestUsers = require('../../utils/deleteTestUsers')
const generateToken = require('../../utils/generateToken')
const printMsg = require('../../utils/printMsg')
const mergeErrors = require('../../utils/mergeErrors')
const { testUsers1: configTestUsers1 } = require('../../config/testUsers')
const { smoketestorg1_orgadmin1 } = configTestUsers1

// Import routes
const healthRoute = require('./routes/health')
const longLivedTokenRoute = require('./routes/usersLongToken')
const usersAuthenticateRoute = require('./routes/usersAuthenticate')
const usersLogoutRoute = require('./routes/usersLogout')
const permissionsRoute = require('./routes/permissions')
const organizationsRoute = require('./routes/organizations')
const usersRoute = require('./routes/users')

const description = 'orgadmin token'

module.exports = async () => {
  await deleteTestUsers()
  const testOrgAdmin = await generateTestUsers({ email: smoketestorg1_orgadmin1.email })
  const testOrgAdminToken = await generateToken(testOrgAdmin.data)
  const user = { token: testOrgAdminToken, role: 'orgadmin', id: testOrgAdmin.data._id }

  const healthErrors = await healthRoute({ description, user })
  const longLivedTokenErrors = await longLivedTokenRoute({ description, user })
  const usersAuthenticateErrors = await usersAuthenticateRoute({
    description,
    user: { email: smoketestorg1_orgadmin1.email, password: smoketestorg1_orgadmin1.password },
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
  printMsg({ errors: allErrors, msg: 'Access Control - Org Admin' })
  return allErrors
}
