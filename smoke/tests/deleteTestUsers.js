const generateTestUsers = require('../utils/generateTestUsers')
const deleteTestUsers = require('../utils/deleteTestUsers')
const expect = require('../utils/expect')
const api = require('../api')
const printMsg = require('../utils/printMsg')
const config = require('../config')
const { token } = config.testSuperAdmin

module.exports = async () => {
  const errors = []

  // Ensure users exist
  await generateTestUsers()

  // Delete users success
  const deleteTestUsersRes = await deleteTestUsers()
  deleteTestUsersRes.forEach(res => {
    expect({ res, expectedStatus: 200, description: 'User successfully deleted', errors })
  })

  // Not found
  const routeNotFoundRes = await api({ url: '/users', method: 'delete', token })
  expect({
    res: routeNotFoundRes,
    expectedStatus: 404,
    description: 'Route not found - DELETE /users (no :id)',
    errors,
  })

  // Invalid orgId
  const invalidUserIdRes = await api({ url: '/users/123', method: 'delete', token })
  expect({
    res: invalidUserIdRes,
    expectedStatus: 500,
    description: 'Delete User invalid mongo id - 123',
    errors,
  })

  // Cannot delete a user that doesn't exist
  const userDoesNotExistRes = await api({ url: '/users/5e9b6b4b5406e2222b5e61ec', method: 'delete', token })
  expect({
    res: userDoesNotExistRes,
    expectedStatus: 404,
    description: 'Delete User - resource not found',
    errors,
  })

  printMsg({ errors, msg: 'Delete test users' })
  return errors
}
