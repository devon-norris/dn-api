const api = require('../../api')
const { testOrg1 } = require('../../config/testOrganizations')
const ensureTestOrgsExist = require('../../utils/ensureTestOrgsExist')
const printMsg = require('../../utils/printMsg')
const expect = require('../../utils/expect')
const deleteTestUsers = require('../../utils/deleteTestUsers')
const config = require('../../config')
const { token } = config.testSuperAdmin

const startingData = {
  fName: 'test',
  lName: 'user5',
  email: `hansolo@${config.user.email}`,
  password: 'devotoT@17',
  role: 'user',
}

const params = { url: '/users', method: 'post', token }

module.exports = async () => {
  const errors = []

  // Ensure users are deleted and test org exists
  await deleteTestUsers()
  const testOrg = await ensureTestOrgsExist(testOrg1.email)
  const goodData = { ...startingData, orgId: testOrg._id }

  // Test success with starting data
  const createUserSuccessRes = await api({ ...params, body: goodData })
  expect({ res: createUserSuccessRes, expectedStatus: 201, description: 'User Model - creations success', errors })

  // Test bad email
  const badEmailRes = await api({ ...params, body: { ...goodData, email: 'bademail@test.c' } })
  expect({ res: badEmailRes, expectedStatus: 500, description: 'User Model - create user invalid email', errors })

  // Test bad password
  const badPasswordRes = await api({ ...params, body: { ...goodData, password: '123@@(abc' } })
  expect({ res: badPasswordRes, expectedStatus: 422, description: 'User Model - create user invalid password', errors })

  // Test bad role
  let badRoleRes = await api({ ...params, body: { ...goodData, role: 'use' } })
  expect({ res: badRoleRes, expectedStatus: 422, description: 'User Model - create user invalid role', errors })
  badRoleRes = await api({ ...params, body: { ...goodData, role: 'User' } })
  expect({ res: badRoleRes, expectedStatus: 422, description: 'User Model - create user invalid role', errors })
  badRoleRes = await api({ ...params, body: { ...goodData, role: 'ADMIN' } })
  expect({ res: badRoleRes, expectedStatus: 422, description: 'User Model - create user invalid role', errors })

  // Cleanup
  await deleteTestUsers()

  printMsg({ errors, msg: 'User Model' })
  return errors
}
