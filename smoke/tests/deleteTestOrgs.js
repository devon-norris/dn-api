const generateTestUsers = require('../utils/generateTestUsers')
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

  // Ensure Orgs and Users exist
  await generateTestUsers()

  // Cannot delete an org with users
  let deleteTestOrgsRes = await deleteTestOrgs()
  deleteTestOrgsRes.forEach(res => {
    expect({ res, expectedStatus: 403, description: 'Organization with users cannot be deleted', errors })
  })

  // Delete users, try to delete orgs again
  await deleteTestUsers()
  deleteTestOrgsRes = await deleteTestOrgs()
  deleteTestOrgsRes.forEach(res => {
    expect({ res, expectedStatus: 200, description: 'Organization successfully deleted', errors })
  })

  // Not found
  const routeNotFoundRes = await api({ url: '/organizations', method: 'delete', token })
  expect({
    res: routeNotFoundRes,
    expectedStatus: 404,
    description: 'Route not found - DELETE /organizations (no :id)',
    token,
  })

  // Invalid orgId
  const invalidOrgIdRes = await api({ url: '/organizations/123', method: 'delete', token })
  expect({
    res: invalidOrgIdRes,
    expectedStatus: 500,
    description: 'Delete Org invalid mongo id - 123',
    token,
  })

  // Cannot delete an org that doesn't exist
  const orgDoesNotExistRes = await api({ url: '/organizations/5e9b6b4b5406e2222b5e61ec', method: 'delete', token })
  expect({
    res: orgDoesNotExistRes,
    expectedStatus: 404,
    description: 'Delete Org - resource not found',
    token,
  })

  printMsg({ errors, msg: 'Delete test organizations' })
  return errors
}
