const api = require('../api')
const getTestUsers = require('./getTestUsers')
const ensureTestOrgsExist = require('./ensureTestOrgsExist')
const _find = require('lodash/find')
const _filter = require('lodash/filter')
const _get = require('lodash/get')
const config = require('../config')
const { token } = config.testSuperAdmin
const { testUsers1, testUsers2 } = require('../config/testUsers')
const configTestUsers = [...Object.values(testUsers1), ...Object.values(testUsers2)]

const createSingleTestUser = async user => {
  const { fName, lName, email, password, role, orgId } = user
  const body = { fName, lName, email, password, role, orgId }
  return api({ url: '/users', method: 'post', token, body })
}

const createTestUsers = async ({ currentUsers, currentOrgs, testUsers, findOne }) => {
  const usersToCreate = []
  const responses = []

  testUsers.forEach(user => {
    const { email, orgEmail } = user
    const userOrg = _find(currentOrgs, { email: orgEmail })
    const userExists = !!_find(currentUsers, { email })
    if (!userExists) usersToCreate.push({ ...user, orgId: userOrg._id })
  })

  for await (testUser of usersToCreate) {
    const res = await createSingleTestUser(testUser)
    responses.push(res)
  }

  return findOne ? responses[0] : responses
}

module.exports = async options => {
  const email = _get(options, 'email')
  const orgEmail = _get(options, 'orgEmail')
  const currentUsers = await getTestUsers()
  const currentOrgs = await ensureTestOrgsExist()
  let testUsers = configTestUsers
  const findOne = !!email || !!orgEmail

  if (email) testUsers = _filter(configTestUsers, { email })
  if (orgEmail) testUsers = _filter(configTestUsers, { orgEmail })

  return createTestUsers({ currentUsers, currentOrgs, testUsers, findOne })
}
